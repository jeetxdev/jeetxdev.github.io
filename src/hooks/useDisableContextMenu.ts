import { useEffect } from "react";

/**
 * Text inputs keep their context menu: cut/copy/paste/spellcheck have no keyboard-free
 * substitute, so blocking them there costs real usability for no gain.
 *
 * This is a deterrent, not protection: anything the page ships is still one
 * devtools panel or one `view-source:` away.
 */
export function useDisableContextMenu() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea")) return;
      if (target instanceof HTMLElement && target.isContentEditable) return;
      e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, []);
}
