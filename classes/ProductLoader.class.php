<?php
require_once('../conexion/db_connection.php');

class ProductLoader
{
    private $db;

    public function __construct()
    {
        $this->db = new DBConnection();
    }

    public function getFormattedProducts($category_id)
    {
        try {
            $sql = "SELECT id_product,
                    (SELECT name
                    FROM ps_product_lang
                    WHERE id_product = ps_category_product.id_product) AS name_product,
                    (SELECT COUNT(id_feature)
                    FROM ps_feature_product
                    WHERE id_product = ps_category_product.id_product) AS feature_product_count
                    FROM ps_category_product
                    WHERE id_category = $category_id
                    ORDER BY id_product";

            $stmt = $this->db->connection->prepare($sql);
            $stmt->execute();

            $products = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $products[] = [
                    'id' => $row['id_product'],
                    'name' => $row['name_product'],
                    'product_count' => $row['feature_product_count']
                ];
            }

            return $products;
        } catch (PDOException $e) {
            throw new Exception("Database query error: " . $e->getMessage());
        }
    }
}
