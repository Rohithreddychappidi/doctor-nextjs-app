"use client";

import { useSiteData } from "@/lib/DataContext";

export default function StatStrip() {
  const { stats } = useSiteData();
  const items = [
    { num: `${stats.studentsHelped}+`, lbl: "Students helped" },
    { num: `${stats.consultationsGiven}+`, lbl: "Free consultations given" },
    { num: `${stats.hospitalsWorked}`, lbl: "Hospitals worked at" },
    { num: `${stats.researchesPublished}+`, lbl: "Research contributions" },
  ];
  return (
    <div className="container">
      <div className="stat-strip">
        {items.map((it) => (
          <div key={it.lbl}>
            <div className="num">{it.num}</div>
            <div className="lbl">{it.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
