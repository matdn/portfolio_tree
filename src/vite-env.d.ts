/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string
  readonly VITE_API_URL: string
  readonly VITE_APP_URL: string
  readonly VITE_BUCKET_URL: string
  readonly VITE_STORYBLOK_VERSION: string
  readonly VITE_STORYBLOK_TOKEN: string
  readonly VITE_GAME_TITLE: string
  readonly VITE_IS_SCORM: string
  readonly VITE_REMOTE_ASSETS_URL: string;
  readonly VITE_GOLDEN_TICKETS: string;
  readonly VITE_IFRAME_URL: string;
  readonly VITE_EPISODE: string;
  readonly VITE_IS_ELECTRON: string;
  readonly VITE_IS_CLASSROOM: string;
  readonly VITE_ORIGIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
