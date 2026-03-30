import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ── Domain colours ──────────────────────────────────────────────────
const DOMAIN_COLORS = [
  new THREE.Color('#FFB347'), // Mettā
  new THREE.Color('#7BF5C0'), // Muditā
  new THREE.Color('#FF6B8A'), // Karuṇā
  new THREE.Color('#8BB8E8'), // Upekkhā
];

const SEPARATED_POSITIONS = [
  new THREE.Vector3(-2.2, 0, -1.2),
  new THREE.Vector3(2.2, 0, -1.2),
  new THREE.Vector3(-2.2, 0, 1.2),
  new THREE.Vector3(2.2, 0, 1.2),
];

const CENTER = new THREE.Vector3(0, 0, 0);

// ── Individual energy sphere ────────────────────────────────────────
function EnergySphere({ color, separatedPos, merged, intensity, index }) {
  const ref = useRef();
  const currentPos = useMemo(() => separatedPos.clone(), [separatedPos]);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;

    // Lerp position toward centre when merged.
    targetPos.copy(merged ? CENTER : separatedPos);
    currentPos.lerp(targetPos, 0.03);
    ref.current.position.copy(currentPos);

    // When merged, cycle through all 4 colours.
    if (merged) {
      const cycle = (t * 0.5 + index * 0.25) % 1;
      const ci = Math.floor(cycle * 4) % 4;
      const nextCi = (ci + 1) % 4;
      const frac = (cycle * 4) % 1;
      tmpColor.copy(DOMAIN_COLORS[ci]).lerp(DOMAIN_COLORS[nextCi], frac);
      // Blend towards white/gold at high intensity.
      tmpColor.lerp(new THREE.Color('#fffbe6'), intensity * 0.5);
      ref.current.material.color.copy(tmpColor);
      ref.current.material.emissive.copy(tmpColor);
      ref.current.material.emissiveIntensity = 1.5 + intensity;

      // Pulsate scale.
      const pulse = 0.9 + 0.15 * Math.sin(t * 2 + index);
      ref.current.scale.setScalar(pulse * (0.7 + intensity * 0.5));
    } else {
      ref.current.material.color.copy(color);
      ref.current.material.emissive.copy(color);
      ref.current.material.emissiveIntensity = 0.8 * intensity;
      const pulse = 1 + 0.05 * Math.sin(t * 1.5 + index * 2);
      ref.current.scale.setScalar(pulse);
    }

    ref.current.material.opacity = merged ? 0.95 : 0.75 * intensity;
  });

  return (
    <Float speed={1.5} floatIntensity={merged ? 0.1 : 0.3} rotationIntensity={0.1}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.75}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

// ── Merged centre glow ──────────────────────────────────────────────
function MergedGlow({ merged, intensity }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const targetScale = merged ? 1.2 + intensity * 0.6 : 0.01;
    const current = ref.current.scale.x;
    const next = THREE.MathUtils.lerp(current, targetScale, 0.04);
    ref.current.scale.setScalar(next);

    ref.current.material.opacity = merged ? 0.4 + 0.15 * Math.sin(t * 1.8) : 0;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#fffbe6"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ── Explosion particles ─────────────────────────────────────────────
function ExplosionParticles({ merged, intensity }) {
  const meshRef = useRef();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = isMobile ? 1000 : 3000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const wasmergedRef = useRef(false);
  const birthTimeRef = useRef(0);

  const seeds = useMemo(() => {
    const a = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) a[i] = Math.random();
    return a;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#fffbe6',
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const geometry = useMemo(() => new THREE.SphereGeometry(0.03, 4, 4), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Detect merge moment.
    if (merged && !wasmergedRef.current) {
      birthTimeRef.current = t;
    }
    wasmergedRef.current = merged;

    const age = merged ? t - birthTimeRef.current : 0;

    for (let i = 0; i < count; i++) {
      const i4 = i * 4;
      const sx = seeds[i4];
      const sy = seeds[i4 + 1];
      const sz = seeds[i4 + 2];
      const sp = seeds[i4 + 3];

      if (!merged) {
        // Hide particles off-screen.
        dummy.position.set(0, -100, 0);
        dummy.scale.setScalar(0);
      } else {
        // Explosion: burst outward then settle into a gentle orbit.
        const burstPhase = Math.min(age * 0.8, 1); // 0->1 over ~1.25s
        const theta = sx * Math.PI * 2;
        const phi = Math.acos(2 * sy - 1);

        // Initial burst radius, then settle.
        const burstR = burstPhase * (3 + sp * 5) * intensity;
        const settleR = 3 + sp * 3;
        const r = THREE.MathUtils.lerp(burstR, settleR, Math.min(age * 0.15, 1));

        // Add gentle orbit after burst.
        const orbitAngle = t * 0.2 * (0.5 + sz) + theta;
        const x = r * Math.sin(phi) * Math.cos(orbitAngle);
        const y = r * Math.sin(phi) * Math.sin(orbitAngle);
        const z = r * Math.cos(phi);

        dummy.position.set(x, y, z);

        // Colour-cycle via scale pulsation.
        const life = Math.min(age * 0.5, 1);
        const s = life * (0.5 + 0.5 * Math.sin(t * 3 + sp * 10));
        dummy.scale.setScalar(Math.max(s, 0.01));

        // Cycle the particle material colour slowly.
        const ci = Math.floor((t * 0.3 + sp) * 4) % 4;
        material.color.copy(DOMAIN_COLORS[ci]).lerp(new THREE.Color('#fffbe6'), 0.5);
      }

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

// ── Inner scene ─────────────────────────────────────────────────────
function SceneContent({ merged, intensity }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={merged ? 2 : 0.5} color="#fffbe6" />

      {/* Four energy spheres */}
      {DOMAIN_COLORS.map((color, i) => (
        <EnergySphere
          key={i}
          color={color}
          separatedPos={SEPARATED_POSITIONS[i]}
          merged={merged}
          intensity={intensity}
          index={i}
        />
      ))}

      {/* Central glow when merged */}
      <MergedGlow merged={merged} intensity={intensity} />

      {/* Explosion particles */}
      <ExplosionParticles merged={merged} intensity={intensity} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          intensity={merged ? 2.0 + intensity * 1.5 : 0.6}
          mipmapBlur
        />
      </EffectComposer>

      <OrbitControls
        autoRotate
        autoRotateSpeed={merged ? 0.8 : 0.3}
        enableZoom
        enablePan={false}
        minDistance={4}
        maxDistance={20}
      />
    </>
  );
}

/**
 * Liberation visualisation — four brahmavihāra spheres merging into one.
 *
 * @param {boolean} merged    - when true, spheres converge and explode outward
 * @param {number}  intensity - 0-1 master intensity / energy level
 * @param {object}  style     - optional wrapper styles
 */
function UnifiedField({ merged = false, intensity = 1, style }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#030306', ...style }}>
      <Canvas
        camera={{ position: [0, 2, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#030306']} />
        <SceneContent merged={merged} intensity={intensity} />
      </Canvas>
    </div>
  );
}

export default React.memo(UnifiedField);
