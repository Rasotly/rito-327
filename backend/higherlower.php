<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$dataFile = __DIR__ . '/data/higherlower.json';

// Ensure data file exists
if (!file_exists($dataFile)) {
    if (!is_dir(__DIR__ . '/data')) {
        mkdir(__DIR__ . '/data', 0777, true);
    }
    file_put_contents($dataFile, json_encode([]));
}

$validToken = "geovalo_admin_token_2026"; // Using the same token as GeoValo

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

        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['category']) || !isset($input['item1_name']) || !isset($input['item1_image']) || !isset($input['item1_value']) || !isset($input['item2_name']) || !isset($input['item2_image']) || !isset($input['item2_value'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Eksik parametre"]);
            exit(0);
        }

        $data = json_decode(file_get_contents($dataFile), true);
        $newQuestion = [
            "id" => uniqid(),
            "category" => $input['category'],
            "item1_name" => $input['item1_name'],
            "item1_image" => $input['item1_image'],
            "item1_value" => (float)$input['item1_value'],
            "item2_name" => $input['item2_name'],
            "item2_image" => $input['item2_image'],
            "item2_value" => (float)$input['item2_value']
        ];
        $data[] = $newQuestion;
        file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
        
        echo json_encode(["status" => "success", "message" => "Soru başarıyla eklendi", "id" => $newQuestion['id']]);
        break;

    case 'delete_question':
        if (!checkToken($validToken)) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Yetkisiz erişim"]);
            exit(0);
        }
        
        $id = isset($_GET['id']) ? $_GET['id'] : '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Eksik parametre"]);
            exit(0);
        }

        $data = json_decode(file_get_contents($dataFile), true);
        $newData = array_filter($data, function($item) use ($id) {
            return $item['id'] !== $id;
        });
        
        if (count($data) === count($newData)) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Soru bulunamadı"]);
            exit(0);
        }

        file_put_contents($dataFile, json_encode(array_values($newData), JSON_PRETTY_PRINT));
        echo json_encode(["status" => "success", "message" => "Soru başarıyla silindi"]);
        break;

    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Geçersiz işlem"]);
        break;
}
?>
