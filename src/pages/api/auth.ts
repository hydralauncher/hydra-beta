import { calculateTokenExpirationTimestamp } from "@/services";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const { searchParams } = new URL(request.url);

  const payload = searchParams.get("payload");

  if (!payload) {
    return new Response(JSON.stringify({ error: "no payload" }), {
      status: 400,
    });
  }

  try {
    const auth = JSON.parse(atob(payload));

    cookies.set("accessToken", auth.accessToken, {
      path: "/",
      httpOnly: true,
    });

    cookies.set("refreshToken", auth.refreshToken, {
      path: "/",
      httpOnly: true,
    });

    cookies.set(
      "tokenExpirationTimestamp",
      calculateTokenExpirationTimestamp(auth.expiresIn).toString(),
      {
        path: "/",
      }
    );

    return redirect("/");
  } catch (err) {
    console.error(err);

    return new Response(JSON.stringify({ error: "failed to parse payload" }), {
      status: 400,
    });
  }
};
