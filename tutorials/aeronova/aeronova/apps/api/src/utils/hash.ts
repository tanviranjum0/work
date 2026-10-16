/** FNV-1a 32-bit. Deterministic, fast, not cryptographic. */
export const fnv1a = (input: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

export const shortHash = (input: string): string =>
  fnv1a(input).toString(36).padStart(7, '0') + fnv1a(`${input}#2`).toString(36).padStart(7, '0');
