import { Countdown } from "@/app/_components/Countdown";
import { useMetadata } from "@/app/_hooks/useMetadata";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import abi from "@/app/abi";

function FinishIso({ storyId }: { storyId: number }) {
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const finish = useCallback(() => {
    writeContract({
      abi,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      functionName: "finishIso",
      args: [BigInt(storyId), 86400n],
    });
  }, [storyId, writeContract]);

  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, []);

  return (
    <section className="rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="font-medium text-xl">ISO</h3>
      <p>The ISO has ended.</p>
      <button
        className="rounded-full border w-full py-2 hover:border-slate-800 transition-all"
        onClick={finish}
      >
        Finish
      </button>
    </section>
  );
}

export function Iso({
  info,
  end,
  storyId,
}: {
  info: NonNullable<ReturnType<typeof useMetadata>>;
  end: Date;
  storyId: number;
}) {
  if (end < new Date()) {
    return <FinishIso storyId={storyId} />;
  }

  return (
    <section className="rounded-xl border p-6 flex flex-col gap-4">
      <h3 className="font-medium text-xl">ISO</h3>
      <span className="text-sm text-slate-400">
        End <Countdown to={end} />
      </span>
      <p>
        This storying is in the Initial Story Offering stage. You can buy tokens
        to vote for the development of the story.
      </p>
      <Link
        href={`https://mint.club/nft/sepolia/${info.symbol}`}
        target="_blank"
        referrerPolicy="no-referrer"
        className="rounded-full border w-full py-2 hover:border-slate-800 transition-all text-center"
      >
        Trade
      </Link>
    </section>
  );
}
