-- Create the database
CREATE DATABASE IF NOT EXISTS `api-customer_name`;

-- Create the admin user if it doesn't exist
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'admin123';
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin123';

-- Grant all privileges to the admin user on the database
GRANT ALL PRIVILEGES ON `api-customer_name`.* TO 'admin'@'%';
GRANT ALL PRIVILEGES ON `api-customer_name`.* TO 'admin'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
