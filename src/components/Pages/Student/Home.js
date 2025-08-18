import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../../../assets/svgs/image-3.jpg"; 

const Home = () => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100">
      {/* HERO SECTION WITH BACKGROUND */}
      <section
        className="relative flex items-center justify-center px-8 pt-28 pb-32 min-h-[70vh] overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundPositionY: "-230px",
          minHeight: "550px",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        <div className="relative flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl gap-12">
          <div className="flex-1 text-center md:text-left text-white">
            <h1 className="text-4xl md:text-4xl font-bold mb-6">
              Master English with Confidence
            </h1>
            <p className="text-lg mb-6 max-w-md mx-auto md:mx-0">
              Join interactive lessons with real-time speech feedback,
              progress tracking, and exercises designed to help you speak
              fluently.
            </p>

            <ul className="space-y-2 mb-8 text-base text-gray-200">
              <li>✔ Real-time speech feedback</li>
              <li>✔ Interactive exercises & practice tests</li>
            </ul>

            {/* Buttons */}
            <div className="flex justify-center md:justify-start gap-4">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE SECTIONS  */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
            Why Learn With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
              <img
                src="https://img.icons8.com/color/96/learning.png"
                alt="Fun learning"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">
                Free, Fun & Effective
              </h3>
              <p className="text-gray-600">
                Learn English through interactive exercises, quizzes, and real-world practice.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
              <img
                src="https://img.icons8.com/color/96/goal.png"
                alt="Motivation"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">Stay Motivated</h3>
              <p className="text-gray-600">
                Track your progress with streaks, achievements, and personalized goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition">
              <img
                src="https://img.icons8.com/color/96/artificial-intelligence.png"
                alt="Personalized Learning"
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3">Personalized Learning</h3>
              <p className="text-gray-600">
                AI-powered lessons adapt to your level and learning speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*  CTA SECTION  */}
      <section className="py-20 bg-gray-100 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl text-black md:text-4xl font-semibold mb-6">
            Ready to start your English journey?
          </h2>
          <p className="text-lg mb-8 text-black">
            Join thousands of learners improving their English skills every day.
          </p>
          <Link
            to="/register"
            className="px-8 py-4 bg-gray-200 text-black font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
