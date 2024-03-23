"use client";

import { ConnectKitButton } from "connectkit";
import { mintclub } from "mint.club-v2-sdk";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import abi from "@/app/abi";

export function Deploy({
  setStep,
  metadataUrl,
  formElement,
}: {
  setStep: (step: number) => void;
  metadataUrl: `ipfs://${string}`;
  formElement: RefObject<HTMLFormElement>;
}) {
  const account = useAccount();
  const [tokenExists, setTokenExists] = useState(false);
  const [tokenApproved, setTokenApproved] = useState(false);
  const { data: hash, writeContract } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const getToken = useCallback(() => {
    if (!formElement.current) return;

    const formData = new FormData(formElement.current);
    const mintClubClient = mintclub
      .network("sepolia")
      .withAccount(account) as ReturnType<typeof mintclub.network>;
    return mintClubClient.nft(formData.get("symbol") as string);
  }, [account]);

  const deploy = useCallback(async () => {
    const token = getToken();
    if (!token || tokenExists || !formElement.current) return;
    const exist = await token.exists();
    if (exist) {
      setTokenExists(true);
      return;
    }

    const formData = new FormData(formElement.current);
    const supply = parseInt(formData.get("supply") as string) || 10_000_000;
    await token.create({
      name: formData.get("title") as string,
      reserveToken: {
        address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
        decimals: 6,
      },
      curveData: {
        curveType: "LINEAR",
        stepCount: 10,
        maxSupply: supply,
        initialMintingPrice:
          parseFloat(formData.get("minPrice") as string) || 0,
        finalMintingPrice:
          parseFloat(formData.get("maxPrice") as string) || 1000,
        creatorAllocation: supply * 0.3,
      },
      metadataUrl,
      onSuccess: () => setTokenExists(true),
      onError: (error) => console.error("Error creating token", error),
    });
  }, [tokenExists, metadataUrl]);

  const approve = useCallback(async () => {
    const token = getToken();
    if (!token || tokenApproved || !account.address) return;
    const approve = await token.getIsApprovedForAll({
      owner: account.address,
      spender: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    });
    if (approve) {
      setTokenApproved(true);
      return;
    }

    await token.approve({
      approved: true,
      spender: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      onSuccess: () => setTokenApproved(true),
      onError: (error) => console.error("Error approving token", error),
    });
  }, [tokenApproved, account]);

  const startIso = useCallback(async () => {
    const token = getToken();
    if (!token || !account.address || !formElement.current) return;

    const formData = new FormData(formElement.current);
    const supply = parseInt(formData.get("supply") as string) || 10_000_000;

    writeContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi,
      functionName: "startIso",
      args: [token.getTokenAddress(), BigInt(supply * 0.3), 600n],
    });
  }, [writeContract]);

  useEffect(() => {
    if (isSuccess) {
      setStep(4);
    }
  }, [isSuccess]);

  return (
    <>
      <h2 className="font-bold text-3xl">Deploy</h2>
      <div className="rounded-xl border flex flex-col gap-4 p-8">
        <div className="flex items-center justify-between">
          <span>Connect Wallet</span>
          {account ? (
            <button className="rounded-full bg-slate-50 px-4 py-1.5">
              Connected
            </button>
          ) : (
            <ConnectKitButton />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span>Deploy Token</span>
          <button
            className="rounded-full bg-slate-50 px-4 py-1.5"
            onClick={deploy}
            disabled={tokenExists}
            type="button"
          >
            {tokenExists ? "Deployed" : "Deploy"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span>Approve Token</span>
          <button
            className="rounded-full bg-slate-50 px-4 py-1.5"
            onClick={approve}
            disabled={tokenApproved}
            type="button"
          >
            {tokenApproved ? "Approved" : "Approve"}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span>Start ISO</span>
          <button
            className="rounded-full bg-slate-50 px-4 py-1.5"
            onClick={startIso}
            type="button"
          >
            Start
          </button>
        </div>
      </div>
    </>
  );
}
