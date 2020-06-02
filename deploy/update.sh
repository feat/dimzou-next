#!/bin/bash
FILE_NAME=__PACKAGE__
DIRECTORY=__DIRECTORY__

tar -xf /tmp/fe-build/$FILE_NAME --directory $DIRECTORY

if [ `uname -s` = "Darwin" ]; then
    ps x | grep 'node /Users/lam/feat-web-develop/server/index.js' | grep -v grep | awk '{print $1}' | xargs kill -15
    
elif [ `uname -s` = "Linux" ]; then
    /usr/bin/node /usr/bin/pm2 reload feat-web 
fi
