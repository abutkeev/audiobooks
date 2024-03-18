import { useEffect, useState } from 'react';

interface IsOverlapsOptions {
  root?: Element | null;
  element?: Element | null;
}

function useIsOverlaps({ root, element }: IsOverlapsOptions) {
  const [overlaps, setOverlaps] = useState(false);

  useEffect(() => {
    if (!root || !element) return;

    const checkIntersection = () => {
      const rect1 = root.getBoundingClientRect();
      const rect2 = element.getBoundingClientRect();

      const overlap = !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
      setOverlaps(overlap);
    };
    checkIntersection();

    window.addEventListener('resize', checkIntersection);

    return () => window.removeEventListener('resize', checkIntersection);
  }, [root, element]);

  return overlaps;
}

export default useIsOverlaps;
