// Hand-crafted London side-street style maze.
// 1 = wall, 0 = path. Mobile-first portrait grid.
// Tunnels at row mid via left/right openings.

import type { Cell, GridPos } from "./types";

// 15 cols x 19 rows portrait grid
const RAW = [
  "111111111111111",
  "100000010000001",
  "101110010111101",
  "100010000010001",
  "111010111010111",
  "100000000000001",
  "101011101110101",
  "101000000000101",
  "001011101110100", // tunnel row
  "101000000000101",
  "101011101110101",
  "100000000000001",
  "111010111010111",
  "100010000010001",
  "101110010111101",
  "100000010000001",
  "101110111011101",
  "100000000000001",
  "111111111111111",
] as const;

export const COLS = RAW[0].length;
export const ROWS = RAW.length;

export const grid: Cell[][] = RAW.map((row) =>
  row.split("").map((c) => (c === "1" ? 1 : 0)) as Cell[]
);

export const isWall = (x: number, y: number) => {
  // tunnel wrap on row 8
  if (y < 0 || y >= ROWS) return true;
  if (x < 0 || x >= COLS) return false; // tunnel rows allow wrap
  return grid[y][x] === 1;
};

export const wrapX = (x: number) => {
  if (x < 0) return COLS - 1;
  if (x >= COLS) return 0;
  return x;
};

// Spawn points
export const PLAYER_SPAWN: GridPos = { x: 7, y: 11 };
export const HAZARD_SPAWNS: GridPos[] = [
  { x: 7, y: 7 },
  { x: 5, y: 9 },
  { x: 9, y: 9 },
  { x: 7, y: 9 },
  { x: 3, y: 5 },
];

// All path cells useful for placing items
export const pathCells: GridPos[] = (() => {
  const cells: GridPos[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === 0) cells.push({ x, y });
    }
  }
  return cells;
})();
