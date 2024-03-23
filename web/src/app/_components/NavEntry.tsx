"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { useMetadata } from "@/app/_hooks/useMetadata";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function NavEntry({ storyId }: { storyId: number }) {
  const info = useMetadata(storyId);
  const pathname = usePathname();

  return (
    <Link
      href={`/${storyId}`}
      className={clsx(
        "rounded-full size-8 border grid place-items-center hover:border-slate-800 transition-all",
        pathname.match(RegExp(`^/${storyId}`)) ? "border-slate-400" : ""
      )}
    >
      <Image
        src={
          info?.image ||
          "https://cf-ipfs.com/ipfs/QmPr1DyrPda4cPp3fj17HH9PtwfTkv95EQDUSRUGoX3hWJ"
        }
        width={160}
        height={160}
        alt={info?.name || ""}
        className="rounded-full overflow-hidden object-cover object-center size-full"
      />
    </Link>
  );
}
