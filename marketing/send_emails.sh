#!/bin/bash
# FoodTracks.io outreach email sender
# Sends emails via Gmail browser automation with retry logic

SLEEP_BETWEEN_COMMANDS=35  # seconds to wait between openclaw browser commands
SLEEP_BETWEEN_EMAILS=20    # extra seconds between emails

log() {
    echo "[$(date '+%H:%M:%S')] $*"
}

run_oc() {
    # Run openclaw browser command with retry
    local cmd="$*"
    local max_tries=8
    local i=0
    local result=""
    while [ $i -lt $max_tries ]; do
        result=$(openclaw browser $cmd 2>&1)
        if echo "$result" | grep -q "gateway connect failed\|gateway closed"; then
            i=$((i+1))
            log "Gateway error (attempt $i/$max_tries), retrying in ${SLEEP_BETWEEN_COMMANDS}s..."
            sleep $SLEEP_BETWEEN_COMMANDS
        else
            echo "$result"
            return 0
        fi
    done
    log "ERROR: all $max_tries attempts failed for: $cmd"
    return 1
}

wait_ready() {
    log "Waiting for gateway to be ready..."
    sleep $SLEEP_BETWEEN_COMMANDS
}

send_email() {
    local to="$1"
    local subject="$2"
    local body="$3"
    local truck_name="$4"

    log "Sending to: $truck_name <$to>"

    # URL-encode subject and body
    local enc_to=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$to'))")
    local enc_subject=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$subject'''))")
    local enc_body=$(python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.stdin.read()))" <<< "$body")

    local gmail_url="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${enc_to}&su=${enc_subject}&body=${enc_body}"

    # Navigate to the compose URL
    log "Navigating to Gmail compose..."
    local nav_result=$(run_oc "navigate" "$gmail_url")
    if [ $? -ne 0 ]; then
        log "FAILED to navigate for $truck_name"
        return 1
    fi
    log "Navigation result: $nav_result"

    wait_ready

    # Take screenshot to verify
    local ss=$(run_oc "screenshot")
    log "Screenshot: $ss"

    wait_ready

    # Find and click the Send button
    # Gmail send button class: aoO or T-I-atl
    local send_result=$(run_oc evaluate --fn "function() { var btn = document.querySelector('.T-I.J-J5-Ji.aoO'); if(btn) { btn.click(); return 'sent'; } var btn2 = document.querySelector('[data-tooltip*=Send],[data-tooltip*=Envoyer]'); if(btn2) { btn2.click(); return 'sent via tooltip'; } return 'send button not found'; }")
    log "Send result for $truck_name: $send_result"

    if echo "$send_result" | grep -q "sent"; then
        log "SUCCESS: Email sent to $truck_name"
        return 0
    else
        log "WARNING: Could not auto-click send for $truck_name - check screenshot"
        return 2
    fi
}

# --- Define emails ---

FRENCH_SUBJECT="Optimisez votre food truck avec FoodTracks.io"
FRENCH_BODY="Bonjour,

Je me permets de vous contacter car FoodTracks.io peut vous aider à mieux gérer votre food truck : prédictions IA des ventes par emplacement, gestion des stocks, tableau de bord des résultats.

Beaucoup de food truckers perdent du chiffre d'affaires en allant aux mauvais emplacements — FoodTracks change ça.

Essai gratuit sur foodtracks.io si vous souhaitez voir ce que ça donne pour votre activité.

Bonne journée,
FoodTracks Team"

ENGLISH_SUBJECT="Boost your food truck revenue with FoodTracks.io"
ENGLISH_BODY="Hi,

I'm reaching out because FoodTracks.io might be useful for your food truck: AI-powered sales predictions by location, stock management, and a results dashboard.

A lot of food truck owners lose revenue by going to the wrong spots — FoodTracks helps solve that.

Free trial at foodtracks.io if you'd like to see what it looks like for your business.

Best,
FoodTracks Team"

# --- Send all 20 emails ---

# FR trucks
send_email "contact@coincidencefoodtruck.fr" "$FRENCH_SUBJECT" "$FRENCH_BODY" "Coincidence Food Truck"
sleep $SLEEP_BETWEEN_EMAILS

send_email "katsusando@outlook.fr" "$FRENCH_SUBJECT" "$FRENCH_BODY" "Sando Truck"
sleep $SLEEP_BETWEEN_EMAILS

send_email "contact@lacuisinedecarmen.com" "$FRENCH_SUBJECT" "$FRENCH_BODY" "La Cuisine De Carmen"
sleep $SLEEP_BETWEEN_EMAILS

send_email "maisonprajault@gmail.com" "$FRENCH_SUBJECT" "$FRENCH_BODY" "Maison Prajault"
sleep $SLEEP_BETWEEN_EMAILS

send_email "evenements@jero-globecroqueur.fr" "$FRENCH_SUBJECT" "$FRENCH_BODY" "JERO Globe Croqueur"
sleep $SLEEP_BETWEEN_EMAILS

send_email "contact@fastyshotdog.com" "$FRENCH_SUBJECT" "$FRENCH_BODY" "Fastys Hot Dog"
sleep $SLEEP_BETWEEN_EMAILS

send_email "contact@delistreet.fr" "$FRENCH_SUBJECT" "$FRENCH_BODY" "Deli Street"
sleep $SLEEP_BETWEEN_EMAILS

send_email "contact@latractiongourmande.paris" "$FRENCH_SUBJECT" "$FRENCH_BODY" "La Traction Gourmande"
sleep $SLEEP_BETWEEN_EMAILS

# UK trucks
send_email "hello@unagiuk.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Unagi UK"
sleep $SLEEP_BETWEEN_EMAILS

send_email "info@theindianfoodcarriage.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "The Indian Food Carriage"
sleep $SLEEP_BETWEEN_EMAILS

send_email "dean@fancyfriesmidlands.co.uk" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Fancy Fries Midlands"
sleep $SLEEP_BETWEEN_EMAILS

send_email "hello@thebbqtruck.co.uk" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "The BBQ Truck"
sleep $SLEEP_BETWEEN_EMAILS

# US trucks
send_email "cheesiestruck@gmail.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Cheesie's Truck"
sleep $SLEEP_BETWEEN_EMAILS

send_email "wheels2@billybrickshq.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Billy Bricks On Wheels"
sleep $SLEEP_BETWEEN_EMAILS

send_email "aztecdaves@gmail.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Aztec Daves"
sleep $SLEEP_BETWEEN_EMAILS

send_email "info@5elementosla.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Elementos Food Truck"
sleep $SLEEP_BETWEEN_EMAILS

send_email "Alohafridaysla@aol.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Aloha Fridays"
sleep $SLEEP_BETWEEN_EMAILS

send_email "events@brasilkiss.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Brasil Kiss"
sleep $SLEEP_BETWEEN_EMAILS

send_email "milehightikkaexpress@gmail.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Mile High Tikka Express"
sleep $SLEEP_BETWEEN_EMAILS

send_email "dosgringosco@gmail.com" "$ENGLISH_SUBJECT" "$ENGLISH_BODY" "Dos Gringos"

log "All emails processed!"
