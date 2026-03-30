import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ── Grid dimensions ─────────────────────────────────────────────────
const GRID = 64;        // vertices per side
const EXTENT = 6;       // world-space half-width
const STEP = (EXTENT * 2) / (GRID - 1);

// ── Helpers ─────────────────────────────────────────────────────────

/** Compute a height value for the potential landscape. */
function potentialHeight(x, z, t, unified) {
  if (unified) {
    // Coherent, beautiful pattern — a single smooth attractor basin.
    const r = Math.sqrt(x * x + z * z);
    return (
      -1.2 * Math.exp(-r * r * 0.12) +
      0.15 * Math.sin(r * 1.8 - t * 0.4) * Math.exp(-r * 0.15)
    );
  }
  // Chaotic multi-well potential.
  const h1 = -0.8 * Math.exp(-((x - 1.5) ** 2 + (z - 1) ** 2) * 0.3);
  const h2 = -0.6 * Math.exp(-((x + 2) ** 2 + (z + 1.5) ** 2) * 0.25);
  const h3 = 0.9 * Math.exp(-((x + 0.5) ** 2 + (z - 2) ** 2) * 0.35);
  const h4 = 0.5 * Math.exp(-((x - 2) ** 2 + (z + 2) ** 2) * 0.4);
  const wave = 0.08 * Math.sin(x * 1.5 + t * 0.3) * Math.cos(z * 1.2 + t * 0.25);
  return h1 + h2 + h3 + h4 + wave;
}

/** Map height to a colour for the inner V₀ surface (proto-valence). */
function valenceColor(h, target) {
  // Low = warm (attraction), high = cool (repulsion).
  const t = THREE.MathUtils.clamp((h + 1.2) / 2.4, 0, 1); // roughly 0–1
  const warm = new THREE.Color('#ff6633');
  const cool = new THREE.Color('#5566ee');
  target.copy(warm).lerp(cool, t);
  return target;
}

// ── Outer wireframe mesh (V) ────────────────────────────────────────
function OuterSurface({ unified }) {
  const meshRef = useRef();
  const geoRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(EXTENT * 2, EXTENT * 2, GRID - 1, GRID - 1);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame((state) => {
    const geo = meshRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const ix = i % GRID;
      const iz = Math.floor(i / GRID);
      const x = -EXTENT + ix * STEP;
      const z = -EXTENT + iz * STEP;
      pos.setY(i, potentialHeight(x, z, t, unified));
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0.05, 0]}>
      <meshBasicMaterial
        color="#aabbcc"
        wireframe
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Inner coloured surface (V₀) ────────────────────────────────────
function InnerSurface({ unified }) {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(EXTENT * 2, EXTENT * 2, GRID - 1, GRID - 1);
    geo.rotateX(-Math.PI / 2);
    // Add vertex colours.
    const count = geo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const geo = meshRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position;
    const col = geo.attributes.color;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < pos.count; i++) {
      const ix = i % GRID;
      const iz = Math.floor(i / GRID);
      const x = -EXTENT + ix * STEP;
      const z = -EXTENT + iz * STEP;
      const h = potentialHeight(x, z, t, unified);
      pos.setY(i, h - 0.02); // slightly below the wireframe
      valenceColor(h, tmpColor);
      col.setXYZ(i, tmpColor.r, tmpColor.g, tmpColor.b);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.65}
        emissive="#221100"
        emissiveIntensity={0.4}
        roughness={0.5}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ── Gradient-following particle streams ─────────────────────────────
function GradientParticles({ unified }) {
  const meshRef = useRef();
  const count = 400;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    // Each particle: [x, z, phase]
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * EXTENT * 2,
        z: (Math.random() - 0.5) * EXTENT * 2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
      });
    }
    return arr;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffddaa',
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const geometry = useMemo(() => new THREE.SphereGeometry(0.03, 4, 4), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const dt = 0.016; // approx frame time
    const eps = 0.05;

    for (let i = 0; i < count; i++) {
      const p = particles[i];

      // Compute gradient via finite differences.
      const hc = potentialHeight(p.x, p.z, t, unified);
      const hx = potentialHeight(p.x + eps, p.z, t, unified);
      const hz = potentialHeight(p.x, p.z + eps, t, unified);
      const gx = (hx - hc) / eps;
      const gz = (hz - hc) / eps;

      // Move downhill (negative gradient).
      p.x -= gx * p.speed * dt * 2;
      p.z -= gz * p.speed * dt * 2;

      // Wrap around if out of bounds.
      if (Math.abs(p.x) > EXTENT || Math.abs(p.z) > EXTENT) {
        p.x = (Math.random() - 0.5) * EXTENT * 2;
        p.z = (Math.random() - 0.5) * EXTENT * 2;
      }

      const y = hc + 0.08;
      dummy.position.set(p.x, y, p.z);
      dummy.scale.setScalar(0.8 + 0.4 * Math.sin(t * 3 + p.phase));
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
function SceneContent({ unified }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffccaa" />

      <OuterSurface unified={unified} />
      <InnerSurface unified={unified} />
      <GradientParticles unified={unified} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.9}
          intensity={0.6}
          mipmapBlur
        />
      </EffectComposer>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.2}
        enableZoom
        enablePan={false}
        minDistance={4}
        maxDistance={18}
        maxPolarAngle={Math.PI * 0.55}
      />
    </>
  );
}

/**
 * V / V₀ dual-aspect potential landscape.
 *
 * @param {boolean} unified - when true, the landscape reorganises into a coherent pattern
 * @param {object}  style   - optional wrapper styles
 */
function ConsciousnessField({ unified = false, style }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#080810', ...style }}>
      <Canvas
        camera={{ position: [6, 5, 6], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#080810']} />
        <SceneContent unified={unified} />
      </Canvas>
    </div>
  );
}

export default React.memo(ConsciousnessField);
