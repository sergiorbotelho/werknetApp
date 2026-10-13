import { ProfileSkeleton } from "@/app/components/profile/profile-skeleton";

// Mesmo contêiner de perfil/page.tsx
export default function Loading() {
  return (
    <div className="w-full">
      <ProfileSkeleton />
    </div>
  );
}
