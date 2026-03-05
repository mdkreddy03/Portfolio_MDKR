/**
 * JOURNEY SECTION - Personal Journey Tiles
 * With: Private Blog (passcode), Insights Lab (analytics), Folder system for Culinary & Travel
 */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChefHat, Plane, Lock, BarChart3, X, Plus, FolderOpen, Eye, MousePointerClick, Globe, Clock, ArrowLeft, Trash2, Image } from "lucide-react";

const PASSCODE = "1436";

// ─── Analytics Tracker (localStorage) ───
const trackEvent = (type: string, label: string) => {
  const events = JSON.parse(localStorage.getItem("journey_events") || "[]");
  events.push({ type, label, timestamp: Date.now() });
  localStorage.setItem("journey_events", JSON.stringify(events));
};

const getAnalytics = () => {
  const events: { type: string; label: string; timestamp: number }[] = JSON.parse(localStorage.getItem("journey_events") || "[]");
  const views = events.filter(e => e.type === "view");
  const clicks = events.filter(e => e.type === "click");

  const viewCounts: Record<string, number> = {};
  const clickCounts: Record<string, number> = {};
  views.forEach(e => { viewCounts[e.label] = (viewCounts[e.label] || 0) + 1; });
  clicks.forEach(e => { clickCounts[e.label] = (clickCounts[e.label] || 0) + 1; });

  const sortedViews = Object.entries(viewCounts).sort((a, b) => b[1] - a[1]);
  const sortedClicks = Object.entries(clickCounts).sort((a, b) => b[1] - a[1]);

  return {
    totalViews: views.length,
    totalClicks: clicks.length,
    totalSessions: new Set(events.map(e => new Date(e.timestamp).toDateString())).size,
    mostViewed: sortedViews.slice(0, 5),
    mostClicked: sortedClicks.slice(0, 5),
  };
};

// ─── Types ───
interface BlogNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
}

interface FolderItem {
  id: string;
  name: string;
  images: string[]; // base64 data URLs
}

