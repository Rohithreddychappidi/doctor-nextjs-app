"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";
import StatusTimeline from "@/components/StatusTimeline";
import DocumentList from "@/components/DocumentList";
import DocumentUploader from "@/components/DocumentUploader";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function StudentResearchPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  // Group Chat State
  const [activeGroup, setActiveGroup] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMsgText, setNewMsgText] = useState("");
  const [attachmentType, setAttachmentType] = useState("none"); // "none" | "link" | "doc" | "image"
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  const [files, setFiles] = useState([
    {
      id: "file_res_1",
      title: "IRB Approved Research Protocol & Informed Consent",
      category: "IRB Training / Ethics",
      file_name: "irb_preterm_delayed_cord_protocol.pdf",
      file_size_kb: 1420,
      uploaded_at: "2026-06-10T11:00:00Z",
      status: "Approved",
      file_url: "/uploads/sample_irb.pdf",
    },
    {
      id: "file_res_2",
      title: "Manuscript Working Draft v2.4 (Introduction & Methods)",
      category: "Manuscript Draft",
      file_name: "manuscript_draft_v2_4.docx",
      file_size_kb: 780,
      uploaded_at: "2026-09-02T16:00:00Z",
      status: "Under Review",
      file_url: "/uploads/sample_manuscript.docx",
      feedback: "Review Table 1 demographics and add p-values for gestational age comparisons.",
    },
    {
      id: "file_res_3",
      title: "De-identified Cohort Dataset & Statistical Analysis (SPSS)",
      category: "Other",
      file_name: "cohort_neonatal_transition_data.xlsx",
      file_size_kb: 2150,
      uploaded_at: "2026-08-20T09:30:00Z",
      status: "Approved",
      file_url: "/uploads/sample_dataset.xlsx",
    },
  ]);

  useEffect(() => {
    async function loadResearch() {
      try {
        const res = await fetch("/api/student/research");
        if (res.ok) {
          const json = await res.json();
          setData(json);
          if (json.groups && json.groups.length > 0) {
            setActiveGroup(json.groups[0]);
            setChatMessages(json.groups[0].messages || []);
          }
        }
      } catch (err) {
        console.error("Research load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeGroup) return;
    if (!newMsgText.trim() && attachmentType === "none") return;

    setSendingMsg(true);
    try {
      let attachments = [];
      if (attachmentType !== "none" && attachmentUrl.trim()) {
        attachments.push({
          name: attachmentName.trim() || (attachmentType === "link" ? "Study Reference" : "Data Attachment"),
          type: attachmentType,
          url: attachmentUrl.trim(),
          size: attachmentType === "doc" ? "1.1 MB" : attachmentType === "image" ? "820 KB" : "Web URL",
        });
      }

      const res = await fetch(`/api/admin/research/groups/${activeGroup.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMsgText.trim(),
          attachments,
        }),
      });
      const resJson = await res.json();
      if (res.ok && resJson.message) {
        setChatMessages((prev) => [...prev, resJson.message]);
        setNewMsgText("");
        setAttachmentType("none");
        setAttachmentName("");
        setAttachmentUrl("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading research projects &amp; collaborative chat...</p>
      </div>
    );
  }

  const isEnrolled = !!data?.is_enrolled;
  const projects = data?.projects || [];
  const tasks = data?.tasks || [];

  const researchStages = [
    "Idea",
    "Literature Review",
    "Protocol / IRB",
    "Data Collection",
    "Manuscript Drafting",
    "Peer Review",
    "Published",
  ];

  return (
    <EnrollmentGate
      isEnrolled={isEnrolled}
      programKey="research"
      programTitle="Clinical Research &amp; PubMed Publication Mentorship"
      programDescription="Co-author multicenter clinical research studies, IRB protocol documentation, and peer-reviewed neonatal manuscripts under the direct mentorship of Dr. Janardhan Mydam."
      icon="academic"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-1.5">
              <span>🔬</span> Physician Mentorship &amp; Collaborative Cohort
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Research Workspace
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Supervising Principal Investigator: <strong>Dr. Janardhan Mydam, MD, FAAP</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 shadow-sm transition inline-flex items-center gap-1.5"
            >
              <svg width="16" height="16" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Upload Manuscript Draft
            </button>
          </div>
        </div>

        {/* Section Compliance Disclaimer */}
        <SectionDisclaimer sectionKey="research" />

        {/* COLLABORATIVE RESEARCH GROUP CHAT (Students, Friends & Dr. Mydam) */}
        {activeGroup && (
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-sm overflow-hidden">
            {/* Group Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                    Active Research Working Group
                  </span>
                  <span className="text-xs text-slate-300">ID: {activeGroup.id}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{activeGroup.title}</h2>
                <p className="text-xs text-slate-300">
                  Subspecialty: <strong>{activeGroup.focus_area}</strong> · Lead: <strong>{activeGroup.lead_doctor}</strong>
                </p>
                <div className="text-[11px] text-indigo-200 mt-1 flex flex-wrap gap-2 items-center">
                  <span>👥 Collaborators:</span>
                  {activeGroup.members?.map((m) => (
                    <span key={m.email} className="px-1.5 py-0.5 rounded bg-white/10 text-white">
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Microsoft Teams Live Sync Button */}
              <a
                href={activeGroup.teams_link || "https://teams.microsoft.com"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition shrink-0 self-start sm:self-auto"
              >
                <span>🟣</span> Join MS Teams Research Call &#8599;
              </a>
            </div>

            {/* Chat Thread */}
            <div className="p-5 bg-slate-50 space-y-4 max-h-[440px] overflow-y-auto">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No messages in this research group yet. Share a question or study finding below.
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isDoctor = msg.sender_role === "doctor";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isDoctor ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                        <strong className="text-slate-800">{msg.sender_name}</strong>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            isDoctor ? "bg-amber-100 text-amber-900" : "bg-blue-100 text-blue-900"
                          }`}
                        >
                          {msg.sender_role?.toUpperCase()}
                        </span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isDoctor
                            ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                            : "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                        }`}
                      >
                        <div>{msg.message}</div>

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2.5 space-y-1.5">
                            {msg.attachments.map((att, idx) => (
                              <div
                                key={idx}
                                className={`flex items-center justify-between gap-3 p-2 rounded-lg text-xs ${
                                  isDoctor ? "bg-slate-100 text-slate-800" : "bg-white/15 text-white"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <span>{att.type === "image" ? "🖼️" : att.type === "doc" ? "📄" : "🔗"}</span>
                                  <span className="font-semibold truncate">{att.name}</span>
                                  <span className="text-[10px] opacity-75 shrink-0">({att.size})</span>
                                </div>
                                <a
                                  href={att.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`font-bold underline text-xs shrink-0 ${
                                    isDoctor ? "text-indigo-600" : "text-white"
                                  }`}
                                >
                                  Open &#8599;
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input & Attachment Toolbar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200">
              {attachmentType !== "none" && (
                <div className="p-2 mb-2 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2 text-xs flex-wrap">
                  <span className="font-bold text-indigo-900">
                    Attach {attachmentType.toUpperCase()}:
                  </span>
                  <input
                    type="text"
                    placeholder="Attachment Title / Caption"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="p-1 text-xs border border-indigo-200 rounded w-40"
                  />
                  <input
                    type="text"
                    required
                    placeholder="URL or file link (e.g. /uploads/sample_manuscript.docx)"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    className="p-1 text-xs border border-indigo-200 rounded flex-1 min-w-[200px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentType("none");
                      setAttachmentName("");
                      setAttachmentUrl("");
                    }}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Attach Link"
                    onClick={() => setAttachmentType("link")}
                    className={`p-2 rounded-lg border text-xs ${
                      attachmentType === "link" ? "bg-indigo-100 border-indigo-300" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    title="Attach Document"
                    onClick={() => setAttachmentType("doc")}
                    className={`p-2 rounded-lg border text-xs ${
                      attachmentType === "doc" ? "bg-indigo-100 border-indigo-300" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    📄
                  </button>
                  <button
                    type="button"
                    title="Attach Image"
                    onClick={() => setAttachmentType("image")}
                    className={`p-2 rounded-lg border text-xs ${
                      attachmentType === "image" ? "bg-indigo-100 border-indigo-300" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    🖼️
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Share updates, data insights, or ask Dr. Mydam and team..."
                  value={newMsgText}
                  onChange={(e) => setNewMsgText(e.target.value)}
                  className="flex-1 p-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />

                <button
                  type="submit"
                  disabled={sendingMsg}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shrink-0"
                >
                  {sendingMsg ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List & Detail */}
        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {proj.specialty || "Neonatal Medicine"} Clinical Investigation
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{proj.title}</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Lead Principal Investigator: <strong>{proj.lead_investigator || "Dr. Janardhan Mydam, MD, FAAP"}</strong> • Study ID: <span className="font-mono text-slate-500">{proj.id}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Stage: {proj.stage || "Data Collection & Synthesis"}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">IRB Approval: Active</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {proj.description || "Evaluating cerebral tissue oxygenation and systemic vascular resistance in neonates <32 weeks undergoing 60-second DCC versus umbilical cord milking."}
              </p>

              {/* Research Stage Status Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Research Pipeline &amp; Publication Milestones:
                </h4>
                <StatusTimeline steps={researchStages} currentStep={proj.stage || "Data Collection"} />
              </div>

              {/* Research Team & Advisory Strip */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Your Contributor Role</span>
                  <span className="font-bold text-slate-800">Co-Investigator (Methods &amp; Data Analysis)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Target Journal</span>
                  <span className="font-bold text-slate-800">Journal of Perinatology (PubMed Indexed)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Faculty Reviewer</span>
                  <span className="font-bold text-teal-700">Dr. Janardhan Mydam</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Study Documents & Manuscript Drafts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Study Documents &amp; Manuscript Drafts</h3>
              <p className="text-xs text-slate-500">Private research file vault for drafts, protocol certificates, and statistical runs.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition"
            >
              + Upload File
            </button>
          </div>

          <DocumentList
            documents={files}
            onUploadClick={() => setShowUploader(true)}
            emptyMessage="No research files uploaded yet."
          />
        </div>

        {/* Actionable Research Tasks */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                Assigned Research Deliverables
              </h3>
              <span className="text-xs text-slate-500 font-medium">{tasks.length} open items</span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 self-start sm:self-auto shrink-0">
                    Due: {task.due_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DocumentUploader
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        onSuccess={(newDoc) => setFiles((prev) => [newDoc, ...prev])}
        defaultCategory="Manuscript Draft"
      />
    </EnrollmentGate>
  );
}
