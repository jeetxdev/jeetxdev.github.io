import { useEffect, useRef } from "react";

const VISIBLE_CLASS = "is-visible";
/** Scenes that come into view together start this far apart, top to bottom. */
const SCENE_STAGGER_MS = 400;

let entering: HTMLElement[] = [];
let flushFrame = 0;

function inDocumentOrder(a: HTMLElement, b: HTMLElement): number {
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

/**
 * Starts every scene that entered in the same frame. Batching by frame staggers the ones
 * on screen at load, while scenes reached by scrolling start straight away.
 */
function startEntering() {
  flushFrame = 0;
  entering.sort(inDocumentOrder).forEach((scene, index) => {
    window.setTimeout(() => scene.classList.add(VISIBLE_CLASS), index * SCENE_STAGGER_MS);
  });
  entering = [];
}

function queueStart(scene: HTMLElement) {
  entering.push(scene);
  if (!flushFrame) flushFrame = requestAnimationFrame(startEntering);
}

/**
 * Adds `is-visible` to a `.scene` element the first time any of it scrolls into view, which
 * starts its CSS animations. It plays once and stays. Scenes must not be nested.
 */
export function useScene<S extends HTMLElement>() {
  const sceneRef = useRef<S>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (!("IntersectionObserver" in window)) {
      scene.classList.add(VISIBLE_CLASS);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      queueStart(scene);
    });
    observer.observe(scene);
    return () => observer.disconnect();
  }, []);

  return { sceneRef };
}
