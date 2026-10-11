import type { EducationItem } from "@/lib/types";

/**
 * Periods are years only. For the timeline chart, `start`/`end` place them at
 * mid-year — the Philippine school year runs roughly June to May — and the
 * chart labels each bar with the exact `period` text, not the months.
 */
export const education: EducationItem[] = [
  {
    institution: "Bulacan State University — Meneses Campus",
    program: "Bachelor of Science in Information Technology",
    period: "2022 – 2026",
    start: "2022-06",
    end: "2026-06",
    honor: "Cum Laude",
  },
  {
    institution:
      "Sta. Maria National High School / Dr. Yanga's Colleges Incorporated",
    program: "Information and Communications Technology (ICT)",
    period: "2015 – 2019",
    start: "2015-06",
    end: "2019-06",
  },
];
