"use client";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

export function StoryInformation({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
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
              type="button"
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
          type="button"
        >
          Back
        </button>
        <button
          className="rounded-full border w-32 py-2 hover:border-slate-800 transition-all bg-slate-100 hover:bg-slate-200"
          onClick={() => setStep(2)}
          type="button"
        >
          Next
        </button>
      </div>
    </>
  );
}
