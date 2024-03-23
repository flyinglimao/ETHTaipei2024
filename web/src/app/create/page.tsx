"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

function Step({ state, text }: { state: number; text: string }) {
  if (state < 0) {
    return (
      <li className="relative before:content-[''] before:absolute before:-top-6 before:left-3 before:block before:border-r before:h-6 before:border-black first:before:border-r-0">
        <div className="flex gap-4">
          <span className="grid place-content-center size-6 bg-black rounded-full text-white text-xs">
            ✔︎
          </span>
          <span>{text}</span>
        </div>
      </li>
    );
  }

  if (state === 0) {
    return (
      <li className="relative before:content-[''] before:absolute before:-top-6 before:left-3 before:block before:border-r before:h-6 before:border-black first:before:border-r-0">
        <div className="flex gap-4">
          <span className="grid place-content-center size-6 border border-black rounded-full text-black text-xs">
            •
          </span>
          <span>{text}</span>
        </div>
      </li>
    );
  }

  return (
    <li className="relative before:content-[''] before:absolute before:-top-6 before:left-3 before:block before:border-r before:h-6 first:before:border-r-0">
      <div className="flex gap-4">
        <span className="grid place-content-center size-6 border rounded-full text-xs"></span>
        <span className="text-slate-400">{text}</span>
      </div>
    </li>
  );
}

function Start({ setStep }: { setStep: (step: number) => void }) {
  return (
    <>
      <h2 className="font-bold text-3xl">Create a new Story</h2>
      <p>
        Parallel Story Six is a platform for on-chain interactive story. You can
        create a new story and invite others to join and write together.
      </p>
      <button
        className="rounded-full border w-full py-2 hover:border-slate-800 transition-all"
        onClick={() => setStep(1)}
      >
        Start
      </button>
    </>
  );
}

function StoryInformation({ setStep }: { setStep: (step: number) => void }) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>("/logo.svg");
  const updateAvatar = useCallback(() => {
    const file = avatarInputRef.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <>
      <h2 className="font-bold text-3xl">Story Information</h2>
      <div className="rounded-xl border flex flex-col gap-4 p-8">
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
        <div>
          <label>Avatar</label>
          <div className="flex gap-8 items-center">
            <Image
              src={avatar}
              width={160}
              height={160}
              className="size-24 inline-block rounded-full overflow-hidden object-cover object-center border shadow"
              alt="Avatar"
            />
            <input
              type="file"
              name="avatar"
              className="hidden"
              ref={avatarInputRef}
              onChange={updateAvatar}
            />
            <button
              className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
              onClick={() => {
                avatarInputRef.current?.click();
              }}
            >
              Change
            </button>
          </div>
        </div>
        <div>
          <label>Worldbuilding</label>
          <textarea
            name="worldbuilding"
            className="block w-full resize-y px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
          onClick={() => setStep(0)}
        >
          Back
        </button>
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all bg-slate-100 hover:bg-slate-200"
          onClick={() => setStep(2)}
        >
          Next
        </button>
      </div>
    </>
  );
}

function IsoSetting({ setStep }: { setStep: (step: number) => void }) {
  return (
    <>
      <h2 className="font-bold text-3xl">ISO Setting</h2>
      <div className="rounded-xl border flex flex-col gap-4 p-8">
        <div>
          <label>Token Symbol</label>
          <input
            type="text"
            name="symbol"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
        <div>
          <label>Total Supply</label>
          <input
            type="number"
            name="supply"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
        <div>
          <label>Min Price (USDC)</label>
          <input
            type="number"
            name="minPrice"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
        <div>
          <label>Max Price (USDC)</label>
          <input
            type="number"
            name="maxPrice"
            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all bg-slate-100 hover:bg-slate-200"
          onClick={() => setStep(3)}
        >
          Deploy
        </button>
      </div>
    </>
  );
}

function Finish({ story }: { story: number }) {
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

function Create() {
  const [step, setStep] = useState(0);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-screen-lg mx-auto flex flex-wrap gap-12 my-8 items-start"
    >
      <nav className="min-w-60 pt-4 flex ">
        <ol className="flex flex-col gap-6">
          <Step state={0 - step} text="Getting Started" />
          <Step state={1 - step} text="Story Information" />
          <Step state={2 - step} text="ISO Setting" />
          <Step state={3 - step} text="Finish" />
        </ol>
      </nav>
      <div
        className={clsx(
          step === 0 ? "flex" : "hidden",
          "flex-1 flex flex-col gap-4"
        )}
      >
        <Start setStep={setStep} />
      </div>
      <div
        className={clsx(
          step === 1 ? "flex" : "hidden",
          "flex-1 flex flex-col gap-4"
        )}
      >
        <StoryInformation setStep={setStep} />
      </div>
      <div
        className={clsx(
          step === 2 ? "flex" : "hidden",
          "flex-1 flex flex-col gap-4"
        )}
      >
        <IsoSetting setStep={setStep} />
      </div>
      <div
        className={clsx(
          step === 3 ? "flex" : "hidden",
          "flex-1 flex flex-col gap-4"
        )}
      >
        <Finish story={1} />
      </div>
    </form>
  );
}

export default Create;
