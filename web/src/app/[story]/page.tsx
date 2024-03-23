"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Countdown } from "../_components/Countdown";
import { useMetadata } from "../_hooks/useMetadata";
import { useLocalStorage } from "usehooks-ts";
import { useReadContract } from "wagmi";
import abi from "@/app/abi";
import { Iso } from "./_components/Iso";
import { Vote } from "./_components/Vote";
import { Propose } from "./_components/Propose";

enum Phase {
  Iso,
  Propose,
  Vote,
  Execute,
  Finish,
}

function Story() {
  const [stories, setStories] = useLocalStorage<number[]>("stories", []);
  const params = useParams();
  const storyId = Number(params.story as string);
  const info = useMetadata(storyId);
  const { data: story } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "story",
    args: [BigInt(storyId)],
  });

  const { data: phase_ } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "storyIdToPhase",
    args: [BigInt(storyId)],
  });

  const { data: end_ } = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "storyIdToEndTime",
    args: [BigInt(storyId)],
  });

  if (!info || phase_ === undefined || end_ === undefined) {
    return (
      <div className="w-full max-w-screen-lg mx-auto flex flex-wrap gap-12 my-8 items-start">
        <span>Loading...</span>
      </div>
    );
  }

  const phase: Phase = phase_;
  const end = new Date(Number(end_) * 1000);

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-wrap gap-12 my-8 items-start">
      <div className="rounded-xl border p-8 flex flex-col min-w-60 gap-4">
        <Image
          src={info.image}
          width={160}
          height={160}
          alt={info.name}
          className="rounded-full overflow-hidden object-cover object-center size-12"
        />
        <span className="text-lg font-bold">{info.name}</span>
        <span className="text-slate-400">
          {Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(info.holders || 0) + " Writers"}
        </span>
        <button
          className="rounded-full border w-full py-2 hover:border-slate-800 transition-all"
          onClick={(e) => {
            setStories((stories) => {
              if (stories.includes(storyId)) {
                return stories.filter((s) => s !== storyId);
              }
              return stories.concat(storyId);
            });
          }}
        >
          {stories.includes(storyId) ? "Leave" : "Join"}
        </button>
        <Link
          href={`https://mint.club/nft/sepolia/${info.symbol}`}
          target="_blank"
          referrerPolicy="no-referrer"
          className="rounded-full border w-full py-2 hover:border-slate-800 transition-all text-center"
        >
          Trade
        </Link>
      </div>
      <div className="flex-1 min-w-60 flex flex-col gap-6">
        <h2 className="font-bold text-3xl">Story</h2>
        <article className="flex flex-col gap-4">
          <p>{info.description}</p>
          {story?.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </article>
        {phase === Phase.Iso ? (
          <Iso info={info} end={end} storyId={storyId} />
        ) : null}
        {phase === Phase.Propose ? <Propose end={end} /> : null}
        {phase === Phase.Vote ? <Vote end={end} /> : null}
        {phase === Phase.Execute ? <Vote end={end} /> : null}
      </div>
    </div>
  );
}

export default Story;
