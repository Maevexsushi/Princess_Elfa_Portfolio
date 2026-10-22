import type { Metadata } from "next";
import { PageHeader } from "@/components/shell/PageHeader";
import { RoomExperience } from "@/components/room/RoomExperience";

export const metadata: Metadata = {
  title: "Setup",
  description:
    "A 3D model of my room that follows my day in Philippine time. Change what I'm doing, move the camera, and find the things that react.",
};

export default function SetupPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Setup"
        title="Where I work"
        description="My room in 3D, following my day in Philippine time — the light, the weather in the window, and what I'm up to. Drag to look around, switch what I'm doing, and click things: a few of them react."
      />
      <RoomExperience />
    </div>
  );
}
