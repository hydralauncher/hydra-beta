import { calculateTokenExpirationTimestamp } from "@/services";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const { searchParams } = new URL(request.url);

  const payload = searchParams.get("payload");

  if (!payload) {
    return new Response(JSON.stringify({ error: "No payload" }), {
      status: 400,
    });
  }

  try {
    const auth = JSON.parse(atob(payload));

    cookies.set(
      "auth",
      JSON.stringify({
        state: {
          auth: {
            ...auth,
            tokenExpirationTimestamp: calculateTokenExpirationTimestamp(
              auth.expiresIn
            ),
          },
        },
        version: 0,
      }),
      {
        path: "/",
      }
    );

    return redirect("/");
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: "Failed to parse payload" }), {
      status: 400,
    });
  }
};
