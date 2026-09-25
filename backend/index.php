<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$game = isset($_GET['game']) ? $_GET['game'] : '';

if ($game === 'valorant') {
    $response = [
        "status" => "success",
        "message" => "Valorant modülüne başarıyla bağlandınız. Ajan verileri senkronize ediliyor.",
        "stats" => [
            "activePlayers" => "2.4M",
            "serverStatus" => "Online",
            "currentAct" => "Bölüm 0, Kısım 2"
        ]
    ];
} elseif ($game === 'lol') {
    $response = [
        "status" => "success",
        "message" => "League of Legends modülüne başarıyla bağlandınız. Vadi verileri yükleniyor.",
        "stats" => [
            "activeMatches" => "145,230",
            "currentPatch" => "14.5",
            "featuredMode" => "ARAM"
        ]
    ];
} else {
    $response = [
        "status" => "error",
        "message" => "Geçersiz veya eksik oyun parametresi. Lütfen 'valorant' veya 'lol' seçin."
    ];
}

echo json_encode($response);
?>