<?php

if (!isset($_GET['category_id'])) {
    header('Content-Type: application/json');
    // The 'category_id' parameter is missing in the URL, send an error message
    $response = [
        'status' => 'error',
        'message' => 'Error: The "category_id" parameter is missing in the URL.'
    ];
    echo json_encode($response);
    exit;
}

// Autoload classes (assuming PSR-4 autoloading)
spl_autoload_register(function ($class) {
    include '../classes/' . $class . '.class.php';
});

try {
    // Create a new instance of the ProductLoader class
    $productLoader = new ProductLoader();

    // Get and format product data
    $products = $productLoader->getFormattedProducts($_GET['category_id']);

    // Set the response content type to JSON
    header('Content-Type: application/json');

    // Return the formatted product data as JSON
    echo json_encode($products);
} catch (Exception $e) {
    // Handle any exceptions or errors
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => $e->getMessage()]);
}
