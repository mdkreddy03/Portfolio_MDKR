/**
 * JOURNEY SECTION - Personal Journey Tiles
 * Features: Lightbox for viewers (Zoom/Arrows), Passcode-protected Admin (Add/Delete)
 */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ChefHat, Plane, Lock, BarChart3, X, Plus, FolderOpen, Eye, 
  MousePointerClick, Globe, Clock, ArrowLeft, Trash2, Image,
  ChevronLeft, ChevronRight, Maximize2
} from "lucide-react";

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
interface BlogNote { id: string; title: string; content: string; createdAt: number; }
interface FolderItem { id: string; name: string; images: string[]; }

// ─── Lightbox Component (View Only) ───
const Lightbox = ({ images, index, onClose, onPrev, onNext }: { 
  images: string[], index: number, onClose: () => void, onPrev: () => void, onNext: () => void 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-8 right-8 p-3 glass rounded-full hover:bg-white/20 transition z-[110]">
        <X className="w-6 h-6 text-white" />
      </button>

      <button 
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 md:left-8 p-4 text-white/40 hover:text-white transition-all z-[110]"
      >
        <ChevronLeft size={48} strokeWidth={1.5} />
      </button>

      <motion.div 
        key={index}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={images[index]} 
          alt="" 
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl select-none"
        />
        <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white/50 text-sm">
          {index + 1} / {images.length}
        </div>
      </motion.div>

      <button 
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 md:right-8 p-4 text-white/40 hover:text-white transition-all z-[110]"
      >
        <ChevronRight size={48} strokeWidth={1.5} />
      </button>
    </motion.div>
  );
};

// ─── Private Blog Modal ───
const PrivateBlogModal = ({ onClose }: { onClose: () => void }) => {
  const [notes, setNotes] = useState<BlogNote[]>(() => JSON.parse(localStorage.getItem("private_notes") || "[]"));
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
    setTitle(""); setContent(""); setEditing(null);
  };

  const remove = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem("private_notes", JSON.stringify(updated));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }} onClick={e => e.stopPropagation()} className="w-full max-w-2xl max-h-[85vh] glass rounded-3xl border border-white/10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div><h3 className="text-xl font-semibold text-foreground">Private Blog</h3><p className="text-xs text-muted-foreground mt-1">{notes.length} notes</p></div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition"><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <div className="p-6 border-b border-white/10 space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your thoughts..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
          <button onClick={save} className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition">{editing ? "Update" : "Save Note"}</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {[...notes].reverse().map(note => (
            <div key={note.id} className="glass rounded-2xl p-5 border border-white/5 group">
              <div className="flex justify-between mb-2"><h4 className="font-semibold">{note.title}</h4><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition"><button onClick={() => { setEditing(note); setTitle(note.title); setContent(note.content); }} className="text-xs text-muted-foreground hover:text-white">Edit</button><button onClick={() => remove(note.id)} className="text-muted-foreground hover:text-red-400"><Trash2 size={14} /></button></div></div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
            </div>
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
    { label: "Page Views", value: analytics.totalViews, icon: Eye, color: "from-blue-500/20 to-cyan-500/20" },
    { label: "Total Clicks", value: analytics.totalClicks, icon: MousePointerClick, color: "from-purple-500/20 to-pink-500/20" },
    { label: "Sessions", value: analytics.totalSessions, icon: Globe, color: "from-emerald-500/20 to-teal-500/20" },
    { label: "Actions/Session", value: analytics.totalSessions ? Math.round((analytics.totalViews + analytics.totalClicks) / analytics.totalSessions) : 0, icon: Clock, color: "from-orange-500/20 to-amber-500/20" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }} onClick={e => e.stopPropagation()} className="w-full max-w-3xl max-h-[85vh] glass rounded-3xl border border-white/10 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10"><h3 className="text-xl font-semibold">Insights Lab</h3><button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition"><X size={20} /></button></div>
        <div className="p-6 grid grid-cols-2 gap-4">{statCards.map((stat) => (<div key={stat.label} className="glass rounded-2xl p-5 border border-white/5"><div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}><stat.icon className="w-5 h-5" /></div><p className="text-3xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>))}</div>
      </motion.div>
    </motion.div>
  );
};

