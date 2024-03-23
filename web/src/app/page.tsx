"use client";

import Image from "next/image";
import Link from "next/link";

function App() {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-8 mt-8">
      <div className="flex justify-between items-center">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="w-80 rounded-full border text-xl px-4 py-2"
            placeholder="Search"
          />
        </form>
        <span className="text-slate-400">6K Stoires</span>
      </div>
      <div className="flex flex-wrap justify-between gap-8">
        <Link href="/1">
          <div className="rounded-xl border hover:border-slate-800 p-8 flex flex-col items-center w-60 gap-4 transition-all">
            <Image
              src="https://scarlet-famous-crayfish-103.mypinata.cloud/ipfs/QmbkcBktXQJEA4K5Lk1MCU5STZLjDvXPaYrGZT9tMayaBg"
              width={160}
              height={160}
              alt="Image"
              className="rounded-full overflow-hidden object-cover object-center size-24"
            />
            <span className="text-lg font-bold">Love Story</span>
            <span className="text-slate-400">6K Writers</span>
            <button
              className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Join
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default App;
