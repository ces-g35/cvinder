#!/bin/sh

if [ $# -ne 3 ]
then
    echo "usage: $0 <access_key> <secret_access_key> <session_id>"
    exit 1
fi

keys=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "AWS_SESSION_TOKEN")
command=""
for key in "${keys[@]}"
do
    value=$1
    shift
    command="${command}; s#${key}=.*#${key}=${value}#"
done

sed -i "$command" .env