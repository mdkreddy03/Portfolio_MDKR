/**
 * ADVANCED EXPERIENCE SECTION - Apple-Inspired 3D Portfolio
 * =====================================================
 * Fix: Corrected Mirror Imaging on Back Side Flip.
 */

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Calendar, Building2, RotateCcw, CheckCircle2, Zap } from "lucide-react";

const DE_KEYWORDS = [
  "Azure Data Factory", "Databricks", "PySpark", "Snowflake", "SQL", "Airflow", "Power BI", "Python", 
  "dbt", "Azure Synapse", "BigQuery", "Docker", "PostgreSQL", "Apache Spark", "Looker", "GitHub Actions",
  "ETL", "ELT", "Lakehouse", "Real-time", "Streaming", "HIPAA", "Row-Level Security", "RLS", 
  "Partitioning", "Star-schema", "CI/CD", "Forecasting", "Telemetry", "Data Pipeline", "Cloud", "AWS"
];

const experiences = [
  {
    id: 1,
    role: "Data Engineer",
    company: "HCA Healthcare",
    period: "Aug 2023 - Present",
    domain: "Healthcare",
    description: "Architected a real-time clinical telemetry streaming pipeline, synchronizing data from 100+ diagnostic devices into a centralized cloud lakehouse.",
    skills: ["Azure Data Factory", "Databricks", "PySpark", "Snowflake", "SQL", "Airflow", "AWS"],
    responsibilities: [
      "Engineered PySpark streaming pipelines, slashing time-to-insight from 15 minutes to sub-30 seconds for critical care units.",
      "Optimized Databricks clusters and Snowflake auto-scaling, delivering a 35% reduction in annual cloud expenditure.",
      "Unified clinical data silos across the network, standardizing 200+ KPIs for improved cross-departmental reporting.",
      "Managed automated ETL workflows in Airflow, achieving 100% HIPAA compliance and zero-defect audit reporting.",
      "Implemented Row-Level Security (RLS) and dynamic masking, securing 50M+ annual patient records against unauthorized access.",
      "Eliminated partitioning bottlenecks in the primary lakehouse, resulting in 40% faster executive dashboard load times.",
      "Maintained 99.99% uptime during the massive migration of 500TB legacy on-prem data to Snowflake cloud infrastructure.",
      "Integrated real-time telemetry into forecasting models to optimize staffing and resource allocation across 10+ units."
    ]
  },
  {
    id: 2,
    role: "Associate Data Analyst / Data Engineer",
    company: "Accenture",
    period: "June 2019 - July 2021",
    domain: "Technology",
    description: "Developed a multi-source ELT framework to consolidate data from fragmented payment APIs into BigQuery, resolving $2M+ monthly discrepancies.",
    skills: ["Python", "dbt", "BigQuery", "Docker", "SQL", "Apache Spark", "GitHub Actions"],
    responsibilities: [
      "Developed a dbt transformation layer, increasing financial reconciliation accuracy to 99.8% for enterprise reporting.",
      "Optimized BigQuery partitioned structures and materialized views, cutting query execution times by 60%.",
      "Containerized data ingestion workflows with Docker, reducing environment-related deployment errors by 25%.",
      "Implemented automated validation via Great Expectations, identifying 95% of schema drifts before production impact.",
      "Structured star-schema models for BI, increasing executive dashboard refresh rates by 3x for real-time decision making.",
      "Automated 15+ weekly manual data extraction tasks using Python, saving 60+ engineering hours per month.",
      "Streamlined ingestion flows from 10+ third-party APIs into the central warehouse for unified performance tracking.",
      "Translated engagement metrics into actionable insights for 1M+ active users, significantly improving retention strategy."
    ]
  }
];

