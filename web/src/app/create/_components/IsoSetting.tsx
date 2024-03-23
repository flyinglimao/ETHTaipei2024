"use client";
export function IsoSetting({ setStep }: { setStep: (step: number) => void }) {
  return (
    <>
      <h2 className="font-bold text-3xl">ISO Setting</h2>
      <div className="rounded-xl border flex flex-col gap-4 p-8">
        <div>
          <label>Token Symbol</label>
          <input
            type="text"
            name="symbol"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
        <div>
          <label>Total Supply</label>
          <input
            type="number"
            name="supply"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
        <div>
          <label>Min Price (USDC)</label>
          <input
            type="number"
            name="minPrice"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
        <div>
          <label>Max Price (USDC)</label>
          <input
            type="number"
            name="maxPrice"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
          onClick={() => setStep(1)}
          type="button"
        >
          Back
        </button>
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all bg-slate-100 hover:bg-slate-200"
          type="submit"
        >
          Upload
        </button>
      </div>
    </>
  );
}
