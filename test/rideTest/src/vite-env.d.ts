/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_API: string;
  readonly VITE_MAP_ID: string;
  // add other env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
