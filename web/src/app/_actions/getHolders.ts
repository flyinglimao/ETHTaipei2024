"use server";

import { CovalentClient } from "@covalenthq/client-sdk";

export async function getHolders(address: string) {
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
