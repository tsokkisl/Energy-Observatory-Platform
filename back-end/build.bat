@echo off
call npm update
call npm install
set folder= %cd%\node_modules
cd ..
set destination= %cd%\cli-client\node_modules
robocopy %folder% %destination% /E
start cmd.exe /k "cd cli-client && node client.js"
cd back-end
start cmd.exe /k "npm test"
call npm start
pause