import en2ru_pc from './en2ru_pc.json';
import en2ru_mac from './en2ru_mac.json';

type LayoutType = 'pc' | 'mac';

const layouts: Record<LayoutType, Record<string, string>> = {
  pc: en2ru_pc,
  mac: en2ru_mac,
};

export const convert_en2ru = (v: string, type: LayoutType) => {
  const layout = layouts[type];
  return v.toLowerCase().replace(/./g, ch => (ch in layout ? layout[ch] : ch));
};
