import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that returns scroll progress (0-1) for a given ref element.
 * Uses IntersectionObserver for visibility detection and scroll events
 * for fine-grained progress calculation.
 *
 * @param {React.RefObject} ref - Reference to the target element
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - IntersectionObserver threshold (default 0.1)
 * @returns {{ progress: number, isVisible: boolean }}
 */
export default function useScrollProgress(ref, options = {}) {
  const { threshold = 0.1 } = options;
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const calculateProgress = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Element top relative to viewport bottom (enters at 1, exits at 0)
    // Progress 0: element top is at viewport bottom
    // Progress 1: element bottom is at viewport top
    const totalTravel = windowHeight + rect.height;
    const traveled = windowHeight - rect.top;
    const raw = traveled / totalTravel;

    setProgress(Math.max(0, Math.min(1, raw)));
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // IntersectionObserver for visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold }
    );

    observer.observe(element);

    // Scroll listener for progress
    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Calculate initial progress
    calculateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, threshold, calculateProgress]);

  return { progress, isVisible };
}
