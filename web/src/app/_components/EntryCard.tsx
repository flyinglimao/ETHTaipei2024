"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { getHolders } from "../_actions/getHolders";
import abi from "@/app/abi";
import { useReadContract } from "wagmi";
import { mintclub } from "mint.club-v2-sdk";
import { getMetadata } from "../_actions/getMetadata";

export function EntryCard({ storyId }: { storyId: number }) {
  const [info, setInfo] = useState<Awaited<
    ReturnType<typeof getMetadata>
  > | null>(null);
  useEffect(() => {
    getMetadata(storyId).then(setInfo);
  }, [storyId]);

  return (
    <Link href={`/${storyId}`}>
      {!info ? (
        <div className="rounded-xl border hover:border-slate-800 p-8 flex flex-col items-center w-56 gap-4 transition-all justify-center h-full">
          <span>Loading...</span>
        </div>
      ) : (
        <div className="rounded-xl border hover:border-slate-800 p-8 flex flex-col items-center w-56 gap-4 transition-all">
          <Image
            src={info.image}
            width={160}
            height={160}
            alt={info.name}
            className="rounded-full overflow-hidden object-cover object-center size-24"
          />
          <span className="text-lg font-bold">{info.name}</span>
          <span className="text-slate-400">
            {Intl.NumberFormat("en-US", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(info.holders || 0) + " Writers"}
          </span>
          <button
            className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Join
          </button>
        </div>
      )}
    </Link>
  );
}
