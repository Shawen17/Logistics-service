# setup-db.sh
# Source the .env file to load environment variables
if [ -f ./.env ]; then
  export $(grep -v '^#' ./.env | xargs)
fi

# Substitute environment variables in the SQL file and execute it
envsubst < ./data.sql | mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE
