import { api } from "@/services";
import type { User } from "@/types";
import type { GetServerSideProps } from "next";
import Image from "next/image";

interface ProfileProps {
  user: User | null;
}

export default function Profile({ user }: ProfileProps) {
  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div>
      <Image
        src={user.profileImageUrl}
        alt={user.displayName}
        width={50}
        height={50}
        style={{ objectFit: "cover" }}
        unoptimized
      />
      <h1>{user.displayName}</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (
  context
) => {
  const { id } = context.params as { id: string };

  try {
    const user = await api.get<User | null>(`users/${id}`).json();

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error("Failed to fetch user", error);

    return {
      props: {
        user: null,
      },
    };
  }
};
