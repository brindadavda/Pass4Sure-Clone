import { useParams } from "react-router-dom";

const CheckoutPage = () => {
  const { topicId } = useParams();
  const topicLabel = topicId ? topicId : "this topic";

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Purchase coming soon</h2>
        <p className="mt-2 text-sm text-slate-600">
          We are working on payments. Topic purchase for{" "}
          <span className="font-semibold text-slate-900">{topicLabel}</span> will be available
          shortly.
        </p>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          Full access will unlock the complete question bank and analytics for this topic.
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
