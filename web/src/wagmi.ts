import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [sepolia],
    transports: {
      // RPC URL for each chain
      [sepolia.id]: http(
        `https://eth-sepolia.g.alchemy.com/v2/KVyGeNv6ldkYaUxi-I2JmJLjKAKtDxMw`
      ),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    // Required App Info
    appName: "Parallel Story Six",

    // Optional App Info
    appDescription: "Next Generation Story Protocol",
    appUrl: "https://ps6.limaois.me", // your app's url
    appIcon: "https://ps6.limaois.me/logo.svg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
