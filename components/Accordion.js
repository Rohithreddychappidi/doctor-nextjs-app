"use client";

import { useState } from "react";

export function Accordion({ index, label, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`accordion${open ? " open" : ""}`}>
      <button className="accordion-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="label">
          <span className="num">{String(index).padStart(2, "0")}</span>
          <h3>{label}</h3>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {count != null && <span className="count">{count} entries</span>}
          <svg className="accordion-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className="accordion-body">
        <div className="accordion-body-inner">{children}</div>
      </div>
    </div>
  );
}

export function AccordionItem({ title, meta, body }) {
  return (
    <div className="accordion-item">
      {meta && <span className="meta">{meta}</span>}
      <h4>{title}</h4>
      {body && <p>{body}</p>}
    </div>
  );
}
