<?php
@ini_set('display_errors', '0');
@ini_set('expose_php', '0');
if (function_exists('header_remove')) {
    header_remove('X-Powered-By');
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: interest-cohort=(), browsing-topics=(), run-ad-auction=(), join-ad-interest-group=(), private-aggregation=(), camera=(), microphone=(), geolocation=()");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$dataFile = __DIR__ . '/data/geovalo.json';
$uploadsDir = __DIR__ . '/uploads/';

// Ensure data file exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Simple authentication
$adminPassword = "123"; // Very simple password for testing
$validToken = "geovalo_admin_token_2026";

function checkToken($validToken) {
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    if (empty($authHeader) && function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    }
    
    if ($authHeader === "Bearer " . $validToken) {
        return true;
    }
    return false;
}

switch ($action) {
    case 'login':
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['password']) && $input['password'] === $adminPassword) {
            echo json_encode(["status" => "success", "token" => $validToken]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Hatalı şifre"]);
        }
        break;

    case 'get_questions':
        $data = json_decode(file_get_contents($dataFile), true);
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'add_question':
        if (!checkToken($validToken)) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Yetkisiz erişim"]);
            exit(0);
        }

        if (!isset($_FILES['image']) || !isset($_POST['mapName']) || !isset($_POST['correctX']) || !isset($_POST['correctY'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Eksik parametre"]);
            exit(0);
        }

        $image = $_FILES['image'];
        $ext = pathinfo($image['name'], PATHINFO_EXTENSION);
        $newFilename = uniqid() . '.' . $ext;
        $destination = $uploadsDir . $newFilename;

        if (move_uploaded_file($image['tmp_name'], $destination)) {
            $data = json_decode(file_get_contents($dataFile), true);
            $newQuestion = [
                "id" => uniqid(),
                "mapName" => $_POST['mapName'],
                "wallImage" => "http://localhost:8081/uploads/" . $newFilename,
                "correctX" => (float)$_POST['correctX'],
                "correctY" => (float)$_POST['correctY']
            ];
            $data[] = $newQuestion;
            file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
            
            echo json_encode(["status" => "success", "data" => $newQuestion]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Resim yüklenemedi"]);
        }
        break;

    case 'delete_question':
        if (!checkToken($validToken)) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Yetkisiz erişim"]);
            exit(0);
        }
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? '';
        
        $data = json_decode(file_get_contents($dataFile), true);
        $filtered = array_filter($data, function($q) use ($id) {
            return $q['id'] !== $id;
        });
        
        file_put_contents($dataFile, json_encode(array_values($filtered), JSON_PRETTY_PRINT));
        echo json_encode(["status" => "success"]);
        break;

    default:
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Geçersiz işlem"]);
        break;
}
