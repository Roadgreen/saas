#!/bin/bash
# Compose and send one email via Gmail prefill URL
# Usage: ./compose_and_send.sh "recipient@email.com" "Subject" "Body text"

TO="$1"
SUBJECT="$2"
BODY="$3"

# URL encode function
urlencode() {
    python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.stdin.read().rstrip('\n'), safe=''))" <<< "$1"
}

ENC_TO=$(urlencode "$TO")
ENC_SUBJECT=$(urlencode "$SUBJECT")
ENC_BODY=$(urlencode "$BODY")

GMAIL_URL="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${ENC_TO}&su=${ENC_SUBJECT}&body=${ENC_BODY}"

echo "URL length: ${#GMAIL_URL}"
echo "URL: ${GMAIL_URL:0:200}..."

# Navigate
echo "Navigating..."
openclaw browser navigate "$GMAIL_URL"
echo "Navigate exit code: $?"
