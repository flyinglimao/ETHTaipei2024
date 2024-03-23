import { Countdown } from "@/app/_components/Countdown";

export function Execute({ end }: { end: Date }) {
  return (
    <section className="rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="font-medium text-xl">Executing</h3>
    </section>
  );
}
