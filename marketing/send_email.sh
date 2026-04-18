#!/bin/bash
# Helper script to send one email via Gmail browser automation
# Usage: ./send_email.sh <to_email> <subject> <body>

TO="$1"
SUBJECT="$2"
BODY="$3"

# Click compose
openclaw browser click e95 2>&1

sleep 2

# Get snapshot to find the compose window
SNAP=$(openclaw browser snapshot 2>&1)

# Fill recipient
openclaw browser fill '[{"ref":"e-to-or-similar","value":"'"$TO"'"}]' 2>&1 || true

echo "Opened compose for: $TO"
