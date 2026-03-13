import uiPreset from '@kurlclub/ui-components/tailwind';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [uiPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@kurlclub/ui-components/dist/**/*.{js,mjs}',
  ],
};

export default config;
