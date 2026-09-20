// 2048 engine - shared between app and node tests
// grid: 16 numbers row-major, 0 = empty
function slideRow(row) {
  // returns {row, gained, moved} - slide+merge toward index 0
  const vals = row.filter(v => v > 0);
  const out = [];
  let gained = 0;
  for (let i = 0; i < vals.length; i++) {
    if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
      out.push(vals[i] * 2);
      gained += vals[i] * 2;
      i++;
    } else out.push(vals[i]);
  }
  while (out.length < 4) out.push(0);
  const moved = out.some((v, i) => v !== row[i]);
  return { row: out, gained, moved };
}
function getRow(g, r) { return [g[r*4], g[r*4+1], g[r*4+2], g[r*4+3]]; }
function getCol(g, c) { return [g[c], g[4+c], g[8+c], g[12+c]]; }
function setRow(g, r, row) { for (let i = 0; i < 4; i++) g[r*4+i] = row[i]; }
function setCol(g, c, col) { for (let i = 0; i < 4; i++) g[4*i+c] = col[i]; }
function move(grid, dir) {
  // dir: 'left'|'right'|'up'|'down' -> {grid, gained, moved}
  const g = grid.slice();
  let gained = 0, moved = false;
  for (let i = 0; i < 4; i++) {
    let line, res;
    if (dir === 'left')  { line = getRow(g, i); res = slideRow(line); setRow(g, i, res.row); }
    if (dir === 'right') { line = getRow(g, i).reverse(); res = slideRow(line); setRow(g, i, res.row.reverse()); }
    if (dir === 'up')    { line = getCol(g, i); res = slideRow(line); setCol(g, i, res.row); }
    if (dir === 'down')  { line = getCol(g, i).reverse(); res = slideRow(line); setCol(g, i, res.row.reverse()); }
    gained += res.gained;
    if (res.moved) moved = true;
  }
  return { grid: g, gained, moved };
}
function empties(grid) {
  const out = [];
  for (let i = 0; i < 16; i++) if (grid[i] === 0) out.push(i);
  return out;
}
function spawn(grid, rng) {
  const e = empties(grid);
  if (!e.length) return grid;
  const r = rng || Math.random;
  const g = grid.slice();
  g[e[Math.floor(r() * e.length)]] = r() < 0.9 ? 2 : 4;
  return g;
}
function canMove(grid) {
  if (empties(grid).length) return true;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
    const v = grid[r*4+c];
    if (c < 3 && grid[r*4+c+1] === v) return true;
    if (r < 3 && grid[(r+1)*4+c] === v) return true;
  }
  return false;
}
function has2048(grid) { return grid.some(v => v >= 2048); }
if (typeof module !== 'undefined') module.exports = { slideRow, move, empties, spawn, canMove, has2048 };
