#!/bin/bash
# Sends a single outreach email via Gmail browser automation
# Usage: send_outreach.sh <to> <subject> <body>

TO="$1"
SUBJECT="$2"
BODY="$3"
MAX_RETRIES=10
RETRY_DELAY=5

run_browser() {
    local cmd="$@"
    local attempt=0
    while [ $attempt -lt $MAX_RETRIES ]; do
        result=$(openclaw browser $cmd 2>&1)
        if echo "$result" | grep -q "gateway connect failed\|gateway closed"; then
            attempt=$((attempt+1))
            sleep $RETRY_DELAY
        else
            echo "$result"
            return 0
        fi
    done
    echo "ERROR: Max retries exceeded for: openclaw browser $cmd" >&2
    return 1
}

# Step 1: click compose button
echo "Clicking compose..."
run_browser "click e95"
sleep 3

# Step 2: Get snapshot to find To field
echo "Getting snapshot..."
SNAP=$(run_browser "snapshot")
TO_REF=$(echo "$SNAP" | grep -i 'destinataire\|À\|To.*ref=' | grep -o 'ref=[a-z0-9]*' | head -1 | sed 's/ref=//')

if [ -z "$TO_REF" ]; then
    # Try to find it via evaluate
    TO_REF="e-to-field"
fi

echo "Filling To: $TO"
# Use evaluate to fill the To field
run_browser evaluate --fn "() => {
    const toArea = document.querySelector('.vO, [name=to], [aria-label*=\"To\"], [aria-label*=\"À\"], [data-hm=\"to\"]');
    if(toArea) { toArea.focus(); toArea.value = ''; }
    return toArea ? toArea.getAttribute('aria-label') || toArea.name : 'not found';
}"

sleep 1

# Click on the To field area and type
run_browser evaluate --fn "() => {
    const compose = document.querySelector('.GP');
    if(compose) { const toEl = compose.querySelector('[name=to], .vO, [data-hm=to]'); if(toEl) toEl.click(); }
}"

sleep 1

# Use fill with textbox approach - focus the To input
SNAP2=$(run_browser "snapshot")
echo "Current snapshot refs (first 30 lines):"
echo "$SNAP2" | head -30

echo "Done attempt. TO: $TO"
