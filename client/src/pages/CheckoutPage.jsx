const CheckoutPage = () => (
  <section className="mx-auto max-w-5xl px-6 py-12">
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Secure checkout</h2>
        <p className="mt-2 text-sm text-slate-600">
          Complete your payment to unlock full access immediately.
        </p>
        <form className="mt-6 grid gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Cardholder name</label>
            <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Card number</label>
            <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Expiry</label>
              <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">CVV</label>
              <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <button className="mt-4 rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
            Pay & unlock access
          </button>
        </form>
      </div>
      <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="text-lg font-semibold text-slate-900">Order summary</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>NISM Series V-A (30 days)</span>
            <span className="font-semibold text-slate-900">₹1299</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Taxes</span>
            <span>₹0</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between font-semibold text-slate-900">
            <span>Total</span>
            <span>₹1299</span>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-white p-4 text-xs text-slate-500">
          Payments protected with SSL encryption. Refunds are processed within 5 working days.
        </div>
      </aside>
    </div>
  </section>
);

export default CheckoutPage;
