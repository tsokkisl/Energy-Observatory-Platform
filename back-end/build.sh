#!/bin/bash

platform='unknown'
unamestr=`uname`
if [[ "$unamestr" == 'Linux' ]]; then
   platform='linux'
elif [[ "$unamestr" == 'Darwin' ]]; then
   platform='OSX'
fi

cd ..
DIR=$(pwd)
BACKEND=${DIR}/back-end
CLI=${DIR}/cli-client

cd $BACKEND

# Install dependencies
npm install
cp -r ./node_modules ../cli-client

if [ $platform == 'linux' ];then 
    cd $CLI
    xterm -hold -e "cd `cat ~/.last_dir/` && cd ../cli-client && node client.js"

    cd $BACKEND
    xterm -hold -e "cd `cat ~/.last_dir/` && npm test && npm start"

elif [ $platform == 'OSX' ];then 
    cd $CLI
    osascript -e 'tell app "Terminal" to do script "cd `cat ~/.last_dir` && cd ../cli-client &&
    node client.js"'
    
    cd $BACKEND
    osascript -e 'tell app "Terminal" to do script "cd `cat ~/.last_dir` &&
    npm test &&
    npm start"'
else 
    echo "Unknown platform"
fi

function cd {
    builtin cd $@
    pwd > ~/.last_dir
}