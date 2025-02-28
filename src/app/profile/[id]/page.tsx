"use client";

import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { useParams } from "next/navigation";

export interface User {
  displayName: string;
  profileImageUrl: string;
}

export default function Profile() {
  const { id } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: () => api.get<User>(`/users/${id}`).then((res) => res.data),
  });

  if (isLoading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Image
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
