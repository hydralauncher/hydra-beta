import { api } from "@/services";
import { useQuery } from "@tanstack/react-query";

export interface User {
  displayName: string;
  profileImageUrl: string;
}

export interface ProfileProps {
  profile?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function Profile(props: ProfileProps) {
  const id = "Znq8XqOR";

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", id],
    queryFn: () => api.get<User>(`users/${id}`).json(),
    initialData: props.profile,
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
