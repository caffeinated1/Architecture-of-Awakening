import React, { memo, useState, useCallback } from 'react';
import theme from '../../styles/theme';

const SECTIONS = [
  'Origin',
  'The Four Domains',
  'The Jhānas',
  'The Practice',
  'Consciousness',
  'Liberation',
];

const styles = {
  nav: {
    position: 'fixed',
    left: '2rem',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  },
  line: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: '1px',
    background: `linear-gradient(to bottom, transparent, ${theme.colors.textMuted}33, transparent)`,
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },
  item: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    cursor: 'pointer',
    zIndex: 1,
  },
  dot: (isActive) => ({
    width: isActive ? '10px' : '6px',
    height: isActive ? '10px' : '6px',
    borderRadius: '50%',
    background: isActive ? theme.colors.gold : theme.colors.textMuted + '66',
    border: isActive ? `1px solid ${theme.colors.gold}` : '1px solid transparent',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: isActive ? `0 0 12px ${theme.colors.gold}44` : 'none',
    flexShrink: 0,
  }),
  label: (isHovered, isActive) => ({
    position: 'absolute',
    left: '24px',
    whiteSpace: 'nowrap',
    fontFamily: theme.fonts.body,
    fontSize: '0.75rem',
    fontWeight: isActive ? 500 : 400,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: isActive ? theme.colors.gold : theme.colors.text,
    opacity: isHovered ? 1 : 0,
    transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    pointerEvents: 'none',
    background: theme.colors.bg + 'dd',
    padding: '4px 10px',
    borderRadius: '4px',
    backdropFilter: 'blur(8px)',
  }),
  hamburger: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 200,
    width: '40px',
    height: '40px',
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
    background: theme.colors.surface + 'cc',
    border: `1px solid ${theme.colors.textMuted}22`,
    borderRadius: '8px',
    backdropFilter: 'blur(12px)',
    padding: 0,
  },
  hamburgerLine: (isOpen, index) => ({
    width: '18px',
    height: '1.5px',
    background: theme.colors.text,
    transition: 'all 0.3s ease',
    transform:
      isOpen && index === 0
        ? 'rotate(45deg) translate(2px, 2px)'
        : isOpen && index === 2
          ? 'rotate(-45deg) translate(2px, -2px)'
          : 'none',
    opacity: isOpen && index === 1 ? 0 : 1,
  }),
  mobileMenu: (isOpen) => ({
    position: 'fixed',
    inset: 0,
    zIndex: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
    background: theme.colors.bg + 'f5',
    backdropFilter: 'blur(20px)',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'opacity 0.4s ease',
  }),
  mobileItem: (isActive) => ({
    fontFamily: theme.fonts.heading,
    fontSize: '1.5rem',
    fontWeight: 300,
    color: isActive ? theme.colors.gold : theme.colors.text,
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'none',
    letterSpacing: '0.03em',
    transition: 'color 0.3s ease',
  }),
};

function Navigation({ activeSection = 0, onNavigate }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${theme.breakpoints.mobile})`);
    const handleChange = (e) => setIsMobile(e.matches);
    handleChange(mql);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const handleNavigate = useCallback(
    (index) => {
      if (onNavigate) onNavigate(index);
      setMobileOpen(false);
    },
    [onNavigate]
  );

  // Hamburger button for mobile
  const hamburgerButton = (
    <button
      style={{
        ...styles.hamburger,
        display: isMobile ? 'flex' : 'none',
      }}
      onClick={() => setMobileOpen((prev) => !prev)}
      aria-label="Toggle navigation"
    >
      {[0, 1, 2].map((i) => (
        <span key={i} style={styles.hamburgerLine(mobileOpen, i)} />
      ))}
    </button>
  );

  // Mobile overlay menu
  const mobileMenu = (
    <div style={styles.mobileMenu(mobileOpen)}>
      {SECTIONS.map((section, index) => (
        <button
          key={section}
          style={styles.mobileItem(activeSection === index)}
          onClick={() => handleNavigate(index)}
        >
          {section}
        </button>
      ))}
    </div>
  );

  // Desktop vertical nav
  const desktopNav = (
    <nav
      style={{
        ...styles.nav,
        display: isMobile ? 'none' : 'flex',
      }}
      aria-label="Section navigation"
    >
      <div style={styles.line} />
      {SECTIONS.map((section, index) => {
        const isActive = activeSection === index;
        const isHovered = hoveredIndex === index;
        return (
          <div
            key={section}
            style={styles.item}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleNavigate(index)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${section}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigate(index);
              }
            }}
          >
            <div style={styles.dot(isActive)} />
            <span style={styles.label(isHovered, isActive)}>{section}</span>
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {desktopNav}
      {hamburgerButton}
      {mobileMenu}
    </>
  );
}

export default memo(Navigation);
