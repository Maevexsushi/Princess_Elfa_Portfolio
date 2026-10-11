import { projects } from "@/data/projects";
import { Panel, PanelLink, riseDelay } from "@/components/ui/Panel";
import { IdentityPanel } from "@/components/dashboard/IdentityPanel";
import { IntroPanel } from "@/components/dashboard/IntroPanel";
import { KpiTiles } from "@/components/dashboard/KpiTiles";
import { NowPanel } from "@/components/dashboard/NowPanel";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { StackUsage } from "@/components/dashboard/StackUsage";
import { Timeline } from "@/components/dashboard/Timeline";
import { ContactPanelBody } from "@/components/dashboard/ContactPanel";

/**
 * The overview: everything at a glance, each panel opening onto a full page.
 * Left, the ID badge; right, who I am, the headline figures and what I'm
 * building now; below, the work, the stack, the timeline and how to reach me.
 */
export default function Overview() {
  return (
    <div className="grid gap-3 lg:grid-cols-12 lg:gap-4">
      <IdentityPanel className="lg:col-span-5 xl:col-span-4" />

      <div className="flex min-w-0 flex-col gap-3 lg:col-span-7 lg:gap-4 xl:col-span-8">
        <IntroPanel />
        <KpiTiles />
        <NowPanel />
      </div>

      <Panel
        title="Projects"
        labelledBy="projects-heading"
        action={<PanelLink href="/projects">View all</PanelLink>}
        className="rise lg:col-span-12 xl:col-span-8"
        style={riseDelay(380)}
      >
        <ProjectsTable projects={projects} stackLimit={3} compact />
      </Panel>

      <Panel
        title="Most-used stack"
        labelledBy="stack-heading"
        action={<PanelLink href="/stack">Full stack</PanelLink>}
        className="rise lg:col-span-6 xl:col-span-4"
        style={riseDelay(420)}
      >
        <StackUsage limit={7} />
      </Panel>

      <Panel
        title="Timeline"
        labelledBy="timeline-heading"
        action={<PanelLink href="/experience">Experience</PanelLink>}
        className="rise lg:col-span-6 xl:col-span-8"
        style={riseDelay(460)}
      >
        <Timeline />
      </Panel>

      <Panel
        title="Get in touch"
        labelledBy="contact-heading"
        className="rise lg:col-span-12 xl:col-span-4"
        style={riseDelay(500)}
      >
        <ContactPanelBody />
      </Panel>
    </div>
  );
}
