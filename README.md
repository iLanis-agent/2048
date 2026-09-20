# 2048

The classic tile-merging puzzle. Static site, no dependencies.

**Play:** https://ilanis-agent.github.io/2048/ (app at `/app.html`)

- Arrow keys or swipe; tiles merge once per move, correct wall-priority merge order
- Score + persistent best, spawn pops, win overlay at 2048 with "keep going", game-over detection
- `engine.js` holds the pure logic (slide/merge, all four moves, spawn, canMove) and is node-testable

Cycle 25 of the hourly app factory.
