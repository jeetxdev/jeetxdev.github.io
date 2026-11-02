import { useEffect, useRef, useState } from "react";

const SCENE_SELECTOR = ".scene";
const VISIBLE_CLASS = "is-visible";
/** Only the middle of the viewport counts, so a scene starts reversing while its edge is still on screen. */
const SCENE_ROOT_MARGIN = "-12% 0px -12% 0px";
const FORWARD_PLAYBACK_RATE = 1;
/** Leaving plays the entrance backwards, a little faster than it came in. */
const REVERSE_PLAYBACK_RATE = -1.5;

/** The scene's own finite CSS animations: loops and nested scenes are left alone. */
function entranceAnimations(scene: HTMLElement): Animation[] {
  return scene.getAnimations({ subtree: true }).filter((animation) => {
    if (!(animation instanceof CSSAnimation)) return false;
    const { effect } = animation;
    if (!(effect instanceof KeyframeEffect) || !effect.target) return false;
    if (effect.getComputedTiming().iterations === Infinity) return false;
    return effect.target.closest(SCENE_SELECTOR) === scene;
  });
}

function playAt(animations: Animation[], rate: number) {
  animations.forEach((animation) => {
    animation.playbackRate = rate;
    animation.play();
  });
}

/**
 * Adds `is-visible` to a `.scene` element when it scrolls into view, which starts its
 * CSS animations. When it leaves, those animations run backwards and the class comes off
 * once they finish, so the scene replays on every visit. The trigger, if attached, decides
 * visibility instead of the scene itself. `visit` counts the times the scene has entered.
 */
export function useScene<S extends HTMLElement, T extends HTMLElement = S>() {
  const sceneRef = useRef<S>(null);
  const triggerRef = useRef<T>(null);
  const [visit, setVisit] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (!("IntersectionObserver" in window)) {
      scene.classList.add(VISIBLE_CLASS);
      return;
    }

    let reversing: Animation[] = [];

    const enter = () => {
      setVisit((count) => count + 1);
      // Caught mid-reverse: turn the same animations around instead of restarting them.
      if (reversing.length > 0) {
        playAt(reversing, FORWARD_PLAYBACK_RATE);
        reversing = [];
        return;
      }
      scene.classList.add(VISIBLE_CLASS);
    };

    const leave = () => {
      const animations = entranceAnimations(scene);
      if (animations.length === 0) {
        scene.classList.remove(VISIBLE_CLASS);
        return;
      }
      playAt(animations, REVERSE_PLAYBACK_RATE);
      reversing = animations;
      Promise.all(animations.map((animation) => animation.finished)).then(
        () => {
          if (reversing !== animations) return;
          reversing = [];
          scene.classList.remove(VISIBLE_CLASS);
        },
        // Cancelled, which only happens when the scene is torn down.
        () => {},
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? enter() : leave()),
      { rootMargin: SCENE_ROOT_MARGIN },
    );
    observer.observe(triggerRef.current ?? scene);
    return () => observer.disconnect();
  }, []);

  return { sceneRef, triggerRef, visit };
}
