# Recap script

<!-- recap of session 6abc69442c -->
Every line below is shown on screen (show) or spoken (say); the film is built from these lines only, and
lines starting with # are not used. The lines come from an allow-list of facts (counts, file paths inside the
repository, program names, test counts, git stats); free text from the session is only offered as a # suggestion.
Edit the text after a label, or delete a line to leave it out, then run the same command again with --yes.
Lines that look like keys, tokens, absolute paths, URLs, hosts or e-mail addresses are dropped, also after your
edits. Filters can miss things: read every line before you render.


## hook

show hook.kicker: Recap · Claude Code session · 1 Oct 2026
show hook.title: 17 min · 1 file edited · red to green
# from your first message; uncomment to show it under the title:
# show hook.request: Fix the flaky parser test in acme. Keep the change small.
show hook.meta: 14 turns · 12 tool calls · 5 commands
say hook.say: In 17 minutes, an agent edited 1 file and took the tests from red to green.

## numbers

show numbers.kicker: The session in numbers
show stat.time.value: 17 min
show stat.time.label: of work
show stat.turns.value: 14
show stat.turns.label: turns
show stat.calls.value: 12
show stat.calls.label: tool calls
show stat.files.value: 1
show stat.files.label: repo files touched
show stat.tests.value: 3
show stat.tests.label: test runs
say numbers.say: 14 turns and 12 tool calls, across 1 file in the repository.

## timeline

show timeline.kicker: Minute by minute
show lane.read: Read 3
show lane.edit: Edit 2
show lane.run: Run 2
show lane.test: Test 3
show axis.start: 0
show axis.end: 29 min
show callout.1: parser.py
show timeline.commands: Most used: python -m pytest ×1 · tail ×1 · curl ×1 · jq ×1
say timeline.say: It edited 1 file, ran 2 commands and 3 test runs.

## files

show files.kicker: Where the edits landed
show files.head: 1 file edited
show file.1: src/parser.py
show file.1.stat: +4 −1
say files.say: Every edit went into parser.

## tests

show tests.kicker: 3 test runs, in order
show tests.head: Red to green
show tests.value: 12/12
show tests.label: test files passed, last run with a count
show tests.note: 1 run failed before the last one
show tests.legend: red failed · green passed
say tests.say: The tests went red once, then green: 12 of 12 test files passed.

## diff

show diff.kicker: The change, from git
show diff.adds: +4
show diff.dels: −1
show diff.detail: 1 file · 1 commit
say diff.say: One commit: 4 lines added, 1 removed.

## end

show end.kicker: showtime recap
show end.outcome: Ended green: 12/12 test files passed · 1 commit
say end.say: It ended green, in 1 commit.
show end.note: Made on this machine from the session log · nothing uploaded
