#!/bin/bash
# A Chrome of its own for this client's Webflow Designer: own profile (the client's Webflow login, separate
# from the user's normal Chrome) and a fixed debug port. The MCP server "chrome-<client>" in .mcp.json talks
# to this Chrome. Does nothing when it already runs. See webflow-devkit references/designer/README.md "Which Chrome".
CLIENT="__CLIENT__"   # lowercase, as in the repo name wf-<client>
PORT=__PORT__         # one port per client (9340, 9341, …), recorded in decisions/site.md
PROFILE="$HOME/.chrome-projecten/$CLIENT"
if curl -s "http://127.0.0.1:$PORT/json/version" > /dev/null; then exit 0; fi
mkdir -p "$PROFILE"
open -na "Google Chrome" --args --user-data-dir="$PROFILE" --remote-debugging-port=$PORT \
  --no-first-run --no-default-browser-check --window-name="$CLIENT Webflow" "${1:-https://webflow.com/dashboard}"
for i in $(seq 1 30); do curl -s "http://127.0.0.1:$PORT/json/version" > /dev/null && exit 0; sleep 1; done
echo "Chrome profile $CLIENT Webflow does not start" >&2; exit 1
