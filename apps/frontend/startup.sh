#!/bin/bash

set -x

folder_path="/www/assets"

file_path=$(find "$folder_path" -type f -name "index*.js" -print -quit)

if [ -n "$file_path" ]; then    
    envsubst '${BACKEND_URL}' < "$file_path" > tmp.js
    mv tmp.js "$file_path"
    echo "URL substituted."
else
    echo "No JavaScript file found."
fi

nginx -g 'daemon off;'