import { IS_DESKTOP } from "@/constants";

const SERVICE =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "staging"
    ? "staging_hydralauncher"
    : "hydralauncher";

export class Keytar {
  private readonly service = SERVICE;

  constructor(private readonly account: "access-token" | "refresh-token") {}

  private async getInvoke() {
    if (IS_DESKTOP) {
      const { invoke } = await import("@tauri-apps/api/core");
      return invoke;
    }

    throw new Error("Not running on desktop");
  }

  public async savePassword(password: string) {
    const invoke = await this.getInvoke();

    return invoke("save_password", {
      service: this.service,
      account: this.account,
      password,
    });
  }

  public async getPassword(): Promise<string | null> {
    const invoke = await this.getInvoke();

    return invoke("get_password", {
      service: this.service,
      account: this.account,
    });
  }

  public async deletePassword(): Promise<boolean> {
    const invoke = await this.getInvoke();

    return invoke("delete_password", {
      service: this.service,
      account: this.account,
    });
  }
}
