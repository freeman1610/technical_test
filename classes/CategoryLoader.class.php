<?php
require_once('../conexion/db_connection.php');

class CategoryLoader
{
    private $db;

    public function __construct()
    {
        $this->db = new DBConnection();
    }

    public function getFormattedCategories()
    {
        try {
            $sql = "SELECT id_category, 
                    (SELECT name
                    FROM midcenturywareho_psdb2.ps_category_lang
                    WHERE id_category = ps_category.id_category) AS category_name,
                    (SELECT COUNT(id_product)
                    FROM midcenturywareho_psdb2.ps_category_product
                    WHERE id_category = ps_category.id_category) AS article_count
                    FROM midcenturywareho_psdb2.ps_category
                    WHERE id_category NOT IN (1)";

            $stmt = $this->db->connection->prepare($sql);
            $stmt->execute();

            $categories = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $categories[] = [
                    'id' => $row['id_category'],
                    'name' => $row['category_name'],
                    'article_count' => $row['article_count']
                ];
            }

            return $categories;
        } catch (PDOException $e) {
            throw new Exception("Database query error: " . $e->getMessage());
        }
    }
}
