/**
 * Jhana Stages & Practice Phases Data
 *
 * The jhanas are not trance absorptions but progressive stabilization modes
 * that lock purified domains into coherence. Each jhana stabilizes the terrain
 * purified by the corresponding brahmavihara.
 *
 * Data sourced from "The Architecture of Awakening" and "Enlightenment Now" PDFs.
 */

export const jhanas = [
  {
    number: 1,
    name: 'First Jhana',
    traditional:
      'Applied and sustained thought, piti (rapture), sukha (pleasure), one-pointedness',
    feltState:
      'A warm, golden, boundless friendliness (metta) that fills the chest and starts to overflow the body. The mind is still "doing" friendliness, but the body is lit up with joy and rapture.',
    brahmavihara: 'metta',
    rootedIn: 'body sensation',
  },
  {
    number: 2,
    name: 'Second Jhana',
    traditional:
      'Rapture, pleasure, one-pointedness (thought subsides)',
    feltState:
      'The friendliness becomes effortless and self-sustaining; the whole body is vibrating with resonant, appreciative joy at everything that exists. Piti becomes huge and sparkling.',
    brahmavihara: 'mudita',
    rootedIn: 'subtle state',
  },
  {
    number: 3,
    name: 'Third Jhana',
    traditional:
      'Pleasure fades, pure equanimous happiness remains',
    feltState:
      'The joy settles into a deep, radiant, active wish to end suffering — karuna now dominates. The heart is wide open, luminous, and gently oscillating outward in all directions with zero contraction. Sparkling.',
    brahmavihara: 'karuna',
    rootedIn: 'contact state',
  },
  {
    number: 4,
    name: 'Fourth Jhana',
    traditional: 'Equanimity and one-pointedness',
    feltState:
      'Upekkha arises naturally as the container. The mind becomes vast, cool, and perfectly balanced, holding the infinite metta, karuna, and mudita without being moved.',
    brahmavihara: 'upekkha',
    rootedIn: 'equanimity',
  },
  {
    number: 'beyond',
    name: 'Beyond Fourth Jhana',
    traditional: 'Arupa jhanas / cessation',
    feltState:
      'All four brahmaviharas simultaneously stable and boundless — the sense of a centre disappears. Heart = space = universe. This is the Brahmavihara-nibbana / ceto-vimutti.',
    brahmavihara: 'all',
    rootedIn: 'unified liberation',
  },
];

/**
 * Practice Phases — The stepwise cultivation protocol
 *
 * Phases 2-5 form a loop: first practice each brahmavihara alone,
 * then add upekkha overlay ("b" phases) when ready.
 *
 * Data sourced from "Enlightenment Now" PDF practice detail table.
 */
export const practicePhases = [
  {
    phase: 1,
    title: 'Breath concentration through full fourth jhana',
    purpose: 'Concentration and equanimity base',
    isLoop: false,
  },
  {
    phase: 2,
    title:
      'Metta alone — take it through all four jhanas, make it boundless',
    purpose:
      'Golden, radiant friendliness that fills the universe',
    isLoop: true,
  },
  {
    phase: 3,
    title: 'Karuna alone — four jhanas, boundless',
    purpose:
      'Bright, active, sorrow-free resolve to end suffering',
    isLoop: true,
  },
  {
    phase: 4,
    title: 'Mudita alone — four jhanas, boundless',
    purpose: 'Sparkling, effervescent joy at all happiness',
    isLoop: true,
  },
  {
    phase: 5,
    title:
      'Upekkha alone — pure fourth jhana equanimity, boundless',
    purpose:
      'Vast, cool, bounded, stable, luminous space that holds everything',
    isLoop: true,
  },
  {
    phase: 6,
    title:
      'Combine all four simultaneously, with upekkha as the container',
    purpose:
      'The wheel begins to spin — heart becomes the universe',
    isLoop: false,
  },
  {
    phase: 7,
    title:
      'Drop the container — let the four fuse and the sense of centre dissolve',
    purpose:
      'Brahmavihara-nibbana / stream-entry territory',
    isLoop: false,
  },
  {
    phase: 8,
    title:
      'Formless jhanas through cessation (if path continues)',
    purpose: 'Progressive refinement of the unconditioned',
    isLoop: false,
  },
];
