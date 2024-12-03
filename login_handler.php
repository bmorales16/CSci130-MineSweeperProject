<?php
session_start();

// Database configuration
$servername = "localhost";
$dbname = "minesweeper";
$username = "root";
$password = "";

// Connect to the database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form data is sent
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // Prepare and execute SQL query
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $user, $pass);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Successful login
        $_SESSION['username'] = $user;
        header("Location: main.html");
        exit();
    } else {
        // Login failed
        echo "<script>alert('Invalid username or password!'); window.location.href = 'login.html';</script>";
    }

    $stmt->close();
}

$conn->close();
?>
