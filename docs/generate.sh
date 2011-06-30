#!/bin/sh

echo "Generating project documentation..."
script_dir=$(dirname $0)

cd $script_dir/node-jsdoc-toolkit
node app/run.js -c=conf/default.conf

