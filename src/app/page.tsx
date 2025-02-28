"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Auth, useAuthStore } from "@/stores/auth.store";
import { IS_DESKTOP } from "@/constants";
import { User, useUserStore } from "@/stores/user.store";

import { useForm } from "react-hook-form";
import { downloadSourcesTable } from "@/dexie";

export default function Home() {
  const { auth, setAuth } = useAuthStore();
  const { user, setUser } = useUserStore();

  const [downloadSources, setDownloadSources] = useState<any[]>([]);

  useEffect(() => {
    downloadSourcesTable.toArray().then(setDownloadSources);
  }, []);

  const { register, handleSubmit } = useForm();

  const { data } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: () =>
      api
        .get("/profile/me", {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
          },
        })
        .then((res) => res.data),
    initialData: null,
    enabled: !!auth?.accessToken,
  });

  useEffect(() => {
    (async () => {
      if (IS_DESKTOP) {
        const tauri = await import("@tauri-apps/api");
        tauri.invoke<Auth>("get_auth").then(setAuth);
      }
    })();
  }, [setAuth]);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  const onSubmit = useCallback((data: any) => {
    const worker = new Worker(
      new URL(
        "@/workers/download-sources/import-download-source.worker.ts",
        import.meta.url
      )
    );

    worker.postMessage(data.url);

    worker.onmessage = (event) => {
      console.log(event.data);
      downloadSourcesTable.toArray().then(setDownloadSources);
      worker.terminate();
    };
  }, []);

  const removeDownloadSource = useCallback((id: number) => {
    const worker = new Worker(
      new URL(
        "@/workers/download-sources/remove-download-source.worker.ts",
        import.meta.url
      )
    );

    worker.postMessage(id);

    worker.onmessage = (event) => {
      console.log(event.data);
      downloadSourcesTable.toArray().then(setDownloadSources);
      worker.terminate();
    };
  }, []);

  return (
    <div>
      <h1>Hello</h1>
      <p>{user?.id}</p>
      <p>{user?.displayName}</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("url")} />
        <button type="submit">Submit</button>
      </form>

      <ul>
        {downloadSources.map((d) => {
          return (
            <li key={d.id}>
              <p>{d.id}</p>
              <p>{d.name}</p>

              <button onClick={() => removeDownloadSource(d.id)}>Remove</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
