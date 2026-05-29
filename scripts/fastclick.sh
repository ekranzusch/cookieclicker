#!/bin/bash
#
# Autoclicker for the big cookie (macOS), OS-level via cliclick.
#   brew install cliclick
#   Grant Accessibility permission: System Settings -> Privacy & Security
#   -> Accessibility (enable your terminal app), or clicks will silently fail.
#
# Clicks wherever the cursor currently sits (c:.), so park the pointer over
# the big cookie before starting. Stop with Ctrl-C (kills all workers).
#
# NOTE: prefer scripts/console-autoclicker.js. Clicking is a major income
# source in this build (each click is worth a large share of your CpS), and
# the console clicker can reach hundreds-to-thousands of CPS. cliclick cannot:
# its -w wait has a hard 20ms floor applied per command, so ONE cliclick
# process tops out around ~50 CPS no matter how you batch it.
#
# To push past that ceiling, this script can run several cliclick loops in
# parallel. macOS serializes synthetic input events, so throughput scales with
# diminishing returns -- more processes help, but not linearly.
#
# Tuning:
#   PROCS   number of parallel cliclick loops (each ~50 CPS; raise for more)
#   BATCH   clicks per cliclick launch (amortizes process-spawn cost)

PROCS=4
BATCH=50

# Build the repeated "c:." argument list once: "c:. c:. c:. ...".
CLICKS=$(printf 'c:. %.0s' $(seq "$BATCH"))

pids=()
cleanup() {
  for pid in "${pids[@]}"; do
    kill "$pid" 2>/dev/null
  done
  exit 0
}
trap cleanup INT TERM

echo "Autoclicking cursor position with ${PROCS} parallel workers (~50 CPS each). Ctrl-C to stop."

for ((p = 0; p < PROCS; p++)); do
  ( while true; do cliclick -w 20 $CLICKS; done ) &
  pids+=("$!")
done

wait
