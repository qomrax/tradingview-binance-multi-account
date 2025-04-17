#!/bin/bash
echo "Starting database setup..."
mysql -u root -p < create-db.sql
if [ $? -eq 0 ]; then
  echo "Database setup completed successfully."
  echo "- Database 'api-ramazan' created"
  echo "- User 'admin' created and granted permissions"
else
  echo "Error setting up database."
fi
