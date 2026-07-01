import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./EditProfileForm";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Stamp } from "@/components/ui";

export default async function EditProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="px-4 pt-8">
      <Stamp className="text-sm text-orange">Edit profile</Stamp>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-stamp text-bone">Your plate</h1>

      <section className="mt-6 spec-plate p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-stamp text-steel-400">Photos</h2>
        <PhotoUploader
          initial={user.photos.map((p: { id: string; imageUrl: string; isPrimary: boolean; moderationStatus: string }) => ({
            id: p.id,
            imageUrl: p.imageUrl,
            isPrimary: p.isPrimary,
            moderationStatus: p.moderationStatus,
          }))}
        />
      </section>

      <EditProfileForm
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}
