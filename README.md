
# PHP Vanilla and AJAX Technical Test

**Basic Requirements:**

- Internet connection to access libraries
- Apache 2.4.54
- MySQL 8.0.30

**Usage Guide:**

1. Extract the file "dump-midcenturywareho_psdb2-202309051945.sql" from the "database.zip" archive.

2. Create a MySQL Database in your database management system called "midcenturywareho_psdb2" with the character set "utf8mb4".

3. Import "dump-midcenturywareho_psdb2-202309051945.sql" into the "midcenturywareho_psdb2" database.

4. Define the database access credentials in the "conexion.php" file, located in the "conexion" folder.
5. You're ready to use it!

**Libraries Used for Front-End Development:**

- Bootstrap 5.3.0
- jQuery 3.7.1
- DataTables jQuery

**Example of Connection File Access Variables "conexion/conexion.php"**

```php
private $host = 'host';                       // Your database host
private $username = 'username';               // Your database username
private $password = 'password';               // Your database password
private $database = 'midcenturywareho_psdb2'; // Your database name
private $charset = 'utf8mb4';                 // Character set