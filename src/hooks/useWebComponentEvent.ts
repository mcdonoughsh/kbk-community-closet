import { useEffect, useRef, useCallback } from 'react';

type EventHandler<T> = (detail: T) => void;

/**
 * useWebComponentEvent - Helper to handle Web Component CustomEvents in React
 * 
 * @param eventName - Name of the custom event to listen for
 * @param handler - Callback function to handle the event
 * @returns ref to attach to the Web Component element
 */
export function useWebComponentEvent<T = unknown>(
  eventName: string,
  handler: EventHandler<T>
) {
  const ref = useRef<HTMLElement>(null);
  const handlerRef = useRef(handler);

  // Keep handler ref up to date
  handlerRef.current = handler;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const eventHandler = (e: Event) => {
      const customEvent = e as CustomEvent<T>;
      handlerRef.current(customEvent.detail);
    };

    element.addEventListener(eventName, eventHandler);
    return () => element.removeEventListener(eventName, eventHandler);
  }, [eventName]);

  return ref;
}

/**
 * useWebComponentRef - Creates a ref with event listener setup
 * Returns both the ref and a function to manually add listeners
 */
export function useWebComponentRef<E extends HTMLElement = HTMLElement>() {
  const ref = useRef<E>(null);

  const addEventListener = useCallback(<T>(
    eventName: string,
    handler: EventHandler<T>
  ) => {
    const element = ref.current;
    if (!element) return () => {};

    const eventHandler = (e: Event) => {
      const customEvent = e as CustomEvent<T>;
      handler(customEvent.detail);
    };

    element.addEventListener(eventName, eventHandler);
    return () => element.removeEventListener(eventName, eventHandler);
  }, []);

  return { ref, addEventListener };
}