// ─── Folder Modal (Culinary / Travel) ───
const FolderModal = ({ title, storageKey, onClose }: { title: string; storageKey: string; onClose: () => void }) => {
  const [folders, setFolders] = useState<FolderItem[]>(() => JSON.parse(localStorage.getItem(storageKey) || "[]"));
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem("journey_admin") === "true");
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);

  const persist = (updated: FolderItem[]) => { setFolders(updated); localStorage.setItem(storageKey, JSON.stringify(updated)); };
  const addFolder = () => { if (!newFolderName.trim()) return; persist([...folders, { id: crypto.randomUUID(), name: newFolderName.trim(), images: [] }]); setNewFolderName(""); };
  const removeFolder = (id: string) => persist(folders.filter(f => f.id !== id));

  const addImage = (folderId: string) => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*"; input.multiple = true;
    input.onchange = () => {
      if (!input.files) return;
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const updated = folders.map(f => f.id === folderId ? { ...f, images: [...f.images, reader.result as string] } : f);
          persist(updated);
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const removeImage = (folderId: string, imgIndex: number) => {
    const updated = folders.map(f => f.id === folderId ? { ...f, images: f.images.filter((_, i) => i !== imgIndex) } : f);
    persist(updated);
  };

  const currentFolder = folders.find(f => f.id === openFolderId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }} onClick={e => e.stopPropagation()} className="w-full max-w-2xl max-h-[85vh] glass rounded-3xl border border-white/10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">{openFolderId && (<button onClick={() => setOpenFolderId(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition"><ArrowLeft size={16} /></button>)}<div><h3 className="text-xl font-semibold">{currentFolder ? currentFolder.name : title}</h3><p className="text-xs text-muted-foreground">{currentFolder ? `${currentFolder.images.length} photos` : `${folders.length} folders`}</p></div></div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!openFolderId ? (
            <div className="space-y-6">
              {isAdmin && (
                <div className="flex gap-2"><input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="New folder name..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50" /><button onClick={addFolder} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl"><Plus size={16}/></button></div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {folders.map(folder => (
                  <motion.div key={folder.id} whileHover={{ y: -4 }} onClick={() => setOpenFolderId(folder.id)} className="glass rounded-2xl p-5 border border-white/5 cursor-pointer group relative">
                    <FolderOpen className="w-8 h-8 text-primary/60 mb-3" />
                    <p className="text-sm font-medium">{folder.name}</p>
                    <p className="text-[10px] text-muted-foreground">{folder.images.length} photos</p>
                    {isAdmin && (<button onClick={e => { e.stopPropagation(); removeFolder(folder.id); }} className="absolute top-3 right-3 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition"><Trash2 size={14}/></button>)}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {isAdmin && (
                <button onClick={() => addImage(openFolderId)} className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm hover:bg-primary/20 transition"><Image size={16} /> Add Photos</button>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentFolder?.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group cursor-zoom-in">
                    <img src={img} alt="" className="w-full h-full object-cover" onClick={() => setSelectedImgIndex(i)} />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none"><Maximize2 className="text-white w-5 h-5" /></div>
                    {isAdmin && (<button onClick={() => removeImage(openFolderId, i)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition"><Trash2 size={14}/></button>)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* View Only Lightbox */}
      <AnimatePresence>
        {selectedImgIndex !== null && currentFolder && (
          <Lightbox 
            images={currentFolder.images} 
            index={selectedImgIndex} 
            onClose={() => setSelectedImgIndex(null)}
            onPrev={() => setSelectedImgIndex(prev => prev! > 0 ? prev! - 1 : currentFolder.images.length - 1)}
            onNext={() => setSelectedImgIndex(prev => prev! < currentFolder.images.length - 1 ? prev! + 1 : 0)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Journey Items ───
const journeyItems = [
  { id: 1, title: "Culinary Adventures", subtitle: "Kitchen Experiments", icon: ChefHat, description: "Exploring flavors and creating dishes I love.", highlights: ["Biryani", "Pasta", "Desserts"], type: "folder", storageKey: "culinary_folders" },
  { id: 2, title: "Travel", subtitle: "Places Explored", icon: Plane, description: "Documenting journeys and unforgettable landscapes.", highlights: ["Mountains", "Beaches", "Cities"], type: "folder", storageKey: "travel_folders" },
  { id: 3, title: "Private Blog", subtitle: "Personal Notes", icon: Lock, description: "My private thoughts, reflections, and stories.", highlights: ["Notes", "Ideas", "Stories"], type: "blog", protected: true },
  { id: 4, title: "Insights Lab", subtitle: "Personal Analytics", icon: BarChart3, description: "Track site interactions and engagement data.", highlights: ["Most Viewed", "Most Clicked", "Top Sections"], type: "analytics", protected: true },
];

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.3], [80, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  useEffect(() => { trackEvent("view", "Journey Section"); }, []);

  const handleClick = (item: any) => {
    trackEvent("click", item.title);
    if (item.protected) {
      const entered = prompt("Enter Passcode");
      if (entered !== PASSCODE) return alert("Incorrect Passcode");
      sessionStorage.setItem("journey_admin", "true");
    }
    setActiveModal(item.title);
  };

  return (
    <section ref={containerRef} id="journey" className="section-padding relative overflow-hidden bg-black/40">
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -z-10" />
      <div className="container mx-auto">
        <motion.div style={{ y: headerY, opacity: headerOpacity }} className="text-center mb-20">
          <span className="text-sm text-accent uppercase tracking-widest mb-4 block">Beyond The Code</span>
          <h2 className="text-5xl font-semibold mb-6">My Journey</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Experiences and passions that shape who I am outside engineering.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {journeyItems.map((item, index) => (
            <motion.div 
              key={item.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.01 }} viewport={{ once: true }} onClick={() => handleClick(item)}
              className="glass rounded-[2.5rem] p-10 glow-border cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition"><item.icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition" /></div>
              <span className="text-xs uppercase text-muted-foreground tracking-wider">{item.subtitle}</span>
              <h3 className="text-2xl font-semibold mt-1 mb-4 group-hover:text-primary transition">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{item.description}</p>
              <div className="flex flex-wrap gap-2">{item.highlights.map(h => (<span key={h} className="px-3 py-1 bg-background/40 rounded-lg text-xs">{h}</span>))}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeModal === "Private Blog" && <PrivateBlogModal onClose={() => setActiveModal(null)} />}
        {activeModal === "Insights Lab" && <InsightsLabModal onClose={() => setActiveModal(null)} />}
        {activeModal === "Culinary Adventures" && <FolderModal title="Culinary Adventures" storageKey="culinary_folders" onClose={() => setActiveModal(null)} />}
        {activeModal === "Travel" && <FolderModal title="Travel" storageKey="travel_folders" onClose={() => setActiveModal(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default JourneySection;
