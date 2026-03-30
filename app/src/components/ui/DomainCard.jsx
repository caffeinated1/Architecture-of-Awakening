import React, { memo, useState, useRef, useEffect } from 'react';
import theme from '../../styles/theme';

const makeStyles = (color, isActive) => ({
  card: {
    position: 'relative',
    background: isActive
      ? `linear-gradient(135deg, ${theme.colors.surface}ee, ${color}08)`
      : theme.colors.surface + 'aa',
    border: `1px solid ${isActive ? color + '44' : theme.colors.textMuted + '15'}`,
    borderLeft: `3px solid ${isActive ? color : color + '55'}`,
    borderRadius: '12px',
    padding: '1.75rem 2rem',
    cursor: 'pointer',
    backdropFilter: 'blur(16px)',
    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
    boxShadow: isActive ? `0 8px 32px ${color}11` : 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  name: {
    fontFamily: theme.fonts.heading,
    fontWeight: 500,
    fontSize: '1.5rem',
    color: color,
    margin: 0,
    letterSpacing: '0.01em',
  },
  translation: {
    fontFamily: theme.fonts.heading,
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '1rem',
    color: theme.colors.textMuted,
  },
  description: {
    fontFamily: theme.fonts.body,
    fontWeight: 300,
    fontSize: '0.9rem',
    lineHeight: 1.7,
    color: theme.colors.text + 'cc',
    margin: '0.5rem 0 0',
  },
  expandedContent: {
    overflow: 'hidden',
    transition: 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
    maxHeight: isActive ? '500px' : '0px',
    opacity: isActive ? 1 : 0,
  },
  divider: {
    width: '40px',
    height: '1px',
    background: `linear-gradient(to right, ${color}66, transparent)`,
    margin: '1.25rem 0',
  },
  detailRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.6rem',
    alignItems: 'baseline',
  },
  detailLabel: {
    fontFamily: theme.fonts.body,
    fontSize: '0.7rem',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: color + 'aa',
    minWidth: '70px',
    flexShrink: 0,
  },
  detailValue: {
    fontFamily: theme.fonts.body,
    fontSize: '0.85rem',
    fontWeight: 300,
    lineHeight: 1.5,
    color: theme.colors.text + 'bb',
  },
  meditation: {
    fontFamily: theme.fonts.heading,
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '1rem',
    lineHeight: 1.6,
    color: theme.colors.text + 'dd',
    margin: '1rem 0 0',
    padding: '0.75rem 1rem',
    borderLeft: `2px solid ${color}33`,
    background: color + '06',
    borderRadius: '0 6px 6px 0',
  },
  glow: {
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color}06 0%, transparent 70%)`,
    pointerEvents: 'none',
    transition: 'opacity 0.5s ease',
    opacity: isActive ? 1 : 0,
  },
});

function DomainCard({ domain, isActive = false, onClick }) {
  const {
    name,
    translation,
    color = theme.colors.accent,
    description,
    direction,
    trigger,
    cue,
    meditation,
    jhana,
    jhanaDescription,
  } = domain;

  const s = makeStyles(color, isActive);

  const details = [
    direction && { label: 'Direction', value: direction },
    trigger && { label: 'Trigger', value: trigger },
    cue && { label: 'Cue', value: cue },
    jhana && { label: 'Jhāna', value: `${jhana}${jhanaDescription ? ' — ' + jhanaDescription : ''}` },
  ].filter(Boolean);

  return (
    <div
      style={s.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick();
        }
      }}
      aria-expanded={isActive}
    >
      <div style={s.glow} />

      <div style={s.header}>
        <h3 style={s.name}>{name}</h3>
        {translation && <span style={s.translation}>{translation}</span>}
      </div>

      <p style={s.description}>{description}</p>

      <div style={s.expandedContent}>
        <div style={s.divider} />
        {details.map((detail) => (
          <div key={detail.label} style={s.detailRow}>
            <span style={s.detailLabel}>{detail.label}</span>
            <span style={s.detailValue}>{detail.value}</span>
          </div>
        ))}
        {meditation && <blockquote style={s.meditation}>{meditation}</blockquote>}
      </div>
    </div>
  );
}

export default memo(DomainCard);