// ─── Private Blog Modal ───
const PrivateBlogModal = ({ onClose }: { onClose: () => void }) => {
  const [notes, setNotes] = useState<BlogNote[]>(() =>
    JSON.parse(localStorage.getItem("private_notes") || "[]")
  );
  const [editing, setEditing] = useState<BlogNote | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const save = () => {
    if (!title.trim()) return;
    const updated = editing
      ? notes.map(n => n.id === editing.id ? { ...n, title, content } : n)
      : [...notes, { id: crypto.randomUUID(), title, content, createdAt: Date.now() }];
    setNotes(updated);
    localStorage.setItem("private_notes", JSON.stringify(updated));
    setTitle("");
    setContent("");
    setEditing(null);
  };

  const remove = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem("private_notes", JSON.stringify(updated));
  };

  const startEdit = (note: BlogNote) => {
    setEditing(note);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] glass rounded-3xl border border-white/10 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Private Blog</h3>
            <p className="text-xs text-muted-foreground mt-1">{notes.length} notes</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Write Area */}
        <div className="p-6 border-b border-white/10 space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your story, note, or thoughts..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
          />
          <button
            onClick={save}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            {editing ? "Update" : "Save Note"}
          </button>
          {editing && (
            <button
              onClick={() => { setEditing(null); setTitle(""); setContent(""); }}
              className="ml-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {notes.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">No notes yet. Start writing!</p>
          )}
          {[...notes].reverse().map(note => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 border border-white/5 group"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-foreground">{note.title}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => startEdit(note)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition text-xs">Edit</button>
                  <button onClick={() => remove(note.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{note.content}</p>
              <p className="text-[10px] text-muted-foreground/50 mt-3">
                {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Insights Lab Modal ───
const InsightsLabModal = ({ onClose }: { onClose: () => void }) => {
  const analytics = getAnalytics();

  const statCards = [
    { label: "Total Page Views", value: analytics.totalViews, icon: Eye, color: "from-blue-500/20 to-cyan-500/20" },
    { label: "Total Clicks", value: analytics.totalClicks, icon: MousePointerClick, color: "from-purple-500/20 to-pink-500/20" },
    { label: "Unique Sessions", value: analytics.totalSessions, icon: Globe, color: "from-emerald-500/20 to-teal-500/20" },
    { label: "Avg. Actions/Session", value: analytics.totalSessions ? Math.round((analytics.totalViews + analytics.totalClicks) / analytics.totalSessions) : 0, icon: Clock, color: "from-orange-500/20 to-amber-500/20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[85vh] glass rounded-3xl border border-white/10 overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold text-foreground">Insights Lab</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 border border-white/5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-foreground" />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Most Viewed */}
          <div className="glass rounded-2xl p-5 border border-white/5">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Most Viewed
            </h4>
            {analytics.mostViewed.length === 0 ? (
              <p className="text-xs text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-2">
                {analytics.mostViewed.map(([label, count], i) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{i + 1}. {label}</span>
                    <span className="text-foreground font-medium">{count} views</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Most Clicked */}
          <div className="glass rounded-2xl p-5 border border-white/5">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-primary" /> Most Clicked
            </h4>
            {analytics.mostClicked.length === 0 ? (
              <p className="text-xs text-muted-foreground">No data yet</p>
            ) : (
              <div className="space-y-2">
                {analytics.mostClicked.map(([label, count], i) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{i + 1}. {label}</span>
                    <span className="text-foreground font-medium">{count} clicks</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Folder Modal (Culinary / Travel) ───
const FolderModal = ({ title, storageKey, onClose }: { title: string; storageKey: string; onClose: () => void }) => {
  const [folders, setFolders] = useState<FolderItem[]>(() =>
    JSON.parse(localStorage.getItem(storageKey) || "[]")
  );
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminFlag = sessionStorage.getItem("journey_admin");
    setIsAdmin(adminFlag === "true");
  }, []);

  const persist = (updated: FolderItem[]) => {
    setFolders(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const addFolder = () => {
    if (!newFolderName.trim()) return;
    persist([...folders, { id: crypto.randomUUID(), name: newFolderName.trim(), images: [] }]);
    setNewFolderName("");
  };

  const removeFolder = (id: string) => {
    persist(folders.filter(f => f.id !== id));
  };

  const addImage = (folderId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = () => {
      if (!input.files) return;
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const updated = folders.map(f =>
            f.id === folderId ? { ...f, images: [...f.images, reader.result as string] } : f
          );
          persist(updated);
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const removeImage = (folderId: string, imgIndex: number) => {
    const updated = folders.map(f =>
      f.id === folderId ? { ...f, images: f.images.filter((_, i) => i !== imgIndex) } : f
    );
    persist(updated);
  };

  const currentFolder = folders.find(f => f.id === openFolder);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[85vh] glass rounded-3xl border border-white/10 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            {openFolder && (
              <button onClick={() => setOpenFolder(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
            <div>
              <h3 className="text-xl font-semibold text-foreground">{currentFolder ? currentFolder.name : title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {currentFolder ? `${currentFolder.images.length} photos` : `${folders.length} folders`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!openFolder ? (
            <>
              {/* Add folder (admin only) */}
              {isAdmin && (
                <div className="flex gap-2 mb-6">
                  <input
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addFolder()}
                    placeholder="New folder name..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                  <button onClick={addFolder} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Folder Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {folders.map(folder => (
                  <motion.div
                    key={folder.id}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => { setOpenFolder(folder.id); trackEvent("click", `${title} - ${folder.name}`); }}
                    className="glass rounded-2xl p-5 border border-white/5 cursor-pointer group relative"
                  >
                    <FolderOpen className="w-8 h-8 text-primary/60 mb-3 group-hover:text-primary transition" />
                    <p className="text-sm font-medium text-foreground">{folder.name}</p>
                    <p className="text-[10px] text-muted-foreground">{folder.images.length} photos</p>
                    {isAdmin && (
                      <button
                        onClick={e => { e.stopPropagation(); removeFolder(folder.id); }}
                        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
                {folders.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground text-sm py-8">
                    {isAdmin ? "Create your first folder above!" : "No folders yet."}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Inside a folder - image gallery */}
              {isAdmin && (
                <button
                  onClick={() => addImage(openFolder)}
                  className="mb-6 flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary hover:bg-primary/20 transition"
                >
                  <Image className="w-4 h-4" /> Add Photos
                </button>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentFolder?.images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative aspect-square rounded-2xl overflow-hidden group"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {isAdmin && (
                      <button
                        onClick={() => removeImage(openFolder, i)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))}
                {currentFolder?.images.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground text-sm py-8">
                    {isAdmin ? "Add photos to this folder." : "No photos yet."}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Journey Items ───
const journeyItems = [
  {
    id: 1,
    title: "Culinary Adventures",
    subtitle: "Kitchen Experiments",
    icon: ChefHat,
    description: "Exploring flavors and creating dishes I love.",
    highlights: ["Biryani", "Pasta", "Desserts"],
    type: "folder" as const,
    storageKey: "culinary_folders",
  },
  {
    id: 2,
    title: "Travel",
    subtitle: "Places Explored",
    icon: Plane,
    description: "Documenting journeys and unforgettable landscapes.",
    highlights: ["Mountains", "Beaches", "Cities"],
    type: "folder" as const,
    storageKey: "travel_folders",
  },
  {
    id: 3,
    title: "Private Blog",
    subtitle: "Personal Notes",
    icon: Lock,
    description: "My private thoughts, reflections, and stories.",
    highlights: ["Notes", "Ideas", "Stories"],
    type: "blog" as const,
    protected: true,
  },
  {
    id: 4,
    title: "Insights Lab",
    subtitle: "Personal Analytics",
    icon: BarChart3,
    description: "Track site interactions and engagement data.",
    highlights: ["Most Viewed", "Most Clicked", "Top Sections"],
    type: "analytics" as const,
    protected: true,
  },
];

// ─── Main Section ───
const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [80, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Track page view on mount
  useEffect(() => {
    trackEvent("view", "Journey Section");
  }, []);

  const handleClick = (item: typeof journeyItems[0]) => {
    trackEvent("click", item.title);

    if (item.protected) {
      const entered = prompt("Enter Passcode");
      if (entered !== PASSCODE) {
        alert("Incorrect Passcode");
        return;
      }
      // Set admin session for folder editing
      sessionStorage.setItem("journey_admin", "true");
    }

    setActiveModal(item.title);
  };

  return (
    <section
      ref={containerRef}
      id="journey"
      className="section-padding relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-20"
        >
          <span className="text-sm text-accent uppercase tracking-widest mb-4 block">
            Beyond The Code
          </span>
          <h2 className="text-5xl font-semibold mb-6">My Journey</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experiences and passions that shape who I am outside engineering.
          </p>
        </motion.div>

        {/* Tiles */}
        <div className="grid md:grid-cols-2 gap-6">
          {journeyItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              onClick={() => handleClick(item)}
              className="glass rounded-3xl p-10 glow-border cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition">
                <item.icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition" />
              </div>
              <span className="text-xs uppercase text-muted-foreground tracking-wider">
                {item.subtitle}
              </span>
              <h3 className="text-2xl font-semibold mt-1 mb-4 group-hover:text-primary transition">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.highlights.map(h => (
                  <span key={h} className="px-3 py-1 bg-background/40 rounded-lg text-xs">
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === "Private Blog" && (
          <PrivateBlogModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "Insights Lab" && (
          <InsightsLabModal onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "Culinary Adventures" && (
          <FolderModal title="Culinary Adventures" storageKey="culinary_folders" onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "Travel" && (
          <FolderModal title="Travel" storageKey="travel_folders" onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default JourneySection;
