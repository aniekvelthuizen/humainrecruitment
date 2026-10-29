# Asking, and answering

## How to answer

Write for someone who is good at their job and does not know our words. Short, plain, concrete.

- **Short.** A one-sentence question gets a one-to-three-line answer. A finished unit gets a short paragraph and a list, not two tables and an essay. If the reply has grown past a screen, it is too long — cut it, do not fold it.
- **Plain words.** No jargon the user did not use first: not "combo chain", "flow-root", "cap-height", "out of flow", "specificity", "the padding box". Say "the class", "the spacing above it", "the box moves without pushing anything else". A term is fine once it has been explained once, in that message.
- **Say the answer first.** Then, only if it helps, the reason. Never the reasoning first with the answer at the end.
- **One change per reply** in a correction loop: what you changed, and `Was | Now | Target`. Not a list of everything else you noticed.
- **No padding.** No restating the request back, no "great question", no summary of what you are about to do, no closing offer of five next steps.
- **Name the thing the user can see**, not the thing in the code: "the space under the last bullet", not "`padding-bottom` on `_inner`".

When an explanation genuinely needs length — a plan, a set of options — lead with two lines that carry the decision, and put the detail under them so it can be skipped.

## How to ask

Every question to the user uses this shape. Number the questions, give your recommended answer, ask the whole batch at once, then wait — except where "Do what you recommend" below lets you carry on.

```
❓ **Q1** - **<title>**: <question, with the options if there are any>

➡️ <your recommended answer, one line>

---

❓ **Q2** - ...
```

Batch everything you can ask now into one round. A question whose answer depends on another open question waits for the next round.

*(house)* **Do what you recommend, unless it is risky.** List the questions with your recommendation as above, but do not wait for answers on the safe ones ("Your call" items included): carry on with the recommended answer in the same turn, record each choice in `decisions/`, and finish with fresh reviewer agents ([review](../skills/review/SKILL.md)) that check the work. Wait for an answer only on risky items: deleting or overwriting what exists, changes that reach many existing instances or pages, anything outward-facing (publishing to a live domain, sending forms, emails), anything the guard stops on, and a deviation from the design. Owners asked for this on Forest3 (Oct 2026): "Unless it's a risky change, do what you recommend and let the review agent with a fresh look check your work."

- **A choice is short.** What it is about in one line, the options in plain words, your recommendation with the reason in half a sentence. The detail behind it lives in the plan, not in the question. A question the user has to scroll past is too long.
- **Do not ask what the brief already settled.** The confirmation covers what the plan decided, not what the user already told you.
- **A deviation from the design is its own question,** never a default folded into a plan the user approves as a whole — and it is repeated in the hand-over.
- **Before measuring something the user pointed at, say back in one line what you think they mean** — which element, and which direction. "The tick inside the box, moved sideways?" costs one line and saves three rounds.
- **A measurement is not proof it looks right.** Show the rendered picture beside the number.
- **Two failed fixes on the same complaint: stop.** Options in a table, a recommendation, then wait.
