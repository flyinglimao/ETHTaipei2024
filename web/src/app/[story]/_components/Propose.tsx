import { Countdown } from "@/app/_components/Countdown";
import { useReadContract } from "wagmi";
import abi from "@/app/abi";

export function Propose({ storyId, end }: { storyId: number; end: Date }) {
  const { data, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "currentProposes",
    args: [BigInt(storyId)],
  });

  if (isLoading || !data?.length) {
    return (
      <section className="rounded-xl border p-6 flex flex-col gap-4">
        <h3 className="font-medium text-xl">Proposals</h3>
        <span>Loading...</span>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="font-medium text-xl">Proposals</h3>
      <span className="text-sm text-slate-400">
        End <Countdown to={end} />
      </span>
      {data[1].length === 0 ? (
        <span className="italic text-slate-400 text-center">No proposal</span>
      ) : (
        <div className="rounded-xl border p-4 flex flex-col gap-4">
          <span className="font-medium">Proposal #1</span>
          <p className="flex-1">
            Etiam vel nunc vitae purus efficitur lacinia a vitae neque. Nulla id
            arcu justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aliquam erat volutpat. Aliquam id bibendum nibh. Suspendisse laoreet
            elit nisl, ac vestibulum massa bibendum id. Phasellus convallis,
            quam vel suscipit ullamcorper
          </p>
        </div>
      )}
      <div className="border-b my-4"></div>
      <textarea
        placeholder="Propose some text to continue the story..."
        className="rounded-lg border resize-y p-4 min-h-32"
      ></textarea>
      <div className="flex justify-end gap-4">
        <button className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all">
          Propose
        </button>
      </div>
    </section>
  );
}
