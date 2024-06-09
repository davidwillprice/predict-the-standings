"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { Button } from "@components/button/button";
import Icon from "@svgs/icons/sq-icon";

export const AccessibilityOptions = () => {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  /**  useEffect only runs on the client, so now we can safely show the UI without hydration errors*/
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={() =>
        setTheme(theme === "light" || theme === undefined ? "dark" : "light")
      }>
      <Icon
        type={theme === "light" || theme === undefined ? "moon" : "sun"}
        strokeWidth={2}></Icon>
      Toggle {theme === "light" || theme === undefined ? "Dark" : "Light"} Mode
    </Button>
    /**@todo Add high contrast mode */
    /**@todo Add dislexic friendly font mode */
    /**@todo Add larger cursor mode */
    /**@todo Add reset button */
  );
};
