import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DemoAccessPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [generatedCode, setGeneratedCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");

  const maskedCode = useMemo(() => generatedCode || "DEMO1234", [generatedCode]);

  const handleGenerate = () => {
    const code = `DEMO${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setGeneratedCode(code);
    setInputCode("");
    setError("");
  };

  const handleStart = () => {
    if (!generatedCode) {
      setError("Please generate a demo code first.");
      return;
    }
    if (inputCode.trim().toUpperCase() !== generatedCode) {
      setError("Access code does not match. Please try again.");
      return;
    }
    navigate(`/topic/${topicId}/demo-exam`, { state: { accessCode: generatedCode } });
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Demo Access</h2>
        <p className="mt-2 text-sm text-slate-600">
          Generate a demo code and enter it below to start the demo exam.
        </p>

        <div className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Enter Access Code</label>
            <input
              value={inputCode}
              onChange={(event) => setInputCode(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="DEMO1234"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="w-fit rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
          >
            Get Demo Code
          </button>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            Your Demo Code: <span className="font-semibold">{maskedCode}</span>
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleStart}
            className="mt-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Start Demo Exam
          </button>
        </div>
      </div>
    </section>
  );
};

export default DemoAccessPage;
