import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import theme from '../../styles/theme';

const styles = {
  section: (hasAppeared) => ({
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    opacity: hasAppeared ? 1 : 0,
    transform: hasAppeared ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'opacity, transform',
  }),
};

function SectionWrapper({ id, children, className, onVisible }) {
  const sectionRef = useRef(null);
  const [hasAppeared, setHasAppeared] = useState(false);

  const handleIntersection = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setHasAppeared(true);
          if (onVisible) onVisible(id);
        }
      });
    },
    [id, onVisible]
  );

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={className}
      style={styles.section(hasAppeared)}
    >
      {children}
    </section>
  );
}

export default memo(SectionWrapper);
