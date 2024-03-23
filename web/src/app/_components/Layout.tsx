"use client";

import { ReactNode } from "react";
import logo from "public/logo.svg";
import Image from "next/image";
import Link from "next/link";
import { useLocalStorage } from "usehooks-ts";
import { ConnectKitButton } from "connectkit";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { NavEntry } from "./NavEntry";

export function Layout({ children }: { children: ReactNode }) {
  const [stories] = useLocalStorage<number[]>("stories", []);
  const pathname = usePathname();

  return (
    <div className="flex min-h-full">
      <div className="sticky top-0 z-40 h-screen overflow-hidden w-16 border-r">
        <div className="w-full h-full flex flex-col items-center gap-4 py-4 px-2">
          <Link href="/">
            <Image src={logo} className="size-8" alt="Logo" />
          </Link>
          <div className="w-full border-b"></div>
          {stories.map((story) => (
            <NavEntry storyId={story} key={`story-link-${story}`} />
          ))}
          <Link
            href={`/create`}
            className={clsx(
              "rounded-full size-8 border grid place-items-center hover:border-slate-800 mt-4 transition-all",
              pathname === `/create` ? "border-slate-400" : ""
            )}
          >
            +
          </Link>
        </div>
      </div>
      <div className="grow shrink-0 relative min-w-0">
        <div className="sticky top-0 w-full flex items-center justify-between px-4 h-16 border-b z-40 bg-white">
          <Link href="/">
            <h1 className="text-xl font-bold">Parallel Story Six</h1>
          </Link>
          <div className="flex gap-4">
            <ConnectKitButton />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
