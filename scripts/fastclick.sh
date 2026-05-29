#!/bin/bash
#
# Autoclicker for the big cookie (macOS).
#   brew install cliclick
#   Grant Accessibility permission: System Settings -> Privacy & Security
#   -> Accessibility (enable your terminal app), or clicks will silently fail.
#
# Clicks wherever the cursor currently sits (c:.), so park the pointer over
# the big cookie before starting. Stop with Ctrl-C.
#
# Why not click as fast as the hardware allows?
#   Cookie Clicker is single-threaded and its logic loop runs at ~30 FPS.
#   Clicking shares that thread with the loop that produces your PASSIVE
#   cookies -- which are ~all of your income in this build. Past a few
#   hundred clicks/sec you start starving that loop, so "faster" can mean
#   FEWER cookies while burning CPU 24/7. A modest rate is optimal here.
#
# This script sends clicks in batches to avoid relaunching cliclick on every
# click (the old version spawned a new process per click -- expensive and
# jittery). cliclick's -w is the wait after each event and has a 20ms floor,
# so a click (down+up) lands in roughly the 25-50 CPS range -- plenty.
#
# Tuning:
#   BATCH      clicks per cliclick launch (higher = fewer process spawns)
#   REST_SECS  pause between batches; raise it to lower the average click rate
# To go intentionally faster than cliclick's floor, use the in-browser
# console autoclicker instead (see scripts/console-autoclicker.js).

BATCH=20
REST_SECS=0

# Build the repeated "c:." argument list once: "c:. c:. c:. ...".
CLICKS=$(printf 'c:. %.0s' $(seq "$BATCH"))

echo "Autoclicking the cursor position (~25-50 CPS, batches of ${BATCH}). Ctrl-C to stop."

while true; do
  cliclick -w 20 $CLICKS
  if [ "$REST_SECS" != "0" ]; then
    sleep "$REST_SECS"
  fi
done
