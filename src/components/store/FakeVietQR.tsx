/**
 * Mã QR minh họa cho bản demo (không quét được). Hình vẽ cố định theo nội dung chuyển khoản
 * để cùng một đơn luôn ra cùng một mã.
 */
const SIZE = 29;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ô thuộc vùng 3 ô vuông định vị ở góc (kèm viền trắng). */
function finderCell(x: number, y: number): boolean | null {
  const corners = [
    [0, 0],
    [SIZE - 7, 0],
    [0, SIZE - 7],
  ];
  for (const [cx, cy] of corners) {
    const dx = x - cx;
    const dy = y - cy;
    if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
      if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return false;
      const ring = Math.min(dx, dy, 6 - dx, 6 - dy);
      return ring !== 1;
    }
  }
  return null;
}

function buildPath(content: string): string {
  const random = seededRandom(hash(content));
  let d = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const finder = finderCell(x, y);
      const dark = finder ?? random() < 0.5;
      if (dark) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

export function FakeVietQR({ content, className }: { content: string; className?: string }) {
  return (
    <svg
      viewBox={`-2 -2 ${SIZE + 4} ${SIZE + 4}`}
      role="img"
      aria-label={`Mã VietQR minh họa, nội dung ${content}`}
      className={className}
      shapeRendering="crispEdges"
    >
      <rect x={-2} y={-2} width={SIZE + 4} height={SIZE + 4} className="fill-white" />
      <path d={buildPath(content)} className="fill-ink" />
    </svg>
  );
}
