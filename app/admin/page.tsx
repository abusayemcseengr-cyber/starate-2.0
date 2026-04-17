"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

type Celebrity = {
  id: string;
  name: string;
  photo: string;
  bio: string;
  category: string;
  nationality?: string;
  avgRating: number;
  totalVotes: number;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: { ratings: number };
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"celebrities" | "users">("celebrities");
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");
  const [nationality, setNationality] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [celRes, userRes] = await Promise.all([
        fetch("/api/admin/celebrities"),
        fetch("/api/admin/users")
      ]);
      if (celRes.ok) setCelebrities(await celRes.json());
      if (userRes.ok) setUsers(await userRes.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (cel?: Celebrity) => {
    if (cel) {
      setEditingId(cel.id);
      setName(cel.name);
      setPhoto(cel.photo);
      setBio(cel.bio);
      setCategory(cel.category);
      setNationality(cel.nationality || "");
    } else {
      setEditingId(null);
      setName("");
      setPhoto("");
      setBio("");
      setCategory("");
      setNationality("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = { id: editingId, name, photo, bio, category, nationality };
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/celebrities", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchData();
      closeModal();
      showToast(editingId ? "Celeb Updated!" : "Celeb Created!");
    } catch {
      showToast("Error saving celebrity");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/celebrities?id=${id}`, { method: "DELETE" });
      if (res.ok) { await fetchData(); showToast(`${name} deleted.`); }
    } catch { showToast("Error deleting celebrity"); }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) { await fetchData(); showToast("User role updated!"); }
      else { const err = await res.json(); showToast(err.error || "Update failed"); }
    } catch { showToast("Error updating user"); }
  };

  if (loading && celebrities.length === 0) {
    return <div style={{ padding: "var(--space-2xl)", textAlign: "center" }}>Loading Admin Tools...</div>;
  }

  return (
    <div style={{ padding: "var(--space-2xl)", maxWidth: 1200, margin: "0 auto" }}>
      {toast && (
        <div style={{
          position: "fixed", top: "calc(var(--navbar-height) + 20px)", right: 20,
          background: "var(--aurora-gradient)", color: "white", padding: "10px 20px",
          borderRadius: "var(--radius-md)", zIndex: 1000, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}>
          {toast}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-xl)", flexWrap: "wrap", gap: 20 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 900, background: "var(--aurora-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
            Control Center
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>Management panel for celebrities and user permissions.</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.05)", padding: 4, borderRadius: 12 }}>
          <button 
            onClick={() => setActiveTab("celebrities")}
            style={{ 
              padding: "8px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700,
              background: activeTab === "celebrities" ? "white" : "transparent",
              boxShadow: activeTab === "celebrities" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
              color: activeTab === "celebrities" ? "var(--text-primary)" : "var(--text-muted)",
              transition: "all 0.2s ease"
            }}
          >
            Stars
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            style={{ 
              padding: "8px 24px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700,
              background: activeTab === "users" ? "white" : "transparent",
              boxShadow: activeTab === "users" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
              color: activeTab === "users" ? "var(--text-primary)" : "var(--text-muted)",
              transition: "all 0.2s ease"
            }}
          >
            Users
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "celebrities" ? (
          <motion.div key="celeb-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button
                  onClick={() => openModal()}
                  style={{
                    background: "var(--aurora-gradient)", color: "white", border: "none",
                    padding: "10px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: 700,
                    boxShadow: "0 4px 15px rgba(102,126,234,0.3)"
                  }}
                >
                  + Add Live Star
                </button>
             </div>
             <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)", border: "1.5px solid rgba(255,255,255,0.5)", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left" }}>
                      <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>Media</th>
                      <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>Identity</th>
                      <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>Category</th>
                      <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>Stats</th>
                      <th style={{ padding: 12, textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)" }}>Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {celebrities.map(cel => (
                      <tr key={cel.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                        <td style={{ padding: 12 }}>
                          <Image 
                            src={cel.photo} 
                            alt={cel.name} 
                            width={48} 
                            height={48} 
                            unoptimized
                            style={{ borderRadius: "12px", objectFit: "cover", border: "2px solid white", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }} 
                          />
                        </td>
                        <td style={{ padding: 12 }}>
                          <div style={{ fontWeight: 800, fontSize: "1rem" }}>{cel.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{cel.nationality || "Global"}</div>
                        </td>
                        <td style={{ padding: 12 }}><span style={{ background: "rgba(102,126,234,0.08)", color: "var(--aurora-indigo)", padding: "4px 10px", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700 }}>{cel.category}</span></td>
                        <td style={{ padding: 12, fontWeight: 700 }}>{cel.avgRating.toFixed(1)} ★ <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: "0.8rem" }}>({cel.totalVotes})</span></td>
                        <td style={{ padding: 12, textAlign: "right" }}>
                          <button onClick={() => openModal(cel)} style={{ marginRight: 12, background: "none", border: "none", color: "var(--aurora-indigo)", cursor: "pointer", fontWeight: 700 }}>Edit</button>
                          <button onClick={() => handleDelete(cel.id, cel.name)} style={{ background: "none", border: "none", color: "#f5576c", cursor: "pointer", fontWeight: 700 }}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        ) : (
          <motion.div key="user-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)", borderRadius: "var(--radius-xl)", padding: "var(--space-lg)", border: "1.5px solid rgba(255,255,255,0.5)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left" }}>
                    <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>User</th>
                    <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>Status</th>
                    <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>Participation</th>
                    <th style={{ padding: 12, fontSize: "0.8rem", color: "var(--text-muted)" }}>Joined</th>
                    <th style={{ padding: 12, textAlign: "right", fontSize: "0.8rem", color: "var(--text-muted)" }}>Permission</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                      <td style={{ padding: 12 }}>
                        <div style={{ fontWeight: 800 }}>{user.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.email}</div>
                      </td>
                      <td style={{ padding: 12 }}>
                        <span style={{ 
                          padding: "4px 10px", borderRadius: 8, fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase",
                          background: user.role === "admin" ? "rgba(102,126,234,0.15)" : "rgba(0,0,0,0.05)",
                          color: user.role === "admin" ? "var(--aurora-indigo)" : "var(--text-muted)"
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: 12, fontWeight: 600 }}>{user._count.ratings} Ratings</td>
                      <td style={{ padding: 12, fontSize: "0.85rem", color: "var(--text-muted)" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: 12, textAlign: "right" }}>
                        <button 
                          onClick={() => toggleUserRole(user.id, user.role)} 
                          style={{ background: "none", border: "none", color: "var(--aurora-indigo)", cursor: "pointer", fontWeight: 700 }}
                        >
                          {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", padding: 20
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                background: "white", width: "100%", maxWidth: 500, padding: 32,
                borderRadius: "24px", boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
              }}
            >
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: 900 }}>{editingId ? "Edit" : "New"} Star</h2>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                    style={{ padding: 12, borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.06)", background: "#f9f9f9" }} />
                  <input required placeholder="Category (Actor...)" value={category} onChange={e => setCategory(e.target.value)}
                    style={{ padding: 12, borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.06)", background: "#f9f9f9" }} />
                </div>
                
                <input required placeholder="Image URL (https://...)" value={photo} onChange={e => setPhoto(e.target.value)}
                  style={{ padding: 12, borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.06)", background: "#f9f9f9" }} />
                
                <input placeholder="Nationality (Optional)" value={nationality} onChange={e => setNationality(e.target.value)}
                  style={{ padding: 12, borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.06)", background: "#f9f9f9" }} />
                
                <textarea required placeholder="Write a short biography..." value={bio} onChange={e => setBio(e.target.value)}
                  style={{ padding: 12, borderRadius: 10, border: "1.5px solid rgba(0,0,0,0.06)", background: "#f9f9f9", minHeight: 120, resize: "none" }} />

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button type="button" onClick={closeModal} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "rgba(0,0,0,0.05)", cursor: "pointer", fontWeight: 700 }}>Discard</button>
                  <button type="submit" disabled={submitting} style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", background: "var(--text-primary)", color: "white", cursor: "pointer", fontWeight: 700 }}>
                    {submitting ? "Processing..." : "Save Star"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
