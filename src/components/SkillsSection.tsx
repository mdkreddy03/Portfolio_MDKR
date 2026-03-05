/**
 * SKILLS SECTION - Apple-Inspired 3+2 Tile Grid with Enhanced Motion
 * ========================================================
 * Features: 3D Hover Tilt, Spring Click, and Staggered Tool Entry.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Database, BarChart3, Workflow, Cloud, Code2, GitBranch,
  Layers, Cpu, LineChart, Table2, Boxes, Zap, Terminal,
  Server, ShieldCheck, Search
} from "lucide-react";

const skillCategories = [
  {
    title: "Data Engineering",
    description: "Robust pipelines and architecture",
    icon: Workflow,
    skills: [
      { name: "Python", icon: Code2 },
      { name: "SQL", icon: Database },
      { name: "Apache Spark", icon: Zap },
      { name: "Airflow", icon: Workflow },
      { name: "Kafka", icon: Zap },
      { name: "ETL/ELT", icon: Layers },
    ],
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Cloud & Infra",
    description: "Modern platform deployment",
    icon: Cloud,
    skills: [
      { name: "AWS (S3, Redshift)", icon: Cloud },
      { name: "GCP", icon: Boxes },
      { name: "Snowflake", icon: Layers },
      { name: "Databricks", icon: Cpu },
      { name: "Docker", icon: Boxes },
      { name: "Terraform", icon: Server },
    ],
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Analytics & BI",
    description: "Turning data into decisions",
    icon: BarChart3,
    skills: [
      { name: "Tableau", icon: BarChart3 },
      { name: "Power BI", icon: LineChart },
      { name: "dbt", icon: GitBranch },
      { name: "Pandas", icon: Table2 },
      { name: "Looker", icon: Search },
      { name: "Excel/Sheets", icon: Table2 },
    ],
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Dev & Ops",
    description: "System reliability & tooling",
    icon: Server,
    skills: [
      { name: "PostgreSQL", icon: Database },
      { name: "APIs", icon: Code2 },
      { name: "Redis", icon: Zap },
      { name: "Git/GitHub", icon: GitBranch },
      { name: "Bash/Terminal", icon: Terminal },
      { name: "Data Security", icon: ShieldCheck },
    ],
    gradient: "from-red-500/20 to-rose-500/20",
  },
];

const SkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section 
      ref={containerRef}
      id="skills" 
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--gradient-section)" }}
    >
      <div className="container mx-auto">
        {/* Section header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block font-body text-sm text-primary uppercase tracking-widest mb-4"
          >
            Technical Expertise
          </motion.span>
          <h2 className="font-heading text-4xl md:text-6xl font-semibold text-foreground mb-6">
            Skills & Tools
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
            A comprehensive overview of my technical stack and data capabilities.
          </p>
        </motion.div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                // --- HOVER & CLICK ANIMATIONS ---
                whileHover={{ 
                  y: -10,
                  rotateX: 2, 
                  rotateY: -2,
                  transition: { type: "spring", stiffness: 300 } 
                }}
                whileTap={{ scale: 0.97 }}
                className="h-full glass rounded-[2.5rem] p-8 glow-border flex flex-col cursor-pointer perspective-1000"
              >
                {/* Floating Icon Animation */}
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}
                >
                  <category.icon className="w-8 h-8 text-foreground" />
                </motion.div>

                <h3 className="font-heading text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
                  {category.description}
                </p>

                {/* Staggered Skills Grid */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  {category.skills.map((skill, sIdx) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (sIdx * 0.05) }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      className="flex items-center gap-2.5 p-3 bg-white/5 rounded-xl border border-white/5 group/skill"
                    >
                      <skill.icon className="w-4 h-4 text-muted-foreground group-hover/skill:text-primary transition-colors" />
                      <span className="font-body text-sm text-foreground/80 group-hover/skill:text-white">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
