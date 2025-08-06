import { definePreset } from '@primeuix/themes';
import aura from '@primeuix/themes/aura';

import base from './base';

export const primengPreset = definePreset(aura, {
  ...base,
  components: {},
});
