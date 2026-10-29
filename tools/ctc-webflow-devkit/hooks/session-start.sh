#!/usr/bin/env bash
# Reports the age of the client repo's site dump so the model can decide to refresh.
# Reads dumpedAt from project.json (the file's mtime resets on every clone).
# Warns only when the session auto-approves everything, because the guard cannot ask then.
# Then reports the dump age, silently when the cwd is not a client repo.
mode=$(python3 -c 'import json,sys
try: print(json.load(sys.stdin).get("permission_mode") or "")
except Exception: print("")' 2>/dev/null)

if [ "$mode" = "bypassPermissions" ]; then
  cat <<'WARN'
webflow-devkit: zeg dit tegen de gebruiker aan het begin van je eerste antwoord, in deze woorden, voordat je iets anders doet:

⛔ **Deze sessie staat op automatisch goedkeuren.** De poortwachter werkt nu niet: alles wat de plugin op de site verandert gaat door zonder vraag. Zet de permissies terug naar normaal voordat je laat bouwen, of zeg uitdrukkelijk dat je zo door wilt.
WARN
fi

f="project.json"
[ -f "$f" ] || exit 0
dumped=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("dumpedAt") or "")' "$f" 2>/dev/null)
if [ -z "$dumped" ]; then
  echo "webflow-devkit: client repo detected, but project.json has no dumpedAt. Offer to run /webflow-devkit:project to dump the site before building."
  exit 0
fi
days=$(python3 -c 'import sys; from datetime import datetime, timezone
d = datetime.fromisoformat(sys.argv[1].replace("Z", "+00:00"))
if d.tzinfo is None: d = d.replace(tzinfo=timezone.utc)
print((datetime.now(timezone.utc) - d).days)' "$dumped" 2>/dev/null)
if [ -z "$days" ]; then
  echo "webflow-devkit: client repo detected, but dumpedAt in project.json is not a date (${dumped}). Offer to run /webflow-devkit:project to refresh."
elif [ "$days" -ge 7 ]; then
  echo "webflow-devkit: the site dump is ${days} days old (dumpedAt ${dumped}). The Webflow site has probably changed since. Offer to run /webflow-devkit:project to refresh before building."
else
  echo "webflow-devkit: client repo detected (site dump is ${days} days old)."
fi
