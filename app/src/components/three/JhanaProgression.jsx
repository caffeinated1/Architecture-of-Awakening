import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ── Jhāna ring definitions (bottom → top) ──────────────────────────
const JHANAS = [
  { label: '1st Jhāna · Mettā',   color: '#FFB347', y: -3.0, tubeRadius: 0.18, ringRadius: 2.0 },
  { label: '2nd Jhāna · Muditā',  color: '#7BF5C0', y: -1.0, tubeRadius: 0.14, ringRadius: 1.8 },
  { label: '3rd Jhāna · Karuṇā',  color: '#FF6B8A', y:  1.0, tubeRadius: 0.10, ringRadius: 1.6 },
  { label: '4th Jhāna · Upekkhā', color: '#8BB8E8', y:  3.0, tubeRadius: 0.06, ringRadius: 2.4 },
];

// ── Single jhāna ring ───────────────────────────────────────────────
function JhanaRing({ color, y, tubeRadius, ringRadius, active, index }) {
  const ref = useRef();

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(color),
        emissiveIntensity: active ? 1.2 : 0.25,
        transparent: true,
        opacity: active ? 0.85 : 0.25,
        roughness: 0.35,
        metalness: 0.3,
        side: THREE.DoubleSide,
      }),
    [color, active],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Gentle wobble unique per ring.
    ref.current.rotation.x = Math.sin(t * 0.3 + index) * 0.06;
    ref.current.rotation.z = Math.cos(t * 0.25 + index * 1.5) * 0.04;
    // Pulse scale when active.
    if (active) {
      const pulse = 1 + 0.03 * Math.sin(t * 1.5 + index);
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={1.0 + index * 0.3} floatIntensity={0.15} rotationIntensity={0.05}>
      <mesh ref={ref} position={[0, y, 0]} material={material}>
        <torusGeometry args={[ringRadius, tubeRadius, 24, 64]} />
      </mesh>
    </Float>
  );
}

// ── Energy beam particles flowing upward between rings ──────────────
function EnergyStream({ active }) {
  const meshRef = useRef();
  const count = 300;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) a[i] = Math.random();
    return a;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const geometry = useMemo(() => new THREE.SphereGeometry(0.02, 4, 4), []);

  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = seeds[i3 + 2] * Math.PI * 2;
      const life = (t * 0.4 + phase) % (Math.PI * 2);
      const frac = life / (Math.PI * 2);

      const angle = seeds[i3] * Math.PI * 2 + t * 0.2;
      const r = 0.3 + seeds[i3 + 1] * 0.5;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = -4 + frac * 8; // bottom to top

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.5 + 0.5 * Math.sin(frac * Math.PI));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
}

// ── Inner scene ─────────────────────────────────────────────────────
function SceneContent({ activeJhana = 0, progress = 1 }) {
  const allActive = activeJhana === 0;

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 3]} intensity={1.0} color="#ffffff" />
      <pointLight position={[0, -5, -3]} intensity={0.4} color="#ffddaa" />

      {JHANAS.map((j, i) => {
        const jhanaNum = i + 1;
        const active = allActive || activeJhana === jhanaNum;
        // When a specific jhana is targeted, lerp progress to scale the active ring.
        const adjustedY = j.y * (0.8 + progress * 0.2);

        return (
          <JhanaRing
            key={j.label}
            color={j.color}
            y={adjustedY}
            tubeRadius={j.tubeRadius}
            ringRadius={j.ringRadius}
            active={active}
            index={i}
          />
        );
      })}

      {/* Upward energy when all rings are active */}
      <EnergyStream active={allActive && progress > 0.2} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.8}
          intensity={1.0}
          mipmapBlur
        />
      </EffectComposer>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom
        enablePan={false}
        minDistance={5}
        maxDistance={18}
      />
    </>
  );
}

/**
 * Vertical jhāna progression scene.
 *
 * @param {number} activeJhana - 0 = all, 1-4 = focus single jhāna
 * @param {number} progress    - 0-1 animation progress
 * @param {object} style       - optional wrapper styles
 */
function JhanaProgression({ activeJhana = 0, progress = 1, style }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#050508', ...style }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050508']} />
        <SceneContent activeJhana={activeJhana} progress={progress} />
      </Canvas>
    </div>
  );
}

export default React.memo(JhanaProgression);
