import { GetServerSideProps } from "next";

import { toSlug } from "@/helpers";
import { getSteamAppDetails } from "@/services";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  const appDetails = await getSteamAppDetails(id, "en");

  if (!appDetails) {
    return {
      notFound: true,
    };
  }

  return {
    redirect: {
      destination: `/game/${id}/${toSlug(appDetails?.name)}`,
      permanent: true,
    },
  };
};

export default function RedirectPage() {
  return null;
}
