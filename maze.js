/**
 * 히어로 배경 미로 - 게임 개발자 포트폴리오 연출
 * Recursive backtracking 미로 생성 + BFS 경로 애니메이션
 */
(function () {
  'use strict';

  const canvas = document.getElementById('hero-maze');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const COLS = 25;
  const ROWS = 19;
  const WALL_COLOR = 'rgba(88, 166, 255, 0.28)';
  const PATH_COLOR = 'rgba(13, 17, 23, 1)';
  const DOT_COLOR = 'rgba(88, 166, 255, 0.9)';
  const DOT_GLOW = 'rgba(88, 166, 255, 0.35)';

  let cells = [];
  let path = [];
  let pathIndex = 0;
  let cellW = 0;
  let cellH = 0;
  let offsetX = 0;
  let offsetY = 0;
  let dotX = 0;
  let dotY = 0;
  let animationId = null;

  function initCells() {
    cells = [];
    for (let y = 0; y < ROWS; y++) {
      cells[y] = [];
      for (let x = 0; x < COLS; x++) {
        cells[y][x] = { top: true, right: true, bottom: true, left: true, visited: false };
      }
    }
  }

  function getNeighbors(cx, cy) {
    const dirs = [
      { dx: 0, dy: -1, wall: 'top', opposite: 'bottom' },
      { dx: 1, dy: 0, wall: 'right', opposite: 'left' },
      { dx: 0, dy: 1, wall: 'bottom', opposite: 'top' },
      { dx: -1, dy: 0, wall: 'left', opposite: 'right' }
    ];
    const out = [];
    for (let i = 0; i < 4; i++) {
      const nx = cx + dirs[i].dx;
      const ny = cy + dirs[i].dy;
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS && !cells[ny][nx].visited) {
        out.push({ x: nx, y: ny, wall: dirs[i].wall, opposite: dirs[i].opposite });
      }
    }
    return out;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateMaze() {
    initCells();
    const stack = [{ x: 0, y: 0 }];
    cells[0][0].visited = true;

    while (stack.length > 0) {
      const { x: cx, y: cy } = stack.pop();
      const neighbors = shuffle(getNeighbors(cx, cy));
      if (neighbors.length === 0) continue;

      stack.push({ x: cx, y: cy });
      const next = neighbors[0];
      cells[cy][cx][next.wall] = false;
      cells[next.y][next.x][next.opposite] = false;
      cells[next.y][next.x].visited = true;
      stack.push({ x: next.x, y: next.y });
    }
  }

  function bfsPath() {
    const start = { x: 0, y: 0 };
    const end = { x: COLS - 1, y: ROWS - 1 };
    const queue = [{ ...start, path: [start] }];
    const visited = new Set();
    visited.add('0,0');

    while (queue.length > 0) {
      const { x, y, path: p } = queue.shift();
      if (x === end.x && y === end.y) return p;

      const dirs = [{ dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }];
      const cell = cells[y][x];

      for (let i = 0; i < 4; i++) {
        const nx = x + dirs[i].dx;
        const ny = y + dirs[i].dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const key = nx + ',' + ny;
        if (visited.has(key)) continue;

        const wall = ['top', 'right', 'bottom', 'left'][i];
        if (cell[wall]) continue;

        visited.add(key);
        queue.push({ x: nx, y: ny, path: p.concat([{ x: nx, y: ny }]) });
      }
    }
    return [start];
  }

  function setSize() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = hero.offsetWidth;
    const h = hero.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const totalCellW = w / COLS;
    const totalCellH = h / ROWS;
    cellW = Math.min(totalCellW, totalCellH);
    cellH = cellW;
    offsetX = (w - cellW * COLS) / 2;
    offsetY = (h - cellH * ROWS) / 2;
  }

  function drawMaze() {
    const w = canvas.style.width ? parseInt(canvas.style.width, 10) : canvas.width;
    const h = canvas.style.height ? parseInt(canvas.style.height, 10) : canvas.height;
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = WALL_COLOR;
    ctx.lineWidth = 2;
    ctx.lineCap = 'square';

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = cells[y][x];
        const px = offsetX + x * cellW;
        const py = offsetY + y * cellH;
        if (cell.top) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + cellW, py);
          ctx.stroke();
        }
        if (cell.right) {
          ctx.beginPath();
          ctx.moveTo(px + cellW, py);
          ctx.lineTo(px + cellW, py + cellH);
          ctx.stroke();
        }
        if (cell.bottom) {
          ctx.beginPath();
          ctx.moveTo(px + cellW, py + cellH);
          ctx.lineTo(px, py + cellH);
          ctx.stroke();
        }
        if (cell.left) {
          ctx.beginPath();
          ctx.moveTo(px, py + cellH);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }
    }
  }

  function pathToPixel(pt) {
    return {
      x: offsetX + pt.x * cellW + cellW / 2,
      y: offsetY + pt.y * cellH + cellH / 2
    };
  }

  function drawDot() {
    const r = Math.min(cellW, cellH) * 0.32;
    ctx.shadowColor = DOT_GLOW;
    ctx.shadowBlur = 12;
    ctx.fillStyle = DOT_COLOR;
    ctx.beginPath();
    ctx.arc(dotX, dotY, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function tick() {
    if (path.length === 0) return;
    const target = pathToPixel(path[pathIndex]);
    const speed = 0.08;
    dotX += (target.x - dotX) * speed;
    dotY += (target.y - dotY) * speed;
    if (Math.abs(dotX - target.x) < 0.5 && Math.abs(dotY - target.y) < 0.5) {
      pathIndex = (pathIndex + 1) % path.length;
    }
    drawMaze();
    drawDot();
    animationId = requestAnimationFrame(tick);
  }

  function draw() {
    drawMaze();
    drawDot();
  }

  function init() {
    setSize();
    generateMaze();
    path = bfsPath();
    pathIndex = 0;
    const start = pathToPixel(path[0]);
    dotX = start.x;
    dotY = start.y;
    draw();
    if (animationId) cancelAnimationFrame(animationId);
    tick();
  }

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setSize();
      drawMaze();
      const start = pathToPixel(path[pathIndex] || path[0]);
      dotX = start.x;
      dotY = start.y;
      drawDot();
    }, 150);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
