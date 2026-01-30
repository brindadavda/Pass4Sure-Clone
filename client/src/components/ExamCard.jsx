import { Link } from "react-router-dom";

const ExamCard = ({ exam }) => (
  <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-xs uppercase tracking-wide text-blue-600">{exam.category}</p>
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        {exam.validity}
      </span>
    </div>
    <h3 className="mt-3 text-lg font-semibold text-slate-900">{exam.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{exam.description}</p>
    <div className="mt-4 flex items-center justify-between">
      <p className="text-lg font-semibold text-slate-900">₹{exam.price}</p>
      <Link
        to="/checkout"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Buy now
      </Link>
    </div>
  </div>
);

export default ExamCard;
