import { Countdown } from "@/app/_components/Countdown";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "@/app/abi";
import { useCallback, useEffect, useState } from "react";
import { zeroAddress } from "viem";

export function Vote({ storyId, end }: { storyId: number; end: Date }) {
  const account = useAccount();
  const { data, isLoading } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "currentProposes",
    args: [BigInt(storyId)],
  });
  const { data: voted } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "userVoted",
    args: [
      BigInt(storyId),
      data?.[0] || BigInt(0),
      account?.address || zeroAddress,
    ],
  });
  const { writeContract } = useWriteContract();
  const [choice, setChoice] = useState<number | undefined>();
  const vote = useCallback(() => {
    if (choice === undefined) return;
    writeContract({
      abi,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "vote",
      args: [BigInt(storyId), BigInt(choice)],
    });
  }, [choice, storyId, writeContract]);

  if (isLoading || !data?.length) {
    return (
      <section className="rounded-xl border p-6 flex flex-col gap-4">
        <h3 className="font-medium text-xl">Choices</h3>
        <span>Loading...</span>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="font-medium text-xl">Choices</h3>
      <span className="text-sm text-slate-400">
        End <Countdown to={end} />
      </span>
      {data[1].length === 0 ? (
        <span className="italic text-slate-400 text-center">No proposal</span>
      ) : (
        data[1].map((proposal: string, index: number) => (
          <label
            className="rounded-xl border p-4 flex gap-4"
            key={`choice-${index}`}
          >
            <input
              type="radio"
              name="choices"
              checked={choice === index}
              onChange={(e) => e.target.checked && setChoice(index)}
            />
            <p className="flex-1">{proposal}</p>
          </label>
        ))
      )}
      <div className="flex items-center justify-end gap-4">
        {/* <span className="text-slate-400">6K Votes / 100K</span> */}
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
          disabled={voted}
          onClick={vote}
        >
          {voted ? "Voted" : "Vote"}
        </button>
      </div>
    </section>
  );
}
