import { api } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";
import { useParams } from "react-router";

export interface ProfileProps {
  user?: User | null;
}

export function Profile(props: Readonly<ProfileProps>) {
  const { id } = useParams();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get<User | null>(`users/${id}`).json(),
    placeholderData: props.user,
  });

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img
        src={user.profileImageUrl}
        alt={user.displayName}
        width={50}
        height={50}
        style={{ objectFit: "cover" }}
      />

      <h1>{user.displayName}</h1>
    </div>
  );
}
