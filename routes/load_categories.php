<?php
// Autoload classes (assuming PSR-4 autoloading)
spl_autoload_register(function ($class) {
    include '../classes/' . $class . '.class.php';
});

try {
    // Create a new instance of the CategoryLoader class
    $categoryLoader = new CategoryLoader();

    // Get and format category data
    $categories = $categoryLoader->getFormattedCategories();

    // Set the response content type to JSON
    header('Content-Type: application/json');

    // Return the formatted category data as JSON
    echo json_encode($categories);
} catch (Exception $e) {
    // Handle any exceptions or errors
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => $e->getMessage()]);
}
