import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ payload: string }>;
}) {
  const { payload } = await searchParams;

  console.log(payload);

  return (
    <>
      <Link href="https://auth-staging.hydralauncher.gg?return_to=https://beta.hydralauncher.gg">
        Login
      </Link>

      <Link href="/download-sources" shallow>
        Download Sources
      </Link>
      <Link href="/profile/Znq8XqOR" shallow>
        Profile
      </Link>
    </>
  );
}
