"use server";

import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import abi from "@/app/abi";
import { mintclub } from "mint.club-v2-sdk";
import { CovalentClient } from "@covalenthq/client-sdk";

async function getHolders(address: string) {
  const client = new CovalentClient(process.env.COVALENT_API_KEY || "");
  try {
    const info =
      await client.BalanceService.getTokenHoldersV2ForTokenAddressByPage(
        "eth-sepolia",
        address
      );
    return info.data.pagination.total_count;
  } catch (error) {
    console.error(error);
  }
}

export async function getMetadata(storyId: number) {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/KVyGeNv6ldkYaUxi-I2JmJLjKAKtDxMw`
    ),
  });
  const symbol = await publicClient.readContract({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "storySymbol",
    args: [BigInt(storyId)],
  });

  const token = mintclub.network("sepolia").nft(symbol);

  const address = token.getTokenAddress();
  const holders = await getHolders(address);
  const metadataIpfs = await token.getMetadataUri();
  const metadataHttp = mintclub.ipfs.hashToGatewayUrl(metadataIpfs);

  const metadata = await fetch(metadataHttp).then((res) => res.json());
  const image = mintclub.ipfs.hashToGatewayUrl(metadata.image);

  return {
    image,
    name: metadata.name,
    holders,
    symbol,
  };
}
