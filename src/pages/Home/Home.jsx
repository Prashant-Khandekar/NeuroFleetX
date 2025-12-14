import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBus,
  FaMapMarkedAlt,
  FaUserShield,
  FaTachometerAlt,
  FaRoute,
  FaTicketAlt,
  FaUserFriends,
  FaMoon,
  FaSun,
} from "react-icons/fa";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const bgMain = darkMode ? "bg-[#1c1c1c] text-[#e5e5e5]" : "bg-[#c7c7c7] text-[#1b1b1b]";
  const bgSidebar = darkMode ? "bg-[#2a2a2a]" : "bg-[#bfbfbf]";
  const bgCard = darkMode ? "bg-[#2f2f2f] hover:bg-[#3a3a3a]" : "bg-[#b3b3b3] hover:bg-[#a6a6a6]";
  const borderCol = darkMode ? "border-[#3d3d3d]" : "border-[#9e9e9e]";

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${bgMain}`}>

      {/* SIDEBAR */}
      <aside className={`w-64 p-6 flex flex-col border-r ${bgSidebar} ${borderCol}`}>
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2">
          <FaBus /> NeuroFleetX
        </h1>

        <nav className="flex flex-col gap-3 font-medium">
          <Link to="/login" className="p-3 rounded-lg hover:bg-black/10 transition">
            Login
          </Link>
          <Link to="/register" className="p-3 rounded-lg hover:bg-black/10 transition">
            Register
          </Link>
        </nav>

        {/* DARK MODE TOGGLE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-auto flex items-center gap-3 p-3 rounded-lg border hover:bg-black/10 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-10 overflow-hidden">

        {/* FLOATING BUS ICONS */}
        <motion.div
          className="absolute right-20 top-20 text-6xl opacity-10"
          animate={{ y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        >
          <FaBus />
        </motion.div>

        <motion.div
          className="absolute right-40 bottom-40 text-5xl opacity-10"
          animate={{ y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <FaBus />
        </motion.div>

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-extrabold mb-4">
            Smart Fleet. Real-Time Control.
          </h2>
          <p className="text-lg max-w-2xl opacity-80">
            NeuroFleetX is a modern bus management system with live tracking,
            route visualization and role-based dashboards.
          </p>

          <div className="flex gap-4 mt-6">
            <Link to="/login" className="px-6 py-3 rounded-lg bg-black/20 hover:bg-black/30 transition">
              Get Started
            </Link>
            <Link to="/register" className="px-6 py-3 rounded-lg border hover:bg-black/10 transition">
              Create Account
            </Link>
          </div>
        </motion.section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <FaMapMarkedAlt />, title: "Live Tracking", desc: "Track buses in real time with GPS." },
            { icon: <FaRoute />, title: "Smart Routes", desc: "Optimized route visualization." },
            { icon: <FaTicketAlt />, title: "Ticket Booking", desc: "Passenger booking system." },
            { icon: <FaUserFriends />, title: "Driver Panel", desc: "Driver live navigation." },
            { icon: <FaUserShield />, title: "Admin Control", desc: "Manage fleet & users." },
            { icon: <FaTachometerAlt />, title: "Analytics", desc: "Fleet performance insights." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl shadow border transition ${bgCard} ${borderCol}`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="opacity-80">{f.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`mt-20 p-10 rounded-xl shadow border text-center ${bgCard} ${borderCol}`}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Use NeuroFleetX?</h2>
          <p className="mb-6 opacity-80">
            Experience next-gen fleet management today.
          </p>

          <Link to="/register" className="px-8 py-3 rounded-lg bg-black/20 hover:bg-black/30 transition">
            Create Account
          </Link>
        </motion.section>

      </main>
    </div>
  );
}
