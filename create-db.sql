-- Create the database
CREATE DATABASE IF NOT EXISTS `api-hakan`;

-- Create the admin user if it doesn't exist
CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'admin123';
CREATE USER IF NOT EXISTS 'admin'@'127.0.0.1' IDENTIFIED BY 'admin123';

-- Grant all privileges to the admin user on the database
GRANT ALL PRIVILEGES ON `api-hakan`.* TO 'admin'@'%';
GRANT ALL PRIVILEGES ON `api-hakan`.* TO 'admin'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
