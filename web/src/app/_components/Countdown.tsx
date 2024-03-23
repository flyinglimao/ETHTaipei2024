"use client";

import { useEffect, useState } from "react";

export function Countdown({ to }: { to: Date }) {
  const [txt, setTxt] = useState("");

  useEffect(() => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    function update() {
      const seconds = Math.floor((to.getTime() - Date.now()) / 1000);

      if (seconds < 60) {
        setTxt(rtf.format(seconds, "seconds"));
      } else if (seconds < 3600) {
        setTxt(rtf.format(Math.floor(seconds / 60), "minutes"));
      } else if (seconds < 86400) {
        setTxt(rtf.format(Math.floor(seconds / 3600), "hours"));
      } else {
        setTxt(rtf.format(Math.floor(seconds / 86400), "days"));
      }
    }
    const interval = setInterval(update, 1000);
    update();

    return () => clearInterval(interval);
  }, []);

  return txt;
}
