import type { Metadata } from "next";
import { siteConfig } from "@/data/siteConfig";
import { Panel, riseDelay } from "@/components/ui/Panel";
import { ContactForm } from "@/components/ui/ContactForm";
import { PageHeader } from "@/components/shell/PageHeader";
import { ContactList } from "@/components/dashboard/ContactPanel";

export const metadata: Metadata = {
  title: "Contact",
  description: siteConfig.openToWork,
};

const openTo = ["Freelance projects", "Web development", "AI integrations", "Full-time roles"];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Contact" title="Get in touch" description={siteConfig.openToWork} />

      <div className="grid gap-3 lg:grid-cols-12">
        <Panel
          title="Send a message"
          labelledBy="message-heading"
          className="rise lg:col-span-8"
          style={riseDelay(60)}
          bodyClassName="p-5 sm:p-6"
        >
          <p className="text-[13px] text-ink-3">It goes straight to my inbox. All three fields are required.</p>
          <ContactForm />
        </Panel>

        <div className="flex flex-col gap-3 lg:col-span-4">
          <Panel title="Channels" labelledBy="channels-heading" className="rise" style={riseDelay(120)}>
            <ContactList />
          </Panel>
          <Panel title="Open to" labelledBy="open-heading" className="rise" style={riseDelay(180)}>
            <ul className="flex flex-wrap gap-1.5">
              {openTo.map((item) => (
                <li key={item} className="rounded-full border border-rule bg-bg px-2.5 py-1 text-[13px] text-ink-2">
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
