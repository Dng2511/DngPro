#!/bin/bash
set -e

# Biến môi trường MongoDB được cung cấp bởi Docker container
MONGO_URI="mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017/?authSource=admin"
DB_NAME=${MONGO_INITDB_DATABASE:-vp_shop_project}

echo "Waiting for MongoDB to be fully ready..."

# Chờ MongoDB sẵn sàng
for i in {1..30}; do
    if mongosh "$MONGO_URI" --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "MongoDB is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

# Kiểm tra xem collection users có dữ liệu không
DATA_COUNT=$(mongosh "$MONGO_URI/$DB_NAME" --eval "db.users.countDocuments()" --quiet 2>/dev/null || echo "0")

if [ "$DATA_COUNT" = "0" ]; then
    echo "No data found. Restoring from backup..."

    if [ -d "/mongo_backup" ] && [ "$(ls -A /mongo_backup)" ]; then
        mongorestore --uri="$MONGO_URI" --db "$DB_NAME" /mongo_backup/ --drop
        echo "Data restoration completed!"
    else
        echo "Backup folder is empty or not found."
    fi
else
    echo "Data already exists ($DATA_COUNT documents). Skipping restoration."
fi
