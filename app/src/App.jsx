import { useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Navigation from './components/layout/Navigation'
import SectionWrapper from './components/layout/SectionWrapper'
import Hero from './components/ui/Hero'
import DomainCard from './components/ui/DomainCard'
import PhaseTimeline from './components/ui/PhaseTimeline'
import TheorySection from './components/ui/TheorySection'
import BrahmaviharaScene from './components/three/BrahmaviharaScene'
import JhanaProgression from './components/three/JhanaProgression'
import ConsciousnessField from './components/three/ConsciousnessField'
import UnifiedField from './components/three/UnifiedField'
import ParticleField from './components/three/ParticleField'
import { brahmaviharas } from './data/brahmavihara'
import { jhanas, practicePhases } from './data/jhanas'
import { theoryOverview, keyConcepts, feelingsMap, conditions } from './data/theory'

const SECTIONS = [
  'origin',
  'domains',
  'jhanas',
  'practice',
  'consciousness',
  'liberation',
]

const SECTION_LABELS = [
  'Origin',
  'The Four Domains',
  'The Jhānas',
  'The Practice',
  'Consciousness',
  'Liberation',
]

function App() {
  const [activeSection, setActiveSection] = useState(0)
  const [activeDomain, setActiveDomain] = useState(0)
  const [activeJhana, setActiveJhana] = useState(0)
  const [activePhase, setActivePhase] = useState(1)
  const [consciousnessUnified, setConsciousnessUnified] = useState(false)
  const [liberationMerged, setLiberationMerged] = useState(false)

  const handleSectionVisible = useCallback((id) => {
    const idx = SECTIONS.indexOf(id)
    if (idx !== -1) setActiveSection(idx)
  }, [])

  const handleNavigate = useCallback((idx) => {
    const el = document.getElementById(SECTIONS[idx])
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <Navigation
        sections={SECTION_LABELS}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* SECTION 1: Hero / Origin */}
      <SectionWrapper id="origin" onVisible={handleSectionVisible}>
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Canvas
              style={{ background: 'transparent' }}
              camera={{ position: [0, 0, 8], fov: 60 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <pointLight position={[0, 0, 5]} intensity={0.5} color="#c9a55a" />
                <ParticleField count={1500} color="#c9a55a" radius={6} speed={0.1} pattern="radiate" />
              </Suspense>
            </Canvas>
          </div>
          <Hero />
        </div>
      </SectionWrapper>

      {/* SECTION 2: The Four Domains (Brahmavihāras) */}
      <SectionWrapper id="domains" onVisible={handleSectionVisible}>
        <div style={styles.splitSection}>
          <div style={styles.canvasHalf}>
            <BrahmaviharaScene activeIndex={activeDomain} intensity={1} />
          </div>
          <div style={styles.contentHalf}>
            <h2 style={styles.sectionTitle}>The Four Domains</h2>
            <p style={styles.sectionSubtitle}>
              Four experiential fields — somatic, emotional, relational, and boundary —
              each purified by a brahmavihāra and stabilized by the corresponding jhāna.
            </p>
            <div style={styles.cardGrid}>
              {brahmaviharas.map((domain, i) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  isActive={activeDomain === i + 1}
                  onClick={() => setActiveDomain(activeDomain === i + 1 ? 0 : i + 1)}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 3: The Jhānas */}
      <SectionWrapper id="jhanas" onVisible={handleSectionVisible}>
        <div style={styles.splitSection}>
          <div style={styles.contentHalf}>
            <h2 style={styles.sectionTitle}>The Jhānas</h2>
            <p style={styles.sectionSubtitle}>
              Not trance absorptions but progressive stabilization modes that lock
              purified domains into coherence.
            </p>
            <div style={styles.jhanaList}>
              {jhanas.map((jhana, i) => (
                <div
                  key={jhana.number}
                  style={{
                    ...styles.jhanaItem,
                    borderLeft: `3px solid ${activeJhana === i + 1 ? brahmaviharas[i]?.color || '#c9a55a' : 'rgba(255,255,255,0.1)'}`,
                    opacity: activeJhana === 0 || activeJhana === i + 1 ? 1 : 0.4,
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveJhana(activeJhana === i + 1 ? 0 : i + 1)}
                >
                  <div style={styles.jhanaNumber}>{jhana.name}</div>
                  <div style={styles.jhanaTraditional}>{jhana.traditional}</div>
                  <div style={styles.jhanaFelt}>{jhana.feltState}</div>
                  <div style={styles.jhanaRoot}>Rooted in: {jhana.rootedIn}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.canvasHalf}>
            <JhanaProgression activeJhana={activeJhana} progress={1} />
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 4: The Practice */}
      <SectionWrapper id="practice" onVisible={handleSectionVisible}>
        <div style={styles.centeredSection}>
          <h2 style={styles.sectionTitleCentered}>The Practice</h2>
          <p style={{ ...styles.sectionSubtitle, textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Eight phases from breath stabilization through boundless liberation.
            Each brahmavihāra is taken through all four jhānas, made boundless,
            then combined into one luminous, liberated mind.
          </p>
          <PhaseTimeline
            phases={practicePhases}
            activePhase={activePhase}
            onPhaseClick={(p) => setActivePhase(p)}
          />
        </div>
      </SectionWrapper>

      {/* SECTION 5: Consciousness — V/V₀ Theory */}
      <SectionWrapper id="consciousness" onVisible={handleSectionVisible}>
        <div style={styles.splitSection}>
          <div style={styles.canvasHalf}>
            <ConsciousnessField unified={consciousnessUnified} />
            <button
              style={styles.toggleButton}
              onClick={() => setConsciousnessUnified(!consciousnessUnified)}
            >
              {consciousnessUnified ? 'Dispersed V₀' : 'Unify V₀ Domain'}
            </button>
          </div>
          <div style={styles.contentHalf}>
            <h2 style={styles.sectionTitle}>{theoryOverview.title}</h2>
            <p style={styles.sectionSubtitle}>{theoryOverview.subtitle}</p>
            <blockquote style={styles.blockquote}>
              {theoryOverview.coreProposition}
            </blockquote>
            <TheorySection
              keyConcepts={keyConcepts}
              feelingsMap={feelingsMap}
              conditions={conditions}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 6: Liberation — Unified Field */}
      <SectionWrapper id="liberation" onVisible={handleSectionVisible}>
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <UnifiedField merged={liberationMerged} intensity={1} />
          </div>
          <div style={styles.liberationOverlay}>
            <h2 style={styles.liberationTitle}>Liberation</h2>
            <p style={styles.liberationText}>
              All four brahmavihāras simultaneously stable and boundless —
              the sense of a centre disappears. Heart = space = universe.
            </p>
            <p style={styles.liberationQuote}>
              "The Brahmā state" · "Immeasurable" · "Unshakeable liberation of mind"
            </p>
            <button
              style={styles.liberationButton}
              onClick={() => setLiberationMerged(!liberationMerged)}
            >
              {liberationMerged ? 'Separate Domains' : 'Merge Into One'}
            </button>
            <div style={styles.footer}>
              <p style={styles.footerText}>The Architecture of Awakening</p>
              <p style={styles.footerAuthor}>by Texture · v0.2 · December 2025</p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  )
}

const styles = {
  splitSection: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    alignItems: 'stretch',
    gap: '0',
  },
  canvasHalf: {
    flex: '1 1 50%',
    height: '100vh',
    position: 'relative',
    minWidth: 0,
  },
  contentHalf: {
    flex: '1 1 50%',
    padding: '4rem 3rem',
    maxHeight: '100vh',
    overflowY: 'auto',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  centeredSection: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '3rem',
    fontWeight: 300,
    color: '#e8e6ed',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
  },
  sectionTitleCentered: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '3rem',
    fontWeight: 300,
    color: '#e8e6ed',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1rem',
    fontWeight: 300,
    color: '#8a8794',
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  cardGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  jhanaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '1rem',
  },
  jhanaItem: {
    padding: '1.25rem 1.5rem',
    background: 'rgba(26, 26, 36, 0.6)',
    borderRadius: '8px',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  jhanaNumber: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.25rem',
    fontWeight: 400,
    color: '#e8e6ed',
    marginBottom: '0.35rem',
  },
  jhanaTraditional: {
    fontSize: '0.8rem',
    color: '#8a8794',
    fontStyle: 'italic',
    marginBottom: '0.5rem',
  },
  jhanaFelt: {
    fontSize: '0.9rem',
    color: '#c0bcc8',
    lineHeight: 1.6,
    marginBottom: '0.35rem',
  },
  jhanaRoot: {
    fontSize: '0.75rem',
    color: '#c9a55a',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  blockquote: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.3rem',
    fontStyle: 'italic',
    color: '#c9a55a',
    borderLeft: '2px solid rgba(201, 165, 90, 0.4)',
    paddingLeft: '1.5rem',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  toggleButton: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,
    background: 'rgba(201, 165, 90, 0.15)',
    border: '1px solid rgba(201, 165, 90, 0.4)',
    color: '#c9a55a',
    padding: '0.65rem 1.5rem',
    borderRadius: '4px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.04em',
    transition: 'all 0.3s ease',
  },
  liberationOverlay: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    padding: '2rem',
    pointerEvents: 'none',
  },
  liberationTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '4.5rem',
    fontWeight: 300,
    color: '#e8e6ed',
    letterSpacing: '-0.03em',
    marginBottom: '1.5rem',
  },
  liberationText: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '1.1rem',
    fontWeight: 300,
    color: '#c0bcc8',
    maxWidth: '600px',
    lineHeight: 1.8,
    marginBottom: '1rem',
  },
  liberationQuote: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: '#c9a55a',
    marginBottom: '2.5rem',
    letterSpacing: '0.02em',
  },
  liberationButton: {
    pointerEvents: 'auto',
    background: 'rgba(201, 165, 90, 0.2)',
    border: '1px solid rgba(201, 165, 90, 0.5)',
    color: '#c9a55a',
    padding: '0.85rem 2.5rem',
    borderRadius: '4px',
    fontFamily: "'Inter', sans-serif",
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
    marginBottom: '4rem',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '2rem',
  },
  footerText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1rem',
    color: '#8a8794',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  footerAuthor: {
    fontSize: '0.75rem',
    color: '#5a5666',
    marginTop: '0.25rem',
  },
}

export default App
