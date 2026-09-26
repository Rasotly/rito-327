<?php

class RiotApi {
    private string $apiKey;
    
    private array $routingMap = [
        'tr1'  => 'europe',
        'euw1' => 'europe',
        'eun1' => 'europe',
        'ru'   => 'europe',
        'na1'  => 'americas',
        'br1'  => 'americas',
        'la1'  => 'americas',
        'la2'  => 'americas',
        'kr'   => 'asia',
        'jp1'  => 'asia',
        'oc1'  => 'sea',
        'ph2'  => 'sea',
        'sg2'  => 'sea',
        'th2'  => 'sea',
        'tw2'  => 'sea',
        'vn2'  => 'sea'
    ];

    public function __construct() {
        $this->apiKey = $this->loadApiKey();
    }

    /**
     * Loads the Riot API key from environment variables or .env file.
     */
    private function loadApiKey(): string {
        // 1. Check getenv and $_ENV
        $key = getenv('RIOT_API_KEY');
        if (!empty($key)) return trim($key);
        if (!empty($_ENV['RIOT_API_KEY'])) return trim($_ENV['RIOT_API_KEY']);
        if (!empty($_SERVER['RIOT_API_KEY'])) return trim($_SERVER['RIOT_API_KEY']);

        // 2. Check backend/.env
        $backendEnv = dirname(__DIR__) . '/.env';
        if (file_exists($backendEnv)) {
            $parsed = $this->parseEnvFile($backendEnv);
            if (!empty($parsed['RIOT_API_KEY'])) {
                return trim($parsed['RIOT_API_KEY']);
            }
        }

        // 3. Check root .env
        $rootEnv = dirname(dirname(__DIR__)) . '/.env';
        if (file_exists($rootEnv)) {
            $parsed = $this->parseEnvFile($rootEnv);
            if (!empty($parsed['RIOT_API_KEY'])) {
                return trim($parsed['RIOT_API_KEY']);
            }
        }

        return '';
    }

