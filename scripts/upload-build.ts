import { s3, write } from "bun";
import path from "node:path";
import { readdir } from "node:fs/promises";

import packageJson from "../package.json";

if (!Bun.env.BUILD_WEBHOOK_URL) {
  console.log("No BUILD_WEBHOOK_URL provided, skipping upload");
  process.exit(0);
}

const dist = path.resolve(__dirname, "..", "dist");

const extensionsToUpload = [".deb", ".exe", ".pacman"];

const files = await readdir(dist);

const uploads = await Promise.all(
  files
    .filter((file) => extensionsToUpload.includes(path.extname(file)))
    .map(async (file) => {
      console.log(`⌛️ Uploading ${file}...`);
      const fileName = `${new Date().getTime()}-${file}`;

      const metadata = s3.file(fileName);

      await write(metadata, Bun.file(path.resolve(dist, file)));

      return {
        url: `${Bun.env.BUILDS_URL}/${fileName}`,
        name: fileName,
      };
    })
);

for (const upload of uploads) {
  await fetch(Bun.env.BUILD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      upload,
      branchName: Bun.env.BRANCH_NAME,
      version: packageJson.version,
      githubActor: Bun.env.GITHUB_ACTOR,
    }),
  });
}
