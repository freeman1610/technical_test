<?php
require_once('../conexion/db_connection.php');

class FeatureLoader
{
    private $db;

    public function __construct()
    {
        $this->db = new DBConnection();
    }

    public function getFormattedFeatures($product_id)
    {
        try {
            $sql = "SELECT 
                    (SELECT name
                    FROM ps_feature_lang
                    WHERE id_feature = ps_feature_product.id_feature) AS feature_name,
                    (SELECT value
                    FROM ps_feature_value_lang
                    WHERE id_feature_value = ps_feature_product.id_feature_value) AS feature
                    FROM ps_feature_product
                    WHERE id_product = $product_id";

            $stmt = $this->db->connection->prepare($sql);
            $stmt->execute();

            $features = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $features[] = [
                    'name' => $row['feature_name'],
                    'feature' => $row['feature']
                ];
            }

            return $features;
        } catch (PDOException $e) {
            throw new Exception("Database query error: " . $e->getMessage());
        }
    }
}
