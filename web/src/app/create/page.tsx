"use client";

import clsx from "clsx";
import { FormEvent, useCallback, useRef, useState } from "react";
import { Deploy } from "./_components/Deploy";
import { Finish } from "./_components/Finish";
import { IsoSetting } from "./_components/IsoSetting";
import { Start } from "./_components/Start";
import { StoryInformation } from "./_components/StoryInformation";
import { uploadMetadata } from "../_actions/uploadMetadata";

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

function Create() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [metadataUrl, setMetadataUrl] = useState<`ipfs://${string}`>(
    "ipfs://QmPr1DyrPda4cPp3fj17HH9PtwfTkv95EQDUSRUGoX3hWJ"
  );
  const upload = useCallback(async (evt: FormEvent) => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const metadataUrl = await uploadMetadata(formData);
    setMetadataUrl(metadataUrl);
    setStep(3);
  }, []);

  return (
    <form
      onSubmit={upload}
      className="w-full max-w-screen-lg mx-auto flex flex-wrap gap-12 my-8 items-start"
      ref={formRef}
    >
      <nav className="min-w-60 pt-4 flex ">
        <ol className="flex flex-col gap-6">
          <Step state={0 - step} text="Getting Started" />
          <Step state={1 - step} text="Story Information" />
          <Step state={2 - step} text="ISO Setting" />
          <Step state={3 - step} text="Deploy" />
          <Step state={4 - step} text="Finish" />
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
        <Deploy
          setStep={setStep}
          metadataUrl={metadataUrl}
          formElement={formRef}
        />
      </div>
      <div
        className={clsx(
          step === 4 ? "flex" : "hidden",
          "flex-1 flex flex-col gap-4"
        )}
      >
        <Finish />
      </div>
    </form>
  );
}

export default Create;
