import { useEffect, useState } from "react";
import { getMetadata } from "@/app/_actions/getMetadata";

export function useMetadata(storyId: number) {
  const [info, setInfo] = useState<Awaited<
    ReturnType<typeof getMetadata>
  > | null>(null);
  useEffect(() => {
    getMetadata(storyId).then(setInfo);
  }, [storyId]);

  return info;
}
