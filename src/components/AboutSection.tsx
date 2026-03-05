/**
 * ABOUT SECTION - Apple-Inspired Scroll Reveal
 * =============================================
 * Smooth text reveals, parallax elements, minimal design.
 * Enhanced with: staggered entrance, scroll parallax, animated glow,
 * and an interactive 3D tilt profile card.
 */

import { useMemo, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { MapPin, Briefcase, Database, Zap } from "lucide-react";
import profileImage from "../assets/Profile_Photo.jpg";

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven parallax for the hero statement
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const statementY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const statementOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0, 1, 1, 0]
  );

  // Card parallax (subtle)
  const cardY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  // Advanced interactive tilt for the image card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 160,
    damping: 18,
    mass: 0.5,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 160,
    damping: 18,
    mass: 0.5,
  });
  const scale = useSpring(1, { stiffness: 220, damping: 18, mass: 0.4 });

  // A moving highlight that follows the cursor
  const highlightX = useTransform(mx, [-0.5, 0.5], ["25%", "75%"]);
  const highlightY = useTransform(my, [-0.5, 0.5], ["25%", "75%"]);
  const highlight = useMotionTemplate`radial-gradient(420px circle at ${highlightX} ${highlightY}, rgba(59,130,246,0.20), transparent 60%)`;

  const stats = useMemo(
    () => [
      { value: "4.5+", label: "Years Experience", icon: Briefcase },
      { value: "10+", label: "Projects Delivered", icon: Zap },
      { value: "10+", label: "Tools Mastered", icon: Database },
    ],
    []
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const statVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const onCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    mx.set(px - 0.5);
    my.set(py - 0.5);
    scale.set(1.03);
  };

  const onCardLeave = () => {
    mx.set(0);
    my.set(0);
    scale.set(1);
  };

  return (
    <section
      ref={containerRef}
      id="about"
      className="section-padding relative overflow-hidden"
    >
      <div className="container mx-auto max-w-5xl">
        {/* Large statement text */}
        <motion.div style={{ y: statementY, opacity: statementOpacity }} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-3xl md:text-5xl lg:text-6xl font-medium text-foreground leading-tight tracking-tight"
          >
            I'm a <span className="text-gradient-blue">Data Engineer</span> who
            transforms complex datasets into{" "}
            <span className="text-muted-foreground/70">elegant solutions</span>{" "}
            that drive real business value.
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-3 gap-6 md:gap-12 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              className="text-center group"
            >
              <div className="flex justify-center mb-4">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300"
                >
                  <stat.icon className="w-5 h-5 text-primary" />
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-2"
              >
                {stat.value}
              </motion.p>
              <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Two column layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 md:gap-20 items-center"
        >
          {/* Image with glow + tilt */}
          <motion.div
            variants={itemVariants}
            style={{ y: cardY }}
            className="relative order-2 md:order-1"
          >
            {/* Animated outer glow */}
            <motion.div
              aria-hidden
              className="absolute -inset-4 rounded-3xl blur-2xl"
              initial={{ opacity: 0.25 }}
              whileInView={{ opacity: 0.45 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(168,85,247,0.16))",
              }}
            />

            <motion.div
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              style={{
                rotateX,
                rotateY,
                scale,
                transformStyle: "preserve-3d",
              }}
              className="relative aspect-[4/5] glass rounded-3xl overflow-hidden will-change-transform"
            >
              {/* ✅ Your profile photo */}
              <motion.img
                src={profileImage}
                alt="Profile photo"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                initial={{ scale: 1.08, opacity: 0 }}
                whileInView={{ scale: 1.02, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ transform: "translateZ(20px)" }}
              />

              {/* Subtle dark overlay for depth */}
              <div className="absolute inset-0 bg-black/10" />

              {/* Cursor-follow highlight */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                style={{ background: highlight, transform: "translateZ(40px)" }}
              />

              {/* Bottom fade for legibility if you add text later */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div variants={itemVariants} className="order-1 md:order-2">
            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-8"
            >
              About Me
            </motion.h2>

            <motion.div
              variants={containerVariants}
              className="space-y-6 font-body text-muted-foreground leading-relaxed"
            >
              <motion.p variants={itemVariants} className="text-lg">
                I specialize in building scalable data pipelines and turning complex
                datasets into actionable insights. My journey started with a
                curiosity about how businesses make decisions from numbers.
              </motion.p>

              <motion.p variants={itemVariants}>
                When I'm not wrangling data, you'll find me exploring new places,
                experimenting in the kitchen, or capturing moments through my
                camera.
              </motion.p>
            </motion.div>

            {/* Location */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mt-8 text-muted-foreground"
            >
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <MapPin className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="font-body text-sm">Denton, Texas</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;