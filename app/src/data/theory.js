/**
 * V/V0 Consciousness Theory Data
 *
 * A dual-aspect potential framework for consciousness:
 * V as physical potential, V0 as proto-valence, and the emergence of unified subjects.
 *
 * Data sourced from "The Universe Has an Inside" PDF.
 */

export const theoryOverview = {
  title: 'The Universe Has an Inside',
  subtitle:
    'A Dual-Aspect Potential Framework for Consciousness',
  coreProposition:
    'Every physical potential V(x) has an intrinsic subjective aspect V\u2080(x), where V\u2080 is proto-valence: a minimal internal tone of attraction or aversion corresponding exactly to the gradients and curvatures of V. Consciousness arises not from V\u2080 alone but from the integration of V\u2080 into a unified manifold. The brain does not generate consciousness out of nothing \u2014 it gathers, binds, shapes, and amplifies something that already exists in the basic structure of reality.',
};

export const keyConcepts = [
  {
    id: 'proto-valence',
    title: 'Proto-Valence (V\u2080)',
    description:
      'The simplest possible internal correlate of the asymmetries built into the universe\'s potential fields. A minimal internal tone of "better/worse," "toward/away" \u2014 not cognition, emotion, or representation, but the internal face of a gradient. V is the external potential (what physics measures); V\u2080 is the internal tone (what it feels like for a system).',
  },
  {
    id: 'unified-v0-domain',
    title: 'Unified V\u2080-Domain',
    description:
      'A conscious subject is a system where all proto-valence fuses into one interior world. A rock has countless micro-asymmetries, but they are not integrated. A living organism has a boundary, global coordination, integrates all internal signals, and organizes internal states into a stable whole. Life binds proto-valence into a unified interior; brains sculpt that interior into a rich, dynamic world.',
  },
  {
    id: 'three-conditions',
    title: 'Three Conditions for Consciousness',
    description:
      'A physical system is a conscious subject if and only if it satisfies three conditions: strong valence connectivity (all internal tones globally connected), recursive V/V\u2080 closure (feelings shape actions that shape feelings), and attractor cohesion (all components share the same internal "map" of what matters).',
  },
  {
    id: 'dual-aspect-monism',
    title: 'Dual-Aspect Monism',
    description:
      'V and V\u2080 are two aspects of the same potential structure. V is the external aspect; V\u2080 is the internal aspect. This identity preserves all physics and introduces no new ontological categories. No new substances, no new properties, no bridging laws \u2014 just one structure with two sides, like concave/convex or inside/outside.',
  },
  {
    id: 'feelings-as-potentials',
    title: 'Feelings as Potential Landscapes',
    description:
      'Feelings are not mysterious extras added to biology. They are the internal side of potential landscapes in the brain. The brain is not a computer \u2014 it is a valence reactor, continually reshaping its internal potentials and their felt expressions. Purpose is simply what it looks like from the inside when a system rides along its own potential landscape.',
  },
];

export const feelingsMap = [
  {
    feeling: 'Desire',
    potential: 'Sliding into a low-energy attractor',
  },
  {
    feeling: 'Aversion',
    potential: 'Rising out of a high barrier',
  },
  {
    feeling: 'Fear',
    potential: 'Steep gradients',
  },
  {
    feeling: 'Curiosity',
    potential: 'Shallow, branching basins',
  },
  {
    feeling: 'Satisfaction',
    potential: 'Reaching a stable minimum',
  },
  {
    feeling: 'Suffering',
    potential:
      'Being trapped in a high-gradient, high-instability region',
  },
  {
    feeling: 'Boredom',
    potential: 'A flat landscape',
  },
  {
    feeling: 'Enlightenment',
    potential: 'Flattening or dissolving dominant attractors',
  },
  {
    feeling: 'Addiction',
    potential:
      'Pathological attractors that override normal gradients',
  },
];

/**
 * Formal Conditions for a Unified V0-Domain (A Conscious Subject)
 *
 * Three necessary and sufficient conditions, with LaTeX-like formula representations.
 */
export const conditions = [
  {
    id: 'connectivity',
    name: 'Strong Valence Connectivity',
    description:
      'The system\'s internal "tones" (V\u2080 degrees of freedom) must be globally connected. All parts of the system participate in a single V\u2080 field. The brain satisfies this; rocks do not. Split-brain patients lose it, creating two subjects in one skull.',
    formula:
      'G_\\Sigma = (N, E) \\text{ is strongly connected} \\quad \\text{where } e_{ij} \\in E \\iff \\frac{\\partial V_\\Sigma}{\\partial x_i} \\text{ depends on } \\frac{\\partial V_\\Sigma}{\\partial x_j}',
  },
  {
    id: 'recursive-closure',
    name: 'Recursive V/V\u2080 Closure',
    description:
      'The system must use its own internal states to change itself. V\u2080 modifies physical dynamics, and physical dynamics modify V\u2080, in a global and persistent loop. This recursive structure produces emotion, motivation, agency, self-regulation, and teleological behavior.',
    formula:
      '\\mathcal{F}_\\Sigma : V_{0,\\Sigma}(t) \\mapsto V_{0,\\Sigma}(t + \\Delta t) \\quad \\text{where } V_0 \\leftrightarrow V \\text{ recursively}',
  },
  {
    id: 'attractor-cohesion',
    name: 'Attractor Cohesion',
    description:
      'All degrees of freedom must share the same motivational architecture, the same preference landscape, the same internal "world." Everything in the system lives inside the same set of goals, drives, and stable states. This is why a human is one subject but an ant colony is not.',
    formula:
      'A(x_i) = A(x_j) \\quad \\forall \\, i, j \\quad \\text{(all components share one attractor landscape)}',
  },
];
