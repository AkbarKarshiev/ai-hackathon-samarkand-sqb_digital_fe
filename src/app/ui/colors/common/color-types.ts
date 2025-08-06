import { ColorScale } from "@primeuix/themes";

export type ColorNamesType =
  | 'green'
  | 'red'
  | 'orange'
  | 'sky'
  | 'blue'
  | 'gray'
  | 'amber'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'slate'
  | 'zink'
  | 'neutral'
  | 'white';

export type ColorObjType = Partial<Record<ColorNamesType, ColorScale>> & Record<string, ColorScale>;
