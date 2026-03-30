import React, { memo } from 'react';
import theme from '../../styles/theme';

const chevronKeyframes = `
@keyframes heroChevronBounce {
  0%, 100% { transform: translateY(0) translateX(-50%); opacity: 0.6; }
  50% { transform: translateY(8px) translateX(-50%); opacity: 1; }
}
@keyframes heroFadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.colors.bg,
  },
  canvasContainer: {
    position: 'absolute',
    inset: 0,
    zIndex: 0,
  },
  overlay: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 2rem',
    pointerEvents: 'none',
    maxWidth: '900px',
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontWeight: 300,
    fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
    lineHeight: 1.15,
    color: theme.colors.text,
    letterSpacing: '0.02em',
    margin: 0,
    animation: 'heroFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  titleAccent: {
    color: theme.colors.gold,
  },
  divider: {
    width: '60px',
    height: '1px',
    background: `linear-gradient(to right, transparent, ${theme.colors.gold}, transparent)`,
    margin: '1.5rem auto',
    animation: 'heroFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    fontWeight: 300,
    fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
    lineHeight: 1.7,
    color: theme.colors.textMuted,
    letterSpacing: '0.04em',
    maxWidth: '600px',
    margin: 0,
    animation: 'heroFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
  },
  author: {
    fontFamily: theme.fonts.heading,
    fontWeight: 400,
    fontStyle: 'italic',
    fontSize: '1rem',
    color: theme.colors.textMuted + 'aa',
    marginTop: '1.5rem',
    letterSpacing: '0.06em',
    animation: 'heroFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '3rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    pointerEvents: 'none',
    animation: 'heroFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1s both',
  },
  scrollText: {
    fontFamily: theme.fonts.body,
    fontSize: '0.65rem',
    fontWeight: 400,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: theme.colors.textMuted + '88',
  },
  chevron: {
    position: 'relative',
    left: '50%',
    width: '16px',
    height: '16px',
    borderRight: `1px solid ${theme.colors.textMuted}66`,
    borderBottom: `1px solid ${theme.colors.textMuted}66`,
    transform: 'translateX(-50%) rotate(45deg)',
    animation: 'heroChevronBounce 2s ease-in-out infinite',
  },
};

function Hero({ children }) {
  return (
    <div style={styles.wrapper}>
      <style>{chevronKeyframes}</style>

      {/* 3D canvas content */}
      {children && <div style={styles.canvasContainer}>{children}</div>}

      {/* Text overlay */}
      <div style={styles.overlay}>
        <h1 style={styles.title}>
          The <span style={styles.titleAccent}>Architecture</span> of Awakening
        </h1>
        <div style={styles.divider} />
        <p style={styles.subtitle}>
          A Four-Domain Reconstruction of the Buddha&#8217;s Path to Liberation
        </p>
        <p style={styles.author}>by Texture</p>
      </div>

      {/* Scroll indicator */}
      <div style={styles.scrollIndicator}>
        <span style={styles.scrollText}>Scroll to begin</span>
        <div style={styles.chevron} />
      </div>
    </div>
  );
}

export default memo(Hero);
