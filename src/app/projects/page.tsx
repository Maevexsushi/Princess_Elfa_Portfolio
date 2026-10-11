import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { PageHeader } from "@/components/shell/PageHeader";
import { ProjectsExplorer } from "@/components/dashboard/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description: "AI-powered systems and web applications, each with a written case study.",
};

export default function ProjectsPage() {
  const live = projects.filter((p) => p.status === "in-progress").length;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Projects"
        title="Selected work"
        description={`${projects.length} projects, ${live} still in progress. Each one opens onto a case study: the problem, the hard parts, and the results.`}
      />
      <ProjectsExplorer />
    </div>
  );
}
