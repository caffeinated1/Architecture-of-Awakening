import React, { memo, useState, useEffect } from 'react';
import theme from '../../styles/theme';

const styles = {
  container: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: `${theme.spacing.lg} ${theme.spacing.md}`,
    fontFamily: theme.fonts.body,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing.lg,
    alignItems: 'start',
  },
  singleColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: theme.spacing.lg,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: theme.fonts.heading,
    fontWeight: 400,
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    color: theme.colors.text,
    margin: `0 0 ${theme.spacing.xs}`,
    letterSpacing: '0.02em',
  },
  sectionSubtitle: {
    fontFamily: theme.fonts.body,
    fontWeight: 300,
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: theme.colors.textMuted,
    margin: 0,
  },
  formula: {
    fontFamily: theme.fonts.heading,
    fontStyle: 'italic',
    fontSize: '1.15rem',
    color: theme.colors.gold,
    letterSpacing: '0.04em',
    padding: '1rem 1.25rem',
    background: theme.colors.gold + '08',
    border: `1px solid ${theme.colors.gold}18`,
    borderRadius: '8px',
    textAlign: 'center',
    margin: `${theme.spacing.sm} 0`,
  },
  // Feelings map table
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 4px',
    fontFamily: theme.fonts.body,
  },
  tableHeader: {
    fontFamily: theme.fonts.body,
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: theme.colors.textMuted,
    textAlign: 'left',
    padding: '0.5rem 1rem',
    borderBottom: `1px solid ${theme.colors.textMuted}15`,
  },
  tableRow: {
    transition: 'background 0.2s ease',
  },
  tableWrap: {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  tableCell: {
    padding: '0.65rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 300,
    color: theme.colors.text + 'cc',
    background: theme.colors.surface + '66',
    borderTop: `1px solid ${theme.colors.textMuted}08`,
    verticalAlign: 'middle',
  },
  tableCellFirst: {
    borderRadius: '6px 0 0 6px',
  },
  tableCellLast: {
    borderRadius: '0 6px 6px 0',
  },
  feelingLabel: {
    fontWeight: 400,
    color: theme.colors.text,
  },
  // Concept card
  conceptCard: {
    background: theme.colors.surface + 'aa',
    border: `1px solid ${theme.colors.textMuted}12`,
    borderRadius: '10px',
    padding: '1.25rem 1.5rem',
    backdropFilter: 'blur(8px)',
    transition: 'border-color 0.3s ease',
  },
  conceptTitle: {
    fontFamily: theme.fonts.heading,
    fontWeight: 500,
    fontSize: '1.05rem',
    color: theme.colors.text,
    margin: '0 0 0.35rem',
  },
  conceptDescription: {
    fontFamily: theme.fonts.body,
    fontWeight: 300,
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: theme.colors.textMuted,
    margin: 0,
  },
  // Condition cards
  conditionCard: (index) => ({
    background: theme.colors.surface + 'cc',
    border: `1px solid ${theme.colors.textMuted}12`,
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start',
    transition: 'all 0.3s ease',
  }),
  conditionNumber: {
    fontFamily: theme.fonts.heading,
    fontSize: '2rem',
    fontWeight: 300,
    color: theme.colors.gold + '55',
    lineHeight: 1,
    flexShrink: 0,
    minWidth: '2rem',
    textAlign: 'center',
  },
  conditionContent: {
    flex: 1,
  },
  conditionTitle: {
    fontFamily: theme.fonts.heading,
    fontWeight: 500,
    fontSize: '1rem',
    color: theme.colors.text,
    margin: '0 0 0.3rem',
  },
  conditionText: {
    fontFamily: theme.fonts.body,
    fontWeight: 300,
    fontSize: '0.85rem',
    lineHeight: 1.6,
    color: theme.colors.textMuted,
    margin: 0,
  },
  conditionFormula: {
    fontFamily: theme.fonts.heading,
    fontStyle: 'italic',
    fontSize: '0.9rem',
    color: theme.colors.gold + 'cc',
    marginTop: '0.5rem',
    display: 'block',
  },
  conditionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  label: {
    fontFamily: theme.fonts.body,
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: theme.colors.gold + '88',
    marginBottom: '0.75rem',
  },
};

function TheorySection({ keyConcepts = [], feelingsMap = [], conditions = [] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${theme.breakpoints.mobile})`);
    const handleChange = (e) => setIsMobile(e.matches);
    handleChange(mql);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  const gridStyle = isMobile ? styles.singleColumn : styles.grid;
  const containerStyle = isMobile
    ? { ...styles.container, padding: `${theme.spacing.md} ${theme.spacing.sm}` }
    : styles.container;

  return (
    <div style={containerStyle}>
      {/* Main two-column: explanation + concepts */}
      <div style={gridStyle}>
        {/* Left: Text explanation */}
        <div style={styles.leftColumn}>
          <div>
            <h2 style={styles.sectionTitle}>
              The V/V<sub>0</sub> Theory
            </h2>
            <p style={styles.sectionSubtitle}>
              Consciousness arises when the ratio of feeling-potential (V) to baseline
              sensitivity (V<sub>0</sub>) crosses specific thresholds. Feelings are not
              mere signals but potentials that shape the architecture of awareness itself.
            </p>
          </div>

          <div style={styles.formula}>
            V / V<sub>0</sub> &gt; 1 &nbsp;&rarr;&nbsp; Consciousness Arising
          </div>

          {/* Feelings as potentials table */}
          {feelingsMap.length > 0 && (
            <div>
              <div style={styles.label}>Feelings as Potentials</div>
              <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Feeling</th>
                    <th style={styles.tableHeader}>Potential</th>
                    <th style={styles.tableHeader}>Domain</th>
                  </tr>
                </thead>
                <tbody>
                  {feelingsMap.map((item, index) => (
                    <tr key={item.feeling ?? index} style={styles.tableRow}>
                      <td
                        style={{
                          ...styles.tableCell,
                          ...styles.tableCellFirst,
                          ...styles.feelingLabel,
                        }}
                      >
                        {item.feeling}
                      </td>
                      <td style={styles.tableCell}>{item.potential}</td>
                      <td style={{ ...styles.tableCell, ...styles.tableCellLast }}>
                        {item.domain}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>

        {/* Right: Key concept cards */}
        <div style={styles.rightColumn}>
          {keyConcepts.length > 0 && (
            <>
              <div style={styles.label}>Key Concepts</div>
              {keyConcepts.map((concept, index) => (
                <div key={concept.title ?? index} style={styles.conceptCard}>
                  <h4 style={styles.conceptTitle}>{concept.title}</h4>
                  <p style={styles.conceptDescription}>{concept.description}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Conditions section: full width, numbered cards */}
      {conditions.length > 0 && (
        <div style={{ marginTop: theme.spacing.lg }}>
          <div style={styles.label}>Three Conditions for Consciousness</div>
          <div style={styles.conditionsGrid}>
            {conditions.map((condition, index) => (
              <div key={condition.title ?? index} style={{
                ...styles.conditionCard(index),
                ...(isMobile ? { padding: '1rem', gap: '0.75rem' } : {}),
              }}>
                <span style={styles.conditionNumber}>{index + 1}</span>
                <div style={styles.conditionContent}>
                  <h4 style={styles.conditionTitle}>{condition.title}</h4>
                  <p style={styles.conditionText}>{condition.description}</p>
                  {condition.formula && (
                    <span style={styles.conditionFormula}>{condition.formula}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(TheorySection);
