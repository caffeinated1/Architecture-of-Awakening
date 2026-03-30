import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PATTERN_RADIATE = 'radiate';
const PATTERN_RISE = 'rise';
const PATTERN_ORBIT = 'orbit';
const PATTERN_CONTAIN = 'contain';

/**
 * Reusable instanced particle system.
 *
 * @param {number}  count   - number of particles (default 2000)
 * @param {string}  color   - hex colour string
 * @param {number}  radius  - bounding radius (default 5)
 * @param {number}  speed   - animation speed multiplier (default 0.3)
 * @param {string}  pattern - "radiate" | "rise" | "orbit" | "contain"
 * @param {number}  opacity - base opacity (default 0.7)
 */
function ParticleField({
  count = 2000,
  color = '#ffffff',
  radius = 5,
  speed = 0.3,
  pattern = PATTERN_RADIATE,
  opacity = 0.7,
}) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-compute per-particle seeds so motion is deterministic but varied.
  const seeds = useMemo(() => {
    const arr = new Float32Array(count * 4); // x-seed, y-seed, z-seed, phase
    for (let i = 0; i < count; i++) {
      const i4 = i * 4;
      arr[i4] = Math.random();
      arr[i4 + 1] = Math.random();
      arr[i4 + 2] = Math.random();
      arr[i4 + 3] = Math.random() * Math.PI * 2;
    }
    return arr;
  }, [count]);

  // Material – additive blending gives a soft glow.
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, opacity],
  );

  // Small sphere geometry shared by all instances.
  const geometry = useMemo(() => new THREE.SphereGeometry(0.025, 6, 6), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed;

    for (let i = 0; i < count; i++) {
      const i4 = i * 4;
      const sx = seeds[i4];
      const sy = seeds[i4 + 1];
      const sz = seeds[i4 + 2];
      const phase = seeds[i4 + 3];

      let x = 0;
      let y = 0;
      let z = 0;
      let scale = 1;

      switch (pattern) {
        case PATTERN_RADIATE: {
          // Particles flow outward from centre then reset.
          const life = (t * 0.5 + phase) % (Math.PI * 2);
          const frac = life / (Math.PI * 2); // 0 -> 1
          const r = frac * radius;
          // Distribute direction on a sphere using seed values.
          const theta = sx * Math.PI * 2;
          const phi = Math.acos(2 * sy - 1);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
          // Fade out as they travel.
          scale = 1 - frac * 0.6;
          break;
        }

        case PATTERN_RISE: {
          // Rise upward with sparkle shimmer.
          const life = (t * 0.4 + phase) % (Math.PI * 2);
          const frac = life / (Math.PI * 2);
          const spread = radius * 0.4;
          x = (sx - 0.5) * spread + Math.sin(t * 2 + phase) * 0.15;
          z = (sz - 0.5) * spread + Math.cos(t * 2 + phase) * 0.15;
          y = frac * radius * 1.5 - radius * 0.3;
          // Sparkle: scale oscillates.
          scale = 0.6 + 0.6 * Math.abs(Math.sin(t * 4 + phase * 10));
          break;
        }

        case PATTERN_ORBIT: {
          // Flow downward then curve back up in arcs — compassionate embrace.
          const life = (t * 0.35 + phase) % (Math.PI * 2);
          const arcRadius = radius * (0.3 + sx * 0.7);
          // Vertical: sine arc, starts high, dips, returns.
          y = Math.sin(life) * radius * 0.6;
          // Horizontal orbit.
          const angle = life * (0.5 + sz) + sy * Math.PI * 2;
          x = Math.cos(angle) * arcRadius;
          z = Math.sin(angle) * arcRadius;
          scale = 0.7 + 0.3 * Math.abs(Math.cos(life));
          break;
        }

        case PATTERN_CONTAIN: {
          // Slow orbit on a large spherical shell — equanimity.
          const theta = sx * Math.PI * 2 + t * 0.15 * (0.5 + sz);
          const phi = Math.acos(2 * sy - 1);
          const r = radius * (0.92 + 0.08 * Math.sin(t * 0.5 + phase));
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
          scale = 0.5 + 0.2 * Math.sin(t + phase);
          break;
        }

        default:
          break;
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(Math.max(scale, 0.05));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
}

export default React.memo(ParticleField);
