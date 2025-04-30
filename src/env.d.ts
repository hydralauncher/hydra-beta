declare namespace App {
  interface Locals {
    accessToken?: string;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_AUTH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