const BackgroundAura = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      animate={{ x: [0, 150, 0], y: [0, 100, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-5%] left-[-5%] w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full"
    />
    <motion.div 
      animate={{ x: [0, -120, 0], y: [0, 80, 0], scale: [1, 1.4, 1] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-blue-500/10 blur-[160px] rounded-full"
    />
  </div>
);

const HighlightTools = ({ text, isFlipped }: { text: string; isFlipped: boolean }) => {
  let parts: (string | JSX.Element)[] = [text];
  DE_KEYWORDS.forEach((keyword) => {
    const newParts: (string | JSX.Element)[] = [];
    parts.forEach((part) => {
      if (typeof part === "string") {
        const regex = new RegExp(`\\b(${keyword})\\b`, "gi");
        const split = part.split(regex);
        split.forEach((s, i) => {
          if (s.toLowerCase() === keyword.toLowerCase()) {
            newParts.push(
              <motion.span 
                key={i}
                animate={isFlipped ? { color: "#2997ff", textShadow: "0 0 12px rgba(41, 151, 255, 0.8)" } : {}}
                className="font-bold transition-colors duration-500"
              >
                {s}
              </motion.span>
            );
          } else if (s) { newParts.push(s); }
        });
      } else { newParts.push(part); }
    });
    parts = newParts;
  });
  return <>{parts}</>;
};

const ExperienceCard = ({ exp }: { exp: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      layout
      onMouseMove={handleMouseMove}
      className="group relative w-full cursor-pointer"
      style={{ perspective: "2000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        layout
        animate={{ rotateY: isFlipped ? 180 : 0, height: isFlipped ? "auto" : "auto" }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 20 }}
        style={{ transformStyle: "preserve-3d", minHeight: isFlipped ? "720px" : "480px" }}
        className="relative w-full"
      >
        {/* Mouse Spotlight Container - Corrected for Flip */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "none" }}
        >
          <motion.div
            className="absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ 
              background: useTransform([mouseX, mouseY], ([x, y]) => 
                `radial-gradient(600px circle at ${x}px ${y}px, rgba(41, 151, 255, 0.15), transparent 80%)`
              ) 
            }}
          />
        </motion.div>

        {/* FRONT SIDE */}
        <div className="absolute inset-0 w-full h-full glass rounded-[2.5rem] p-8 md:p-10 flex flex-col shadow-2xl border border-white/5" style={{ backfaceVisibility: "hidden", zIndex: isFlipped ? 0 : 1 }}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Calendar className="w-4 h-4 text-primary" />{exp.period}</div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{exp.domain}</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{exp.role}</h3>
          <p className="text-primary font-semibold mb-6 text-lg">{exp.company}</p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 border-l-2 border-primary/30 pl-4">{exp.description}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {exp.skills.map((s: string) => <span key={s} className="px-3 py-1.5 bg-white/5 text-muted-foreground text-[10px] rounded-lg border border-white/10 uppercase tracking-widest font-bold">{s}</span>)}
          </div>
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-primary text-xs font-black uppercase tracking-[0.3em]">
            <div className="flex items-center gap-3"><Zap className="w-4 h-4 fill-primary animate-pulse" /><span>Click to View Impact & Results</span></div>
            <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="absolute inset-0 w-full h-full glass rounded-[2.5rem] p-8 md:p-10 border border-primary/40 bg-black/95 shadow-2xl flex flex-col" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: isFlipped ? 1 : 0 }}>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xl font-bold text-[#2997ff] tracking-tight uppercase">RESPONSIBILITIES</h3>
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-[#86868b]">Impact & Business Outcomes</p>
            <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-primary/60 via-primary/10 to-transparent" />
          </div>
          <div className="overflow-y-auto flex-grow custom-scrollbar pr-4">
            <ul className="space-y-5">
              {exp.responsibilities.map((p: string, i: number) => (
                <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={isFlipped ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 + (i * 0.08) }} className="text-sm text-muted-foreground flex gap-4 leading-relaxed group/item">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(41, 151, 255, 0.8)]" />
                  <span className="group-hover/item:text-white transition-colors">
                    <HighlightTools text={p} isFlipped={isFlipped} />
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="mt-6 pt-4 text-center border-t border-white/5">
             <span className="text-primary/40 font-bold text-[9px] uppercase tracking-[0.5em]">Click to return to overview</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scrollSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const pathHeight = useTransform(scrollSpring, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" ref={containerRef} className="py-32 relative overflow-hidden bg-black">
      <BackgroundAura />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-28">
          <span className="text-primary text-[11px] font-black uppercase tracking-[0.6em] mb-4 block">Professional Odyssey</span>
          <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8">Experience</h2>
          <div className="inline-block glass px-6 py-3 border border-white/10 rounded-full">
            <p className="text-muted-foreground text-sm md:text-lg tracking-wide">
              Data Engineer <span className="text-primary mx-3">⫸</span> 4.5+ Yrs Experience | Optimizing Data Infra for Accuracy & Cost-Efficiency | Spark, Airflow, AWS
            </p>
          </div>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-0 md:left-12 top-0 bottom-0 w-[1px] bg-white/5 hidden md:block">
            <motion.div style={{ height: pathHeight }} className="absolute top-0 w-full bg-primary shadow-[0_0_20px_rgba(41,151,255,0.8)]" />
          </div>
          <div className="space-y-24 md:pl-32 pl-0">
            {experiences.map((exp) => <ExperienceCard key={exp.id} exp={exp} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
