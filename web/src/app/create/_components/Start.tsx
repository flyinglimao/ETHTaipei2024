"use client";
export function Start({ setStep }: { setStep: (step: number) => void }) {
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
        type="button"
      >
        Start
      </button>
    </>
  );
}
