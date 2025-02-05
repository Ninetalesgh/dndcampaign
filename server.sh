#!/bin/bash

busybox httpd -f -p 8080 &
echo "BusyBox HTTP server started on port 8080"
node tools/ws_server.js
echo "WebSocket server started on port 8081"
