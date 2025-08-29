"use client";

import { motion } from "framer-motion";
import { Book } from "lucide-react";

const courses = [
  { name: "Forex Basics" },
  { name: "Technical Analysis" },
  { name: "Risk Management" },
  { name: "Advanced Strategies" },
];

export default function CoursesSection() {
  return (
    <section id="courses" className="w-full py-12 px-4 bg-background text-foreground">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-[color:var(--primary)]">
          Courses
        </h2>
        <p className="mb-8 text-base md:text-lg">
          Unlock structured learning and take your trading skills to the next level
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <motion.div
              key={course.name}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative flex flex-col items-center justify-center bg-card p-4 rounded-lg shadow-md border border-border cursor-pointer"
            >
              {/* Book Icon */}
              <Book className="w-12 h-12 text-[color:var(--primary)] mb-3" />

              {/* Course Name */}
              <h3 className="text-lg font-semibold mb-1">{course.name}</h3>

              {/* Locked Overlay */}
              <div className="absolute inset-0 bg-background/90 backdrop-blur-[20px] flex flex-col items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-lg font-bold text-[color:var(--primary)] mb-2">🔒 Locked</span>
                <button
                  className="bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-3 py-2 rounded hover:brightness-90 transition text-sm"
                  onClick={() => {
                    alert("Please sign up to enroll!");
                  }}
                >
                  Enroll
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
