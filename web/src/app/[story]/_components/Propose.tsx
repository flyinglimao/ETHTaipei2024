import { Countdown } from "@/app/_components/Countdown";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "@/app/abi";
import { useCallback, useEffect, useState } from "react";

function useEndPropose(storyId: number) {
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const finish = useCallback(() => {
    writeContract({
      abi,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "endPropose",
      args: [BigInt(storyId)],
    });
  }, [storyId, writeContract]);

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, []);

  return finish;
}

export function Propose({ storyId, end }: { storyId: number; end: Date }) {
  const { data, isLoading, refetch } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "currentProposes",
    args: [BigInt(storyId)],
  });
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });
  const [content, setContent] = useState("");
  const endPropose = useEndPropose(storyId);

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess]);

  const submitProposal = useCallback(() => {
    writeContract({
      abi,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "propose",
      args: [BigInt(storyId), content],
    });
  }, [content]);

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
        data[1].map((proposal: string, index: number) => (
          <div
            className="rounded-xl border p-4 flex flex-col gap-4"
            key={`proposal-${index}`}
          >
            <span className="font-medium">Proposal #{index + 1}</span>
            <p className="flex-1">{proposal}</p>
          </div>
        ))
      )}
      <div className="border-b my-4"></div>
      {end > new Date() ? (
        <>
          <textarea
            placeholder="Propose some text to continue the story..."
            className="rounded-lg border resize-y p-4 min-h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <button
              className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
              onClick={submitProposal}
            >
              Propose
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-end gap-4">
          <button
            className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
            onClick={endPropose}
          >
            End Propose
          </button>
        </div>
      )}
    </section>
  );
}
