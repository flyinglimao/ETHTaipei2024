"use client";
import Link from "next/link";

export function Finish({ story }: { story: number }) {
  return (
    <>
      <h2 className="font-bold text-3xl">Finish</h2>
      <p>Your story has been created successfully!</p>
      <Link
        href={`/${story}`}
        className="rounded-full border w-full py-2 hover:border-slate-800 transition-all text-center"
      >
        View Story
      </Link>
    </>
  );
}