    private function parseEnvFile(string $filePath): array {
        $data = [];
        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!$lines) return $data;

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($k, $v) = explode('=', $line, 2);
                $k = trim($k);
                $v = trim($v, " \t\n\r\0\x0B\"'");
                $data[$k] = $v;
            }
        }
        return $data;
    }

    public function getRouting(string $region): string {
        return $this->routingMap[$region] ?? 'europe';
    }

    public function getCacheDir(): string {
        $dir = __DIR__ . '/cache';
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        return $dir;
    }

    private function makeRequest(string $url): ?array {
        if (empty($this->apiKey)) {
            return ['error' => 'Riot API anahtarı bulunamadı. Lütfen backend/.env dosyasını kontrol edin.'];
        }

        $separator = (strpos($url, '?') !== false) ? '&' : '?';
        $fullUrl = $url . $separator . 'api_key=' . $this->apiKey;

        $ctx = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 8,
                'ignore_errors' => true,
                'header' => "User-Agent: RiotClient/1.0\r\n"
            ]
        ]);

        $res = @file_get_contents($fullUrl, false, $ctx);
        if ($res === false) {
            return null;
        }

        return json_decode($res, true);
    }

    /**
     * Account-V1: Fetch account by Riot ID (GameName + TagLine)
     * Falls back to other regional clusters (asia, sea, americas, europe) if not found on default
     */
    public function getAccountByRiotId(string $gameName, string $tagLine, string $region): ?array {
        // If query contains pluses from URL, replace with space
        $gameNameClean = str_replace('+', ' ', $gameName);
        $encodedName = rawurlencode($gameNameClean);
        $encodedTag = rawurlencode($tagLine);

        $primaryRouting = $this->getRouting($region);
        $routes = array_unique([$primaryRouting, 'asia', 'sea', 'europe', 'americas']);

        foreach ($routes as $route) {
            $url = "https://{$route}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{$encodedName}/{$encodedTag}";
            $res = $this->makeRequest($url);
            if ($res && isset($res['puuid'])) {
                return $res;
            }
        }

        // Also check with collapsed/expanded spaces if name has multiple spaces
        if (strpos($gameNameClean, ' ') !== false) {
            $altNames = [
                preg_replace('/\s+/', ' ', $gameNameClean),
                str_replace(' ', '           ', $gameNameClean) // e.g. ca           koi
            ];
            foreach ($altNames as $alt) {
                $encAlt = rawurlencode($alt);
                foreach ($routes as $route) {
                    $url = "https://{$route}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{$encAlt}/{$encodedTag}";
                    $res = $this->makeRequest($url);
                    if ($res && isset($res['puuid'])) {
                        return $res;
                    }
                }
            }
        }

        return $res ?? null;
    }

    /**
     * Summoner-V4: Fetch summoner details by PUUID
     */
    public function getSummonerByPuuid(string $puuid, string $region): ?array {
        $url = "https://{$region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{$puuid}";
        return $this->makeRequest($url);
    }

    /**
     * League-V4: Fetch ranked entries by PUUID
     */
    public function getLeagueByPuuid(string $puuid, string $region): ?array {
        $url = "https://{$region}.api.riotgames.com/lol/league/v4/entries/by-puuid/{$puuid}";
        return $this->makeRequest($url);
    }

    /**
     * Match-V5: Fetch recent match IDs by PUUID
     */
    public function getMatchIdsByPuuid(string $puuid, string $region, int $count = 10): ?array {
        $routing = $this->getRouting($region);
        $url = "https://{$routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/{$puuid}/ids?start=0&count={$count}";
        return $this->makeRequest($url);
    }

    /**
     * Match-V5: Fetch full match details by Match ID
     */
    public function getMatchDetails(string $matchId, string $region): ?array {
        $routing = $this->getRouting($region);
        $url = "https://{$routing}.api.riotgames.com/lol/match/v5/matches/{$matchId}";
        return $this->makeRequest($url);
    }

    /**
     * Champion-Mastery-V4: Fetch top champion masteries by PUUID
     */
    public function getChampionMasteries(string $puuid, string $region, int $count = 10): ?array {
        $url = "https://{$region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{$puuid}/top?count={$count}";
        return $this->makeRequest($url);
    }

    /**
     * Top 100 Leaderboard across specific server or global with 60-second caching
     */
    public function getLeaderboard(string $targetServer = 'all'): array {
        $allowed = ['all', 'kr', 'euw1', 'na1', 'tr1', 'eun1', 'vn2'];
        if (!in_array($targetServer, $allowed)) {
            $targetServer = 'all';
        }

        $cacheFile = $this->getCacheDir() . "/leaderboard_{$targetServer}.json";
        if (file_exists($cacheFile)) {
            $content = @file_get_contents($cacheFile);
            if ($content) {
                $cache = json_decode($content, true);
                if ($cache && isset($cache['timestamp'], $cache['data'])) {
                    if ((time() - $cache['timestamp']) < 60 && !empty($cache['data'])) {
                        return [
                            'source' => 'cache',
                            'server' => $targetServer,
                            'timestamp' => $cache['timestamp'],
                            'nextUpdateIn' => 60 - (time() - $cache['timestamp']),
                            'leaderboard' => $cache['data']
                        ];
                    }
                }
            }
        }

        $allPlayers = [];

        if ($targetServer === 'all') {
            $servers = ['kr', 'euw1', 'na1', 'tr1', 'eun1', 'vn2'];
            foreach ($servers as $srv) {
                $url = "https://{$srv}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5";
                $res = $this->makeRequest($url);
                if ($res && isset($res['entries']) && is_array($res['entries'])) {
                    foreach ($res['entries'] as $entry) {
                        $entry['server'] = $srv;
                        $entry['tier'] = 'CHALLENGER';
                        $allPlayers[] = $entry;
                    }
                }
            }
        } else {
            $url = "https://{$targetServer}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5";
            $res = $this->makeRequest($url);
            if ($res && isset($res['entries']) && is_array($res['entries'])) {
                foreach ($res['entries'] as $entry) {
                    $entry['server'] = $targetServer;
                    $entry['tier'] = 'CHALLENGER';
                    $allPlayers[] = $entry;
                }
            }
        }

        if (empty($allPlayers)) {
            if (isset($cache['data'])) {
                return [
                    'source' => 'stale_cache',
                    'server' => $targetServer,
                    'timestamp' => $cache['timestamp'] ?? time(),
                    'nextUpdateIn' => 60,
                    'leaderboard' => $cache['data']
                ];
            }
            return ['source' => 'empty', 'server' => $targetServer, 'timestamp' => time(), 'nextUpdateIn' => 60, 'leaderboard' => []];
        }

        // Sort by LP descending
        usort($allPlayers, function($a, $b) {
            return ($b['leaguePoints'] ?? 0) <=> ($a['leaguePoints'] ?? 0);
        });

        $top100 = array_slice($allPlayers, 0, 100);

        // Load PUUID cache
        $puuidCacheFile = $this->getCacheDir() . '/puuid_names.json';
        $puuidNames = [];
        if (file_exists($puuidCacheFile)) {
            $namesContent = @file_get_contents($puuidCacheFile);
            if ($namesContent) {
                $puuidNames = json_decode($namesContent, true) ?: [];
            }
        }

        // Identify players needing resolution
        $toResolve = [];
        foreach ($top100 as $idx => $player) {
            $puuid = $player['puuid'] ?? '';
            if (!$puuid) continue;
            $hasName = isset($puuidNames[$puuid]['gameName']) && strpos($puuidNames[$puuid]['gameName'], 'Challenger') !== 0;
            $hasIcon = !empty($puuidNames[$puuid]['profileIconId']);
            if (!$hasName || !$hasIcon) {
                $toResolve[] = [
                    'puuid' => $puuid,
                    'server' => $player['server'] ?? $targetServer
                ];
            }
        }

        // Batch resolve uncached players using curl_multi in chunks of 15
        if (!empty($toResolve)) {
            $chunks = array_chunk($toResolve, 15);
            foreach ($chunks as $batch) {
                // 1. Account names
                $mh = curl_multi_init();
                $handles = [];
                foreach ($batch as $item) {
                    $puuid = $item['puuid'];
                    $srv = $item['server'];
                    $routing = ($srv === 'vn2' || $srv === 'kr') ? 'asia' : $this->getRouting($srv);
                    $accUrl = "https://{$routing}.api.riotgames.com/riot/account/v1/accounts/by-puuid/{$puuid}?api_key={$this->apiKey}";
                    $ch = curl_init($accUrl);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, ["User-Agent: RiotClient/1.0"]);
                    curl_multi_add_handle($mh, $ch);
                    $handles[$puuid] = $ch;
                }
                $running = null;
                do {
                    curl_multi_exec($mh, $running);
                    curl_multi_select($mh);
                } while ($running > 0);
                foreach ($handles as $puuid => $ch) {
                    $c = curl_multi_getcontent($ch);
                    curl_multi_remove_handle($mh, $ch);
                    curl_close($ch);
                    if ($c) {
                        $j = json_decode($c, true);
                        if (isset($j['gameName'], $j['tagLine'])) {
                            if (!isset($puuidNames[$puuid])) $puuidNames[$puuid] = [];
                            $puuidNames[$puuid]['gameName'] = $j['gameName'];
                            $puuidNames[$puuid]['tagLine'] = $j['tagLine'];
                        }
                    }
                }
                curl_multi_close($mh);

                // 2. Summoner icons and levels
                $mh = curl_multi_init();
                $handles = [];
                foreach ($batch as $item) {
                    $puuid = $item['puuid'];
                    $srv = $item['server'];
                    $sumUrl = "https://{$srv}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{$puuid}?api_key={$this->apiKey}";
                    $ch = curl_init($sumUrl);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, ["User-Agent: RiotClient/1.0"]);
                    curl_multi_add_handle($mh, $ch);
                    $handles[$puuid] = $ch;
                }
                $running = null;
                do {
                    curl_multi_exec($mh, $running);
                    curl_multi_select($mh);
                } while ($running > 0);
                foreach ($handles as $puuid => $ch) {
                    $c = curl_multi_getcontent($ch);
                    curl_multi_remove_handle($mh, $ch);
                    curl_close($ch);
                    if ($c) {
                        $j = json_decode($c, true);
                        if (isset($j['profileIconId'])) {
                            if (!isset($puuidNames[$puuid])) $puuidNames[$puuid] = [];
                            $puuidNames[$puuid]['profileIconId'] = $j['profileIconId'];
                            $puuidNames[$puuid]['summonerLevel'] = $j['summonerLevel'] ?? 30;
                        }
                    }
                }
                curl_multi_close($mh);

                @file_put_contents($puuidCacheFile, json_encode($puuidNames, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                if (count($chunks) > 1) {
                    usleep(150000); // 150ms between chunks
                }
            }
        }

        // Attach resolved info
        foreach ($top100 as $idx => &$player) {
            $puuid = $player['puuid'] ?? '';
            $player['rankPosition'] = $idx + 1;
            if (!empty($puuid) && isset($puuidNames[$puuid]) && !empty($puuidNames[$puuid]['gameName'])) {
                $player['gameName'] = $puuidNames[$puuid]['gameName'];
                $player['tagLine'] = $puuidNames[$puuid]['tagLine'];
                $player['riotId'] = $player['gameName'] . '#' . $player['tagLine'];
                $player['profileIconId'] = $puuidNames[$puuid]['profileIconId'] ?? 1;
                $player['summonerLevel'] = $puuidNames[$puuid]['summonerLevel'] ?? 100;
            } else {
                $srvClean = strtoupper($player['server'] ?? $targetServer);
                $player['gameName'] = $puuidNames[$puuid]['gameName'] ?? ('Challenger ' . ($idx + 1));
                $player['tagLine'] = $puuidNames[$puuid]['tagLine'] ?? $srvClean;
                $player['riotId'] = $player['gameName'] . '#' . $player['tagLine'];
                $player['profileIconId'] = $puuidNames[$puuid]['profileIconId'] ?? 1;
                $player['summonerLevel'] = $puuidNames[$puuid]['summonerLevel'] ?? 100;
            }
        }
        unset($player);

        $now = time();
        $cacheData = [
            'timestamp' => $now,
            'server' => $targetServer,
            'data' => $top100
        ];
        @file_put_contents($cacheFile, json_encode($cacheData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return [
            'source' => 'live',
            'server' => $targetServer,
            'timestamp' => $now,
            'nextUpdateIn' => 60,
            'leaderboard' => $top100
        ];
    }

    /**
     * Detects which server a summoner has an active League of Legends account on
     */
    public function detectSummonerRegion(string $puuid, ?string $hintTag = null): ?array {
        $cacheDir = $this->getCacheDir();
        $servers = ['tr1', 'euw1', 'kr', 'na1', 'eun1', 'vn2'];

        // 1. Tag hint check
        if (!empty($hintTag)) {
            $upperTag = strtoupper(trim($hintTag));
            $tagMap = [
                'KR' => 'kr', 'KR1' => 'kr',
                'TR' => 'tr1', 'TR1' => 'tr1', 'TR2' => 'tr1',
                'EUW' => 'euw1', 'EUW1' => 'euw1',
                'EUN' => 'eun1', 'EUNE' => 'eun1',
                'NA' => 'na1', 'NA1' => 'na1',
                'VN' => 'vn2', 'VN2' => 'vn2',
                'BR' => 'br1', 'BR1' => 'br1',
                'LAN' => 'la1', 'LAS' => 'la2'
            ];
            if (isset($tagMap[$upperTag])) {
                $priority = $tagMap[$upperTag];
                $sum = $this->getSummonerByPuuid($puuid, $priority);
                if ($sum && isset($sum['summonerLevel']) && !isset($sum['status'])) {
                    return ['region' => $priority, 'summoner' => $sum];
                }
            }
        }

        // 2. Check leaderboard caches
        foreach ($servers as $srv) {
            $file = $cacheDir . "/leaderboard_{$srv}.json";
            if (file_exists($file)) {
                $raw = @file_get_contents($file);
                if ($raw && strpos($raw, $puuid) !== false) {
                    $json = json_decode($raw, true);
                    if (!empty($json['data'])) {
                        foreach ($json['data'] as $p) {
                            if (($p['puuid'] ?? '') === $puuid) {
                                $sum = $this->getSummonerByPuuid($puuid, $srv);
                                if ($sum && isset($sum['summonerLevel']) && !isset($sum['status'])) {
                                    return ['region' => $srv, 'summoner' => $sum];
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Multi-curl parallel check across candidate servers
        $mh = curl_multi_init();
        $handles = [];
        foreach ($servers as $srv) {
            $url = "https://{$srv}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{$puuid}?api_key={$this->apiKey}";
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 4);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ["User-Agent: RiotClient/1.0"]);
            curl_multi_add_handle($mh, $ch);
            $handles[$srv] = $ch;
        }

        $running = null;
        do {
            curl_multi_exec($mh, $running);
            curl_multi_select($mh);
        } while ($running > 0);

        $results = [];
        foreach ($handles as $srv => $ch) {
            $body = curl_multi_getcontent($ch);
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
            if ($body) {
                $j = json_decode($body, true);
                if ($j && isset($j['summonerLevel']) && !isset($j['status'])) {
                    $results[$srv] = $j;
                }
            }
        }
        curl_multi_close($mh);

        if (!empty($results)) {
            // Pick server with highest summoner level
            uasort($results, function($a, $b) {
                return ($b['summonerLevel'] ?? 0) <=> ($a['summonerLevel'] ?? 0);
            });
            $bestServer = array_key_first($results);
            return ['region' => $bestServer, 'summoner' => $results[$bestServer]];
        }

        return null;
    }

    /**
     * Save/update searched players into server cache for fast suggestions
     */
    public function recordPlayerSearch(string $riotId, string $region, int $iconId = 1, int $level = 30): void {
        $cacheFile = $this->getCacheDir() . '/players_cache.json';
        $players = [];
        if (file_exists($cacheFile)) {
            $content = @file_get_contents($cacheFile);
            if ($content) {
                $players = json_decode($content, true) ?: [];
            }
        }

        // Add or move to front, distinguishing by riotId + region
        $filtered = array_filter($players, function($p) use ($riotId, $region) {
            return !(strcasecmp($p['riotId'] ?? '', $riotId) === 0 && strcasecmp($p['region'] ?? '', $region) === 0);
        });

        array_unshift($filtered, [
            'riotId' => $riotId,
            'region' => $region,
            'icon'   => $iconId,
            'level'  => $level,
            'time'   => time()
        ]);

        // Keep last 150 players
        $filtered = array_slice($filtered, 0, 150);
        @file_put_contents($cacheFile, json_encode(array_values($filtered), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    /**
     * Returns cached players matching prefix across all global servers with icons and levels
     */
    public function getSuggestions(string $query): array {
        $cacheDir = $this->getCacheDir();
        $allPlayers = [];

        // 1. Load from all leaderboard caches (TR, KR, EUW, NA, EUN, VN)
        $servers = ['tr1', 'kr', 'euw1', 'na1', 'eun1', 'vn2'];
        foreach ($servers as $srv) {
            $file = $cacheDir . "/leaderboard_{$srv}.json";
            if (file_exists($file)) {
                $content = @file_get_contents($file);
                if ($content) {
                    $json = json_decode($content, true);
                    if (!empty($json['data'])) {
                        foreach ($json['data'] as $p) {
                            if (!empty($p['riotId']) && strpos($p['riotId'], 'Challenger ') !== 0) {
                                $allPlayers[] = [
                                    'riotId'   => $p['riotId'],
                                    'gameName' => $p['gameName'] ?? explode('#', $p['riotId'])[0],
                                    'tagLine'  => $p['tagLine'] ?? (explode('#', $p['riotId'])[1] ?? ''),
                                    'region'   => $p['server'] ?? $srv,
                                    'icon'     => (int)($p['profileIconId'] ?? 1),
                                    'level'    => (int)($p['summonerLevel'] ?? 100)
                                ];
                            }
                        }
                    }
                }
            }
        }

        // 2. Load from recent search cache
        $recentFile = $cacheDir . '/players_cache.json';
        if (file_exists($recentFile)) {
            $raw = @file_get_contents($recentFile);
            if ($raw) {
                $rec = json_decode($raw, true) ?: [];
                foreach ($rec as $r) {
                    if (!empty($r['riotId'])) {
                        $parts = explode('#', $r['riotId'], 2);
                        $allPlayers[] = [
                            'riotId'   => $r['riotId'],
                            'gameName' => $parts[0] ?? $r['riotId'],
                            'tagLine'  => $parts[1] ?? '',
                            'region'   => $r['region'] ?? 'tr1',
                            'icon'     => (int)($r['icon'] ?? 1),
                            'level'    => (int)($r['level'] ?? 30)
                        ];
                    }
                }
            }
        }

        // 3. Famous Popular Players Pool with exact region, icon and level
        $defaultPopular = [
            ['riotId' => 'Hide on bush#KR1', 'gameName' => 'Hide on bush', 'tagLine' => 'KR1', 'region' => 'kr', 'icon' => 6, 'level' => 940],
            ['riotId' => 'Thebausffs#EUW', 'gameName' => 'Thebausffs', 'tagLine' => 'EUW', 'region' => 'euw1', 'icon' => 4568, 'level' => 820],
            ['riotId' => 'Caps#EUW', 'gameName' => 'Caps', 'tagLine' => 'EUW', 'region' => 'euw1', 'icon' => 3200, 'level' => 650],
            ['riotId' => 'Elwind#TR1', 'gameName' => 'Elwind', 'tagLine' => 'TR1', 'region' => 'tr1', 'icon' => 4500, 'level' => 530],
            ['riotId' => 'HolyPhoenix#TR1', 'gameName' => 'HolyPhoenix', 'tagLine' => 'TR1', 'region' => 'tr1', 'icon' => 580, 'level' => 640],
            ['riotId' => 'CaitlyneAşığım#CAIT', 'gameName' => 'CaitlyneAşığım', 'tagLine' => 'CAIT', 'region' => 'tr1', 'icon' => 3460, 'level' => 420],
            ['riotId' => 'Hans Sama#EUW', 'gameName' => 'Hans Sama', 'tagLine' => 'EUW', 'region' => 'euw1', 'icon' => 534, 'level' => 580],
            ['riotId' => 'ca koi#vn444', 'gameName' => 'ca koi', 'tagLine' => 'vn444', 'region' => 'vn2', 'icon' => 54, 'level' => 320],
            ['riotId' => 'CA HUYEN#1315', 'gameName' => 'CA HUYEN', 'tagLine' => '1315', 'region' => 'euw1', 'icon' => 29, 'level' => 210],
            ['riotId' => 'Doublelift#NA1', 'gameName' => 'Doublelift', 'tagLine' => 'NA1', 'region' => 'na1', 'icon' => 512, 'level' => 710],
            ['riotId' => 'Bjergsen#NA1', 'gameName' => 'Bjergsen', 'tagLine' => 'NA1', 'region' => 'na1', 'icon' => 715, 'level' => 690],
            ['riotId' => 'Agurin#EUW', 'gameName' => 'Agurin', 'tagLine' => 'EUW', 'region' => 'euw1', 'icon' => 4220, 'level' => 890],
            ['riotId' => 'Dopa#KR1', 'gameName' => 'Dopa', 'tagLine' => 'KR1', 'region' => 'kr', 'icon' => 1, 'level' => 510],
            ['riotId' => 'Chovy#KR1', 'gameName' => 'Chovy', 'tagLine' => 'KR1', 'region' => 'kr', 'icon' => 20, 'level' => 840],
            ['riotId' => 'ShowMaker#KR1', 'gameName' => 'ShowMaker', 'tagLine' => 'KR1', 'region' => 'kr', 'icon' => 45, 'level' => 880],
            ['riotId' => 'Zeus#KR1', 'gameName' => 'Zeus', 'tagLine' => 'KR1', 'region' => 'kr', 'icon' => 25, 'level' => 620]
        ];

        foreach ($defaultPopular as $dp) {
            $allPlayers[] = $dp;
        }

        // Deduplicate by riotId + region so identical names on different regions both show
        $unique = [];
        foreach ($allPlayers as $p) {
            $key = mb_strtolower($p['riotId'], 'UTF-8') . '@' . mb_strtolower($p['region'], 'UTF-8');
            if (!isset($unique[$key])) {
                $unique[$key] = $p;
            }
        }

        $q = mb_strtolower(trim($query), 'UTF-8');
        if (empty($q)) {
            return array_slice(array_values($unique), 0, 7);
        }

        $matches = [];
        foreach ($unique as $item) {
            $riotIdLower = mb_strtolower($item['riotId'], 'UTF-8');
            $gameNameLower = mb_strtolower($item['gameName'], 'UTF-8');

            if (mb_strpos($gameNameLower, $q, 0, 'UTF-8') === 0 || mb_strpos($riotIdLower, $q, 0, 'UTF-8') === 0) {
                $item['priority'] = 1; // Starts with query
                $matches[] = $item;
            } elseif (mb_strpos($gameNameLower, $q, 0, 'UTF-8') !== false || mb_strpos($riotIdLower, $q, 0, 'UTF-8') !== false) {
                $item['priority'] = 2; // Contains query
                $matches[] = $item;
            }
        }

        usort($matches, function($a, $b) {
            if ($a['priority'] !== $b['priority']) {
                return $a['priority'] <=> $b['priority'];
            }
            return strcasecmp($a['riotId'], $b['riotId']);
        });

        return array_slice($matches, 0, 7);
    }
}
