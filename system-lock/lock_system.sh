#!/bin/bash
echo "🔒 Locking system until verification..."
sleep 1
pkill xfce4-screensaver  # Stop default screensaver
xscreensaver &  # Start our screensaver
xscreensaver-command -lock
chromium --kiosk http://localhost:3000 &
echo "System locked. Authenticate at http://localhost:3000"
