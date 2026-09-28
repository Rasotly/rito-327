<?php
// Prevent leaking PHP version and internal system paths
@ini_set('display_errors', '0');
@ini_set('expose_php', '0');
if (function_exists('header_remove')) {
    header_remove('X-Powered-By');
}

// CORS Headers
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); 
header("Content-Type: application/json; charset=utf-8");

// Security & Anti-Fingerprinting Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: interest-cohort=(), browsing-topics=(), run-ad-auction=(), join-ad-interest-group=(), private-aggregation=(), camera=(), microphone=(), geolocation=()");

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