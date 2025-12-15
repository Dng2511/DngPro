echo "Waiting for MongoDB to be ready..."
sleep 5 # Wait for MongoDB to start
echo "Checking if database '$MONGO_INITDB_DATABASE' exists..."
DB_EXISTS=$(mongosh admin -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --quiet --eval "db.getMongo().getDBNames().includes('$MONGO_INITDB_DATABASE')")
if [ "$DB_EXISTS" = "true" ]; then
  echo "Database '$MONGO_INITDB_DATABASE' already exists. Skip restore."
  exit 0
fi
echo "Database '$MONGO_INITDB_DATABASE' not found. Starting restore..."
if [ -d "/mongo_backup" ]; then
  echo "Backup directory found:"
  ls -la /mongo_backup/
  mongorestore --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/?authSource=admin" --db "$MONGO_INITDB_DATABASE" /mongo_backup --drop --verbose
  echo "Restore completed."
else
  echo "No backup directory found at /mongo_backup"
fi 