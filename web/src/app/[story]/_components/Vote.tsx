import { Countdown } from "@/app/_components/Countdown";

export function Vote({ end }: { end: Date }) {
  return (
    <section className="rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="font-medium text-xl">Choices</h3>
      <span className="text-sm text-slate-400">
        End <Countdown to={end} />
      </span>
      <label className="rounded-xl border p-4 flex gap-4">
        <input type="radio" name="choices" />
        <p className="flex-1">Ut porttitor, nunc at maximus facilisis</p>
      </label>
      <label className="rounded-xl border p-4 flex gap-4">
        <input type="radio" name="choices" />
        <p className="flex-1">
          Etiam vel nunc vitae purus efficitur lacinia a vitae neque. Nulla id
          arcu justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Aliquam erat volutpat. Aliquam id bibendum nibh. Suspendisse laoreet
          elit nisl, ac vestibulum massa bibendum id. Phasellus convallis, quam
          vel suscipit ullamcorper
        </p>
      </label>
      <div className="flex items-center justify-end gap-4">
        <span className="text-slate-400">6K Votes / 100K</span>
        <button className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all">
          Vote
        </button>
      </div>
    </section>
  );
}
