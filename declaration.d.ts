declare module "bun" {
  interface Env {
    BUILD_WEBHOOK_URL: string;
    BRANCH_NAME: string;
    GITHUB_ACTOR: string;
  }
}
