<?php
// Database connection settings
$host = 'localhost'; 
$dbname = 'minesweeper';
$username = 'root'; 
$password = ''; 

try {
    // Create a new PDO connection
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query to fetch users sorted by score 
    $stmt = $conn->prepare("SELECT username, score FROM users ORDER BY score DESC");
    $stmt->execute();

    // Fetch data as an associative array
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the data as JSON
    header('Content-Type: application/json');
    echo json_encode($users);
} catch (PDOException $e) {
    // Return error message
    echo json_encode(['error' => $e->getMessage()]);
}
?>
