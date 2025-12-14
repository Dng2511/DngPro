#!/bin/sh
echo "Waiting for MongoDB to authenticate..."
sleep 5
echo "Starting restore from /mongo_backup..."
if [ -d "/mongo_backup" ]; then
  echo "Backup directory found"
  ls -la /mongo_backup/
  mongorestore --uri="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/?authSource=admin" --db "$MONGO_INITDB_DATABASE" /mongo_backup/ --drop --verbose 2>&1 | head -100
  echo "Restore completed"
else
  echo "No backup directory found at /mongo_backup"
fi
