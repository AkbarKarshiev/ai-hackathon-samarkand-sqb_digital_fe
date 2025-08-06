import { AuraBaseTokenSections, semantic } from "@primeuix/themes/aura/base";
import colors from 'tailwindcss/colors';

import { colorPalette } from "../../colors/color-palette";

export const primitive: AuraBaseTokenSections.Primitive = {
  borderRadius: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px'
  },
  ...colorPalette,
}

export const customSemantic: AuraBaseTokenSections.Semantic = {
  ...semantic,
  primary: {
    50: colorPalette.blue?.[50] || colors.blue[50],
    100: colorPalette.blue?.[100] || colors.blue[100],
    200: colorPalette.blue?.[200] || colors.blue[200],
    300: colorPalette.blue?.[300] || colors.blue[300],
    400: colorPalette.blue?.[400] || colors.blue[400],
    500: colorPalette.blue?.[500] || colors.blue[500],
    600: colorPalette.blue?.[600] || colors.blue[600],
    700: colorPalette.blue?.[700] || colors.blue[700],
    800: colorPalette.blue?.[800] || colors.blue[800],
    900: colorPalette.blue?.[900] || colors.blue[900],
  },
  colorScheme: {
    ...semantic.colorScheme,
    light: {
      primary: {
        color: '{primary.500}',
        contrastColor: '#ffffff',
        hoverColor: '{primary.600}',
        activeColor: '{primary.700}',
      },
    }
  }
}

export default {
  primitive,
  semantic: customSemantic,
}
