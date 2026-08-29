"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import TestimonialCard from "@/components/TestimonialCard";
import { useSiteData } from "@/lib/DataContext";

const EMPTY = { quote: "", name: "", role: "" };

export default function AdminTestimonialsPage() {
  const { testimonials, addTestimonial, deleteTestimonial } = useSiteData();
  const [form, setForm] = useState(EMPTY);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addTestimonial(form);
    setForm(EMPTY);
  };

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · Testimonials</div>
          <h2>Manage Testimonials</h2>
        </div>
        <a href="/testimonials" className="btn btn-outline btn-sm">View public testimonials page</a>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Add a Testimonial</h3></div>
        <form onSubmit={handleSubmit}>
          <div className="form-row single">
            <div className="field">
              <label htmlFor="quote">Quote</label>
              <textarea id="quote" name="quote" required value={form.quote} onChange={handleChange} placeholder="What did they say?" />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" required value={form.name} onChange={handleChange} placeholder="Student or family name" />
            </div>
            <div className="field">
              <label htmlFor="role">Role / context</label>
              <input id="role" name="role" required value={form.role} onChange={handleChange} placeholder="e.g. Medical Student, Class of 2027" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Testimonial</button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Current Testimonials ({testimonials.length})</h3></div>
        <div className="grid grid-3">
          {testimonials.map((t) => (
            <div key={t.id}>
              <TestimonialCard testimonial={t} />
              <button
                className="btn btn-outline btn-sm btn-block"
                style={{ marginTop: 10, color: "var(--accent)" }}
                onClick={() => { if (confirm("Remove this testimonial?")) deleteTestimonial(t.id); }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
