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
    include 'valorant/valorant.php';
} elseif ($game === 'lol') {
    include 'lol/lol.php';
} else {
    $response = [
        "status" => "error",
        "message" => "Geçersiz veya eksik oyun parametresi. Lütfen 'valorant' veya 'lol' seçin."
    ];
}

echo json_encode($response);
?>