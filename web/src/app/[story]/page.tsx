"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Countdown } from "../_components/Countdown";

type Stage = "iso" | "propose" | "vote" | "end";

function Story() {
  const params = useParams();
  const stage: Stage = ["iso", "propose", "vote", "end"][
    Number(params.story as string) - 1
  ] as Stage;
  const end = new Date(2024, 2, 25);
  const symbol = "KUSNOW";

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-wrap gap-12 my-8 items-start">
      <div className="rounded-xl border p-8 flex flex-col min-w-60 gap-4">
        <Image
          src="https://cf-ipfs.com/ipfs/QmbkcBktXQJEA4K5Lk1MCU5STZLjDvXPaYrGZT9tMayaBg"
          width={160}
          height={160}
          alt="Image"
          className="rounded-full overflow-hidden object-cover object-center size-12"
        />
        <span className="text-lg font-bold">Love Story</span>
        <span className="text-slate-400">6K Writers</span>
        <button
          className="rounded-full border w-full py-2 hover:border-slate-800 transition-all"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Join
        </button>
        <Link
          href={`https://mint.club/nft/sepolia/${symbol}`}
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
            libero dui. Curabitur ac felis vitae risus pretium luctus id et
            magna. Quisque facilisis mi non diam porta tempus. Cras pharetra
            mauris neque, feugiat facilisis ligula vestibulum accumsan. Nulla
            tellus urna, consectetur eu mattis ut, lobortis vitae diam.
            Phasellus suscipit metus dignissim feugiat laoreet. Donec et nisi
            dolor. Sed eget nisi volutpat, molestie neque sodales, malesuada
            ante. In laoreet bibendum neque, quis vulputate risus varius vitae.
            Phasellus tristique quam erat, a rhoncus nunc iaculis vitae.
          </p>
        </article>
        {stage === "iso" ? (
          <section className="rounded-xl border p-6 flex flex-col gap-4">
            <h3 className="font-medium text-xl">ISO</h3>
            <span className="text-sm text-slate-400">
              End <Countdown to={end} />
            </span>
            <p>
              This storying is in the Initial Story Offering stage. You can buy
              tokens to vote for the development of the story.
            </p>
            <Link
              href={`https://mint.club/nft/sepolia/${symbol}`}
              target="_blank"
              referrerPolicy="no-referrer"
              className="rounded-full border w-full py-2 hover:border-slate-800 transition-all text-center"
            >
              Trade
            </Link>
          </section>
        ) : null}
        {stage === "vote" ? (
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
                Etiam vel nunc vitae purus efficitur lacinia a vitae neque.
                Nulla id arcu justo. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Aliquam erat volutpat. Aliquam id bibendum
                nibh. Suspendisse laoreet elit nisl, ac vestibulum massa
                bibendum id. Phasellus convallis, quam vel suscipit ullamcorper
              </p>
            </label>
            <div className="flex items-center justify-end gap-4">
              <span className="text-slate-400">6K Votes / 100K</span>
              <button className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all">
                Vote
              </button>
            </div>
          </section>
        ) : null}
        {stage === "propose" ? (
          <section className="rounded-xl border p-6 flex flex-col gap-4">
            <h3 className="font-medium text-xl">Proposals</h3>
            <span className="text-sm text-slate-400">
              End <Countdown to={end} />
            </span>
            <span className="italic text-slate-400 text-center">
              No proposal
            </span>
            <div className="rounded-xl border p-4 flex flex-col gap-4">
              <span className="font-medium">Proposal #1</span>
              <p className="flex-1">
                Etiam vel nunc vitae purus efficitur lacinia a vitae neque.
                Nulla id arcu justo. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Aliquam erat volutpat. Aliquam id bibendum
                nibh. Suspendisse laoreet elit nisl, ac vestibulum massa
                bibendum id. Phasellus convallis, quam vel suscipit ullamcorper
              </p>
            </div>
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
        ) : null}
      </div>
    </div>
  );
}

export default Story;
