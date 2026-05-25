import { Github, Instagram, Linkedin, Quote, Twitter } from "lucide-react";
import { motion } from "motion/react";

const timeline = [
  {
    year: "2020",
    title: "The Idea",
    desc: "Conceived Shaan Roadlines to solve India's fragmented travel booking market",
  },
  {
    year: "2021",
    title: "MVP Launch",
    desc: "Launched beta with bus booking for 5 cities",
  },
  {
    year: "2022",
    title: "10K Users",
    desc: "Crossed 10,000 users and expanded to trains",
  },
  {
    year: "2023",
    title: "Series A",
    desc: "Raised Series A funding to scale platform",
  },
  {
    year: "2024",
    title: "100K Bookings",
    desc: "Reached 100,000 bookings milestone",
  },
  {
    year: "2025",
    title: "Shaan Roadlines 2.0",
    desc: "Launched flights, hotels, and AI travel assistant",
  },
];

const achievements = [
  { value: "500K+", label: "Happy Travelers" },
  { value: "50+", label: "Cities Covered" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "100%", label: "Secure Payments" },
];

export default function AboutFounderPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative min-h-[40vh] bg-gradient-to-r from-slate-900 to-teal-700 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 border-4 border-dashed border-white/20 m-8 rounded-2xl flex items-center justify-center">
          <p className="text-white/50 text-lg font-mono">
            [ BANNER IMAGE HERE — Replace with actual banner image ]
          </p>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-4xl md:text-5xl font-bold text-white text-center px-4"
        >
          The Vision Behind Shaan Roadlines
        </motion.h1>
      </div>

      {/* Founder section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img
              src="/src/pages/founder.png"
              alt="Shaan, Founder of Shaan Roadlines"
              className="w-64 h-64 rounded-2xl object-cover object-top"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-2">Shaan</h2>
            <p className="text-teal-500 font-semibold mb-4">
              Founder & CEO, Shaan Roadlines
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              A passionate entrepreneur with a vision to transform how India
              travels. With deep roots in technology and a love for exploration,
              they built Shaan Roadlines to solve real pain points in travel
              booking — making it seamless, affordable, and delightful for every
              traveler.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Twitter size={18} />, href: "#", label: "twitter" },
                { icon: <Linkedin size={18} />, href: "#", label: "linkedin" },
                {
                  icon: <Instagram size={18} />,
                  href: "#",
                  label: "instagram",
                },
                { icon: <Github size={18} />, href: "#", label: "github" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-teal-500/20 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-teal-500/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl"
          >
            <Quote className="mx-auto text-teal-400 mb-4" size={40} />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-xl text-muted-foreground leading-relaxed">
              To revolutionize travel in India by making it affordable,
              seamless, and joyful for every traveler — from the mountains to
              the coast.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-10">Our Mission</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {["Accessible Travel", "Seamless Booking", "Traveler First"].map(
            (t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl text-center"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500/20 mx-auto mb-4 flex items-center justify-center text-teal-500 font-bold">
                  {i + 1}
                </div>
                <h4 className="font-bold mb-2">{t}</h4>
                <p className="text-muted-foreground text-sm">
                  {
                    [
                      "Making premium travel accessible to everyone regardless of budget",
                      "One platform for buses, trains, flights, and hotels",
                      "Every decision starts with what's best for the traveler",
                    ][i]
                  }
                </p>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-teal-500/5 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Startup Journey
          </h3>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-teal-400/30 -translate-x-1/2 hidden md:block" />
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
              >
                <div
                  className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-8" : "md:pl-8"}`}
                >
                  <div className="glass-card p-4 rounded-xl inline-block">
                    <span className="text-teal-500 font-bold text-lg">
                      {t.year}
                    </span>
                    <h4 className="font-bold mt-1">{t.title}</h4>
                    <p className="text-muted-foreground text-sm">{t.desc}</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-teal-400 border-4 border-background z-10 mx-4 shrink-0" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-10">Milestones</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl text-center"
            >
              <p className="text-3xl font-bold text-teal-500">{a.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{a.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inspirational Quote */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Quote className="mx-auto mb-4 text-teal-400" size={48} />
          <blockquote className="text-2xl font-light leading-relaxed mb-6">
            "Travel is not just about destinations. It's about the journey, the
            people, and the stories that make life beautiful."
          </blockquote>
          <cite className="text-teal-400">— Shaan, Founder of Shaan Roadlines</cite>
        </div>
      </section>
    </div>
  );
}