import { Link } from "react-router-dom";

const TopicCard = ({ topic }) => (
  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">{topic.title}</h3>
    <p className="mt-2 text-sm text-slate-600">{topic.shortDescription}</p>
    <Link
      to={`/topic/${topic.id}`}
      className="mt-3 text-xs font-semibold text-blue-600"
    >
      View full description
    </Link>
    <div className="mt-4 flex flex-wrap gap-3">
      <Link
        to={`/topic/${topic.id}/demo-access`}
        className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
      >
        Free Demo
      </Link>
      <Link
        to={`/checkout/${topic.id}`}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Buy Now
      </Link>
    </div>
  </div>
);

export default TopicCard;
