#!/bin/sh

# Attente que MySQL soit disponible (exemple avec netcat)
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
  sleep 10
done

echo "MySQL is up - starting app..."

exec "$@" #"$@" représente tous les arguments passés au script shell (entrypoint.sh) sous forme de liste.