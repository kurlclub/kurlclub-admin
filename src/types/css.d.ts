// Ambient declarations for stylesheet imports.
// Side-effect imports of global CSS (e.g. `import './globals.css'`) otherwise
// trip ts(2882) under moduleResolution "bundler".
declare module '*.css';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
