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

    // Check if username already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Username already exists
        echo "<script>alert('Username already exists! Please choose another.'); window.location.href = 'login.html';</script>";
    } else {
        // Insert new user into the database
        $stmt = $conn->prepare("INSERT INTO users (username, password, score) VALUES (?, ?, 0)");
        $stmt->bind_param("ss", $user, $pass);
        if ($stmt->execute()) {
            $_SESSION['username'] = $user;
            header("Location: main.html");
            exit();
        } else {
            echo "<script>alert('Error creating account! Please try again.'); window.location.href = 'login.html';</script>";
        }
    }

    $stmt->close();
}

$conn->close();
?>
