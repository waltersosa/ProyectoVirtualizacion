#!/bin/bash

host="$1"
shift
cmd="$@"

until mongo --host mongodb --port 27017 --username root --password sosamejia --authenticationDatabase admin --eval "db.adminCommand('ping')" &>/dev/null; do
  >&2 echo "Waiting for MongoDB to start..."
  sleep 2
done

>&2 echo "MongoDB is up - executing command"
exec $cmd 