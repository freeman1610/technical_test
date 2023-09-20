<?php
class DBConnection {
    private $host = 'localhost'; // Your database host
    private $username = 'root'; // Your database username
    private $password = ''; // Your database password
    private $database = 'midcenturywareho_psdb2'; // Your database name
    private $charset = 'utf8mb4'; // Character set

    public $connection;

    public function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->database};charset={$this->charset}";
            $this->connection = new PDO($dsn, $this->username, $this->password);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }
}
