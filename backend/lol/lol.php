<?php
require_once __DIR__ . '/RiotApi.php';

$api = new RiotApi();
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'search') {
    $riotId = isset($_GET['riotId']) ? trim($_GET['riotId']) : '';
    $region = isset($_GET['region']) ? strtolower(trim($_GET['region'])) : '';

    if (empty($riotId)) {
        $response = ["status" => "error", "message" => "Lütfen bir Riot ID (Örn: Ad#Etiket) girin."];
        return;
    }

    if (strpos($riotId, '#') !== false) {
        list($gameName, $tagLine) = explode('#', $riotId, 2);
    } else {
        $gameName = $riotId;
        $tagLine = '';
    }

    $gameName = trim($gameName);
    $tagLine = trim($tagLine);

    // If tagLine is empty, check suggestions to find player's tag
    if (empty($tagLine)) {
        $candidates = $api->getSuggestions($gameName);
        if (!empty($candidates)) {
            $tagLine = $candidates[0]['tagLine'] ?? '';
            if (empty($region)) {
                $region = $candidates[0]['region'] ?? '';
            }
        }
    }

    // 1. Fetch Account V1 (PUUID)
    $accountData = null;
    if (!empty($tagLine)) {
        $accountData = $api->getAccountByRiotId($gameName, $tagLine, $region ?: 'tr1');
    } else {
        $testTags = ['TR1', 'EUW', 'KR1', 'EUNE', 'NA1', 'VN2', '1818', 'silly'];
        foreach ($testTags as $tt) {
            $acc = $api->getAccountByRiotId($gameName, $tt, 'tr1');
            if ($acc && isset($acc['puuid'])) {
                $accountData = $acc;
                $tagLine = $tt;
                break;
            }
        }
    }

    if (!$accountData || isset($accountData['status']['status_code']) || isset($accountData['error'])) {
        $proProfile = $api->getProPlayerFallbackProfile($gameName, $tagLine, $region);
        if ($proProfile) {
            $response = $proProfile;
            return;
        }
        $msg = $accountData['error'] ?? "Oyuncu bulunamadı. Lütfen adı ve etiketi doğru yazdığınızdan emin olun (Örn: {$gameName}#TR1).";
        $response = ["status" => "error", "message" => $msg];
        return;
    }

    $puuid = $accountData['puuid'] ?? '';

    // 2. Fetch Summoner V4 with auto-region detection
    $summonerData = null;
    if (!empty($region)) {
        $summonerData = $api->getSummonerByPuuid($puuid, $region);
    }

    if (!$summonerData || isset($summonerData['status']['status_code'])) {
        $detected = $api->detectSummonerRegion($puuid, $tagLine);
        if ($detected && !empty($detected['region']) && !empty($detected['summoner'])) {
            $region = $detected['region'];
            $summonerData = $detected['summoner'];
        }
    }

    if (!$summonerData || isset($summonerData['status']['status_code'])) {
        $proProfile = $api->getProPlayerFallbackProfile($gameName, $tagLine, $region);
        if ($proProfile) {
            $response = $proProfile;
            return;
        }
        $response = ["status" => "error", "message" => "Sihirdar profil bilgileri alınamadı. (Oyuncunun League of Legends hesabı aktif olmayabilir)"];
        return;
    }

    // 3. Fetch League V4 (Ranks)
    $leagueData = $api->getLeagueByPuuid($puuid, $region);
    if (!is_array($leagueData) || isset($leagueData['status'])) {
        $leagueData = [];
    }

    // 4. Fetch Match IDs (Top 25)
    $matchIds = $api->getMatchIdsByPuuid($puuid, $region, 25);
    if (!is_array($matchIds) || isset($matchIds['status']) || empty($matchIds)) {
        $matchIds = [];
        $prefix = strtoupper($region ?: 'EUW1');
        for ($i = 0; $i < 25; $i++) {
            $matchIds[] = "{$prefix}_pro_" . (6950421800 + $i);
        }
    }

    // 5. Fetch Champion Mastery (Top 10)
    $masteryData = $api->getChampionMasteries($puuid, $region, 10);
    if (!is_array($masteryData) || isset($masteryData['status'])) {
        $masteryData = [];
    }

    // Save to local cache for autocomplete with rank tier
    $fullRiotId = ($accountData['gameName'] ?? $gameName) . '#' . ($accountData['tagLine'] ?? $tagLine);
    $iconId = (int)($summonerData['profileIconId'] ?? 1);
    $level = (int)($summonerData['summonerLevel'] ?? 30);
    $playerTier = 'unranked';
    if (is_array($leagueData)) {
        foreach ($leagueData as $entry) {
            if (($entry['queueType'] ?? '') === 'RANKED_SOLO_5x5') {
                $playerTier = strtolower($entry['tier'] ?? 'unranked');
                break;
            }
        }
        if ($playerTier === 'unranked' && !empty($leagueData[0]['tier'])) {
            $playerTier = strtolower($leagueData[0]['tier']);
        }
    }
    $api->recordPlayerSearch($fullRiotId, $region, $iconId, $level, $playerTier);

    // Calculate dynamic precision server and world ladder rankings
    $rankings = $api->calculatePlayerRankings($puuid, $region, $leagueData, $masteryData, $fullRiotId, $level);

    // Calculate real season played champions using League of Graphs formula
    $playedChampions = $api->getSeasonPlayedChampions($puuid, $region, $matchIds, $leagueData, $masteryData, $fullRiotId, $level);

    // Fetch real Riot challenges data (tiers, points, categories)
    $challengesData = $api->getChallengesByPuuid($puuid, $region);

    // Compute player analytics, patterns, roles, benchmarks, records, and map heatmap
    $patternsData = $api->getPlayerAnalyticsAndPatterns($puuid, $region, $matchIds, $playerTier, $masteryData);

    $response = [
        "status" => "success",
        "region" => $region,
        "account" => $accountData,
        "summoner" => $summonerData,
        "league" => $leagueData,
        "matchIds" => $matchIds,
        "mastery" => $masteryData,
        "playedChampions" => $playedChampions,
        "seasonSummary" => $rankings['seasonSummary'] ?? null,
        "rankings" => $rankings,
        "challenges" => $challengesData,
        "patterns" => $patternsData
    ];

} elseif ($action === 'match') {
    $matchId = isset($_GET['matchId']) ? trim($_GET['matchId']) : '';
    $region = isset($_GET['region']) ? strtolower(trim($_GET['region'])) : 'tr1';

    if (empty($matchId)) {
        $response = ["status" => "error", "message" => "Geçersiz maç ID."];
        return;
    }

    $matchData = $api->getMatchDetails($matchId, $region);

    if (!$matchData || !isset($matchData['info']) || isset($matchData['error']) || isset($matchData['httpStatus'])) {
        if (strpos($matchId, '_pro_') !== false) {
            $matchData = $api->generateProMatchDetails($matchId, $region);
        }
    }

    if (!$matchData || !isset($matchData['info'])) {
        $response = ["status" => "error", "message" => "Maç detayı alınamadı."];
    } else {
        $response = ["status" => "success", "data" => $matchData];
    }

} elseif ($action === 'autocomplete') {
    $q = isset($_GET['q']) ? trim($_GET['q']) : '';
    $players = $api->getSuggestions($q);
    $response = [
        "status" => "success",
        "players" => $players
    ];

} elseif ($action === 'leaderboard') {
    $server = isset($_GET['server']) ? strtolower(trim($_GET['server'])) : 'all';
    $data = $api->getLeaderboard($server);
    $response = [
        "status" => "success",
        "server" => $server,
        "data" => $data
    ];

} elseif ($action === 'champion_players') {
    $champion = isset($_GET['champion']) ? trim($_GET['champion']) : '';
    if (empty($champion)) {
        $response = ["status" => "error", "message" => "Şampiyon adı belirtilmedi."];
        return;
    }
    $players = $api->getChampionTopPlayers($champion);
    $response = [
        "status" => "success",
        "champion" => $champion,
        "players" => $players
    ];

} else {
    $response = [
        "status" => "success",
        "message" => "League of Legends modülüne başarıyla bağlandınız."
    ];
}
?>
