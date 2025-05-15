/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_API: string;
  readonly VITE_MAP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
