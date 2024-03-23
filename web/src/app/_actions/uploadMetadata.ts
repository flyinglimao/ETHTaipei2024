"use server";

import { mintclub } from "mint.club-v2-sdk";

export type UploadMetadataInput = {
  title: string;
  avatar: File;
  worldbuilding: string;
};
export async function uploadMetadata(formData: FormData) {
  const image = (formData.get("avatar") as File)?.size
    ? ((await mintclub.ipfs.upload({
        filebaseApiKey: process.env.FILEBASE_KEY || "",
        media: formData.get("avatar") as File,
      })) as `ipfs://${string}`)
    : "ipfs://QmNSEdQrAU3G9DkNWUaE7rDMmsr3pdF8tgqAuuAPtcKKrY";

  return await mintclub.ipfs.uploadMetadata({
    filebaseApiKey: process.env.FILEBASE_KEY || "",
    name: formData.get("title") as string,
    description: formData.get("worldbuilding") as string,
    image,
  });
}
