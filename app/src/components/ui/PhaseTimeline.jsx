import React, { memo } from 'react';
import theme from '../../styles/theme';

const makeStyles = (isActive, isCompleted) => ({
  item: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: '2rem',
  },
  lineSegment: {
    position: 'absolute',
    left: '17px',
    top: '36px',
    bottom: 0,
    width: '1px',
    background: isActive || isCompleted
      ? `linear-gradient(to bottom, ${theme.colors.gold}66, ${theme.colors.textMuted}22)`
      : theme.colors.textMuted + '18',
    transition: 'background 0.5s ease',
  },
  circle: {
    position: 'relative',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: theme.fonts.body,
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    background: isActive
      ? theme.colors.gold + '18'
      : isCompleted
        ? theme.colors.surface
        : theme.colors.surface + '88',
    border: isActive
      ? `2px solid ${theme.colors.gold}`
      : isCompleted
        ? `1px solid ${theme.colors.gold}44`
        : `1px solid ${theme.colors.textMuted}22`,
    color: isActive
      ? theme.colors.gold
      : isCompleted
        ? theme.colors.gold + 'aa'
        : theme.colors.textMuted + '66',
    boxShadow: isActive ? `0 0 20px ${theme.colors.gold}22` : 'none',
  },
  content: {
    flex: 1,
    paddingTop: '0.35rem',
    transition: 'opacity 0.4s ease',
    opacity: isActive ? 1 : isCompleted ? 0.55 : 0.35,
  },
  title: {
    fontFamily: theme.fonts.heading,
    fontSize: isActive ? '1.25rem' : '1.1rem',
    fontWeight: isActive ? 500 : 400,
    color: isActive ? theme.colors.text : theme.colors.text + 'cc',
    margin: 0,
    letterSpacing: '0.01em',
    transition: 'all 0.4s ease',
  },
  purpose: {
    fontFamily: theme.fonts.body,
    fontSize: '0.85rem',
    fontWeight: 300,
    lineHeight: 1.6,
    color: theme.colors.textMuted,
    margin: '0.35rem 0 0',
    maxHeight: isActive ? '200px' : '0px',
    overflow: 'hidden',
    opacity: isActive ? 1 : 0,
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  checkmark: {
    fontSize: '0.75rem',
    lineHeight: 1,
  },
});

const containerStyle = {
  position: 'relative',
  fontFamily: theme.fonts.body,
};

function PhaseTimeline({ phases = [], activePhase = 0 }) {
  return (
    <div style={containerStyle}>
      {phases.map((phase, index) => {
        const isActive = index === activePhase;
        const isCompleted = index < activePhase;
        const isLast = index === phases.length - 1;
        const s = makeStyles(isActive, isCompleted);

        return (
          <div key={phase.phase ?? index} style={s.item}>
            {/* Vertical connecting line */}
            {!isLast && <div style={s.lineSegment} />}

            {/* Numbered circle */}
            <div style={s.circle}>
              {isCompleted ? (
                <span style={s.checkmark}>&#10003;</span>
              ) : (
                phase.phase ?? index + 1
              )}
            </div>

            {/* Text content */}
            <div style={s.content}>
              <h4 style={s.title}>{phase.title}</h4>
              <p style={s.purpose}>{phase.purpose}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(PhaseTimeline);
