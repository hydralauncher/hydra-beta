interface ImportMetaEnv {
  readonly PUBLIC_AUTH_URL: string;
  readonly PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "bun" {
  interface Env {
    BUILD_WEBHOOK_URL: string;
    BRANCH_NAME: string;
    GITHUB_ACTOR: string;
  }
}
