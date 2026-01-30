import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Practice question bank",
    description: "Thousands of exam-style MCQs with explanations and smart hints."
  },
  {
    title: "Timed mock simulations",
    description: "Mirror the real exam with timers, scoring, and review mode."
  },
  {
    title: "Progress analytics",
    description: "Track accuracy, speed, and topic mastery across all exams."
  }
];

const testimonials = [
  {
    name: "Ananya Kapoor",
    role: "NISM Series VIII",
    quote: "The timed simulations felt like the real exam. I cleared in one attempt."
  },
  {
    name: "Rahul Mehta",
    role: "NCFM Equity",
    quote: "Great explanations and an intuitive dashboard helped me focus on weak areas."
  },
  {
    name: "Sneha Iyer",
    role: "BSE Derivatives",
    quote: "Loved the revision mode. It surfaced every mistake and saved hours."
  }
];

const LandingPage = () => (
  <div>
    <section className="bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Pass4Sure Certification Hub
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
            Ace certification exams with smart practice, analytics, and mock tests.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Prepare for NISM, NCFM, BSE, NSE, and IT certifications with curated question
            banks, instant explanations, and real-exam simulation modes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/exams"
              className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
            >
              Explore exams
            </Link>
            <Link
              to="/practice"
              className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
            >
              Try free demo
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
            <span>SSL-secured payments</span>
            <span>Instant access after purchase</span>
            <span>Validity-based subscriptions</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Today&apos;s focus</p>
                <p className="text-lg font-semibold text-slate-900">NISM Series V-A</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                15 days left
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-xs text-slate-500">Accuracy</p>
                <p className="text-2xl font-semibold text-slate-900">78%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Mock tests</p>
                <p className="text-2xl font-semibold text-slate-900">12</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Weak topics</p>
                <p className="text-2xl font-semibold text-slate-900">4</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4">
                <p className="text-xs text-slate-500">Study plan</p>
                <p className="text-2xl font-semibold text-slate-900">AI-ready</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Upcoming tasks</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li>Timed mock test: 90 minutes</li>
                <li>Revision mode: Derivatives module</li>
                <li>Download progress PDF</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold">Trusted by exam aspirants</h2>
        <p className="mt-3 text-slate-300">
          Join thousands of learners using Pass4Sure&apos;s smart learning tools to pass on their
          first attempt.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl bg-slate-800 p-6">
              <p className="text-sm text-slate-200">“{testimonial.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-white">{testimonial.name}</p>
              <p className="text-xs text-slate-400">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default LandingPage;
