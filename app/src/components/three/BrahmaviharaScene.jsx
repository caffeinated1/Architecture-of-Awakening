import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import ParticleField from './ParticleField';

// ── Domain definitions ──────────────────────────────────────────────
const DOMAINS = [
  { name: 'Mettā',   color: '#FFB347', pattern: 'radiate', radius: 4 },
  { name: 'Muditā',  color: '#7BF5C0', pattern: 'rise',    radius: 4.5 },
  { name: 'Karuṇā',  color: '#FF6B8A', pattern: 'orbit',   radius: 5 },
  { name: 'Upekkhā', color: '#8BB8E8', pattern: 'contain', radius: 7 },
];

// ── Heart centre sphere ─────────────────────────────────────────────
function HeartCenter({ intensity }) {
  const ref = useRef();

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#fff0d0'),
        emissive: new THREE.Color('#ffcc66'),
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.1,
      }),
    [],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 1 + 0.08 * Math.sin(state.clock.elapsedTime * 1.2);
    const s = pulse * (0.6 + intensity * 0.4);
    ref.current.scale.setScalar(s);
    ref.current.material.emissiveIntensity = 1.2 + intensity * 1.5;
  });

  return (
    <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.2}>
      <mesh ref={ref} material={material}>
        <sphereGeometry args={[0.35, 32, 32]} />
      </mesh>
    </Float>
  );
}

// ── Inner scene (rendered inside the Canvas) ────────────────────────
function SceneContent({ activeIndex = 0, intensity = 1 }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffeecc" />

      {/* Heart centre */}
      <HeartCenter intensity={intensity} />

      {/* Four brahmavihāra particle fields */}
      {DOMAINS.map((d, i) => {
        const domainIndex = i + 1; // 1-based
        const isActive = activeIndex === 0 || activeIndex === domainIndex;
        const fieldOpacity = isActive ? 0.7 * intensity : 0.1;
        const fieldSpeed = isActive ? 0.3 : 0.08;
        const fieldCount = isActive ? (isMobile ? 800 : 2000) : (isMobile ? 300 : 600);

        return (
          <ParticleField
            key={d.name}
            count={fieldCount}
            color={d.color}
            radius={d.radius}
            speed={fieldSpeed}
            pattern={d.pattern}
            opacity={fieldOpacity}
          />
        );
      })}

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.2 + intensity * 0.8}
          mipmapBlur
        />
      </EffectComposer>

      {/* Controls */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.4}
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
}

/**
 * Main four-domain 3D brahmavihāra visualisation.
 *
 * @param {number} activeIndex - 0 = all, 1 = Mettā, 2 = Muditā, 3 = Karuṇā, 4 = Upekkhā
 * @param {number} intensity   - 0-1 master intensity
 * @param {object} style       - optional inline styles for the wrapper div
 */
function BrahmaviharaScene({ activeIndex = 0, intensity = 1, style }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#050508', ...style }}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050508']} />
        <SceneContent activeIndex={activeIndex} intensity={intensity} />
      </Canvas>
    </div>
  );
}

export default React.memo(BrahmaviharaScene);
