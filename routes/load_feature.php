<?php

if (!isset($_GET['product_id'])) {
    header('Content-Type: application/json');
    // The 'product_id' parameter is missing in the URL, send an error message
    $response = [
        'status' => 'error',
        'message' => 'Error: The "product_id" parameter is missing in the URL.'
    ];
    echo json_encode($response);
    exit;
}

// Autoload classes (assuming PSR-4 autoloading)
spl_autoload_register(function ($class) {
    include '../classes/' . $class . '.class.php';
});

try {
    // Create a new instance of the FeatureLoader class
    $featureLoader = new FeatureLoader();

    // Get and format product data
    $features = $featureLoader->getFormattedFeatures($_GET['product_id']);

    // Set the response content type to JSON
    header('Content-Type: application/json');

    // Return the formatted feature data as JSON
    echo json_encode($features);
} catch (Exception $e) {
    // Handle any exceptions or errors
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => $e->getMessage()]);
}
