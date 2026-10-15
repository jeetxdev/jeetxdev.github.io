const LATTICE_SIZE = 256;
const LATTICE_MASK = LATTICE_SIZE - 1;

export type Noise2D = (x: number, y: number) => number;

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/** Smooth 2D value noise in the range [0, 1]. Cheap enough to sample per character cell per frame. */
export function createValueNoise(random: () => number = Math.random): Noise2D {
  const values = new Float32Array(LATTICE_SIZE);
  const perm = new Uint8Array(LATTICE_SIZE * 2);

  for (let i = 0; i < LATTICE_SIZE; i++) {
    values[i] = random();
    perm[i] = i;
  }
  for (let i = LATTICE_SIZE - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < LATTICE_SIZE; i++) {
    perm[i + LATTICE_SIZE] = perm[i];
  }

  return (x, y) => {
    const fx = Math.floor(x);
    const fy = Math.floor(y);
    const xi = fx & LATTICE_MASK;
    const yi = fy & LATTICE_MASK;
    const u = fade(x - fx);
    const v = fade(y - fy);

    const a = values[perm[perm[xi] + yi]];
    const b = values[perm[perm[xi + 1] + yi]];
    const c = values[perm[perm[xi] + yi + 1]];
    const d = values[perm[perm[xi + 1] + yi + 1]];

    const top = a + (b - a) * u;
    const bottom = c + (d - c) * u;
    return top + (bottom - top) * v;
  };
}
