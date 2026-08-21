import { useEffect } from "react";

/**
 * Suppresses the browser context menu across the page.
 *
 * Text inputs keep theirs - cut/copy/paste/spellcheck have no keyboard-free
 * substitute, so blocking them there costs real usability for no gain.
 *
 * This is a deterrent, not protection: anything the page ships is still one
 * devtools panel or one `view-source:` away.
 */
export function useDisableContextMenu() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);
}
