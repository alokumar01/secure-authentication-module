#!/bin/bash
USERNAME=$1
LOG_FILE="/tmp/computer_access_log.txt"

echo "🔓 Unlocking system..."
xscreensaver-command -exit
pkill -u rootkumar chromium  # Hardcode VM user
echo "System unlocked for $USERNAME!"
echo "Access granted to $USERNAME at $(date +%s)" >> $LOG_FILE
