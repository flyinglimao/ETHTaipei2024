"use client";

import abi from "@/app/abi";
import Link from "next/link";
import { useReadContract } from "wagmi";
import { HomeEntry } from "./_components/HomeEntry";

function App() {
  const totalStoryResult = useReadContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "totalStory",
  });

  if (totalStoryResult.isFetching) {
    return (
      <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-8 my-8">
        <span className="itlatic text-slate-400">Loading...</span>
      </div>
    );
  }

  if (totalStoryResult.error) {
    return (
      <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-8 my-8">
        <span className="itlatic text-slate-400">
          Error: {totalStoryResult.error.shortMessage}
        </span>
      </div>
    );
  }

  const totalStory = Number(totalStoryResult.data);

  if (!totalStory) {
    return (
      <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-8 my-8">
        <span className="itlatic text-slate-400">
          No story, why not{" "}
          <Link href="/create" className="underline">
            create one
          </Link>
          ?
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-8 my-8">
      <div className="flex justify-between items-center">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="w-80 rounded-full border text-xl px-4 py-2"
            placeholder="Search"
          />
        </form>
        <span className="text-slate-400">
          {Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(Number(totalStoryResult.data))}{" "}
          Stoires
        </span>
      </div>
      <div className="flex flex-wrap justify-between gap-8 items-stretch">
        {Array(totalStory)
          .fill(0)
          .map((_, i) => (
            <HomeEntry key={`story-${i}`} storyId={i} />
          ))}
      </div>
    </div>
  );
}

export default App;
