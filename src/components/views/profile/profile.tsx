import { api } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { useParams } from "react-router";

export interface ProfileProps {
  profile?: User | null;
}

export function Profile(props: ProfileProps) {
  const { id } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => api.get<User | null>(`users/${id}`).json(),
    placeholderData: props.profile,
  });

  if (isLoading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img
        src={profile?.profileImageUrl}
        alt={profile?.displayName}
        width={50}
        height={50}
        style={{ objectFit: "cover" }}
      />

      <h1>{profile?.displayName}</h1>
    </div>
  );
}
