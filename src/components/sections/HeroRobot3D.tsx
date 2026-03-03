import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei"
import { LoopRepeat } from "three"
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js"
import type { RootState } from "@react-three/fiber"
import type {
  Group,
  Material,
  AnimationClip,
  Mesh,
  BufferGeometry,
  ColorRepresentation,
  AnimationAction,
  AnimationMixer,
} from "three"

type Props = {
  modelUrl: string
  className?: string
}

const BRAND_BLUE = "#28509E"
const LIGHT_BLUE = "#7FB6FF"
const SOFT_GREY = "#D6DFEA"
const GRADIENT_BLUES: string[] = ["#0EA5E9", "#3B82F6", "#2563EB", "#6366F1", "#1D4ED8"]

type MeshInfo = {
  mesh: Mesh
  score: number
  centerY: number
}

function getGeometry(mesh: Mesh): BufferGeometry | null {
  const g = (mesh.geometry ?? null) as BufferGeometry | null
  return g
}

function getMeshInfos(root: Group): MeshInfo[] {
  const infos: MeshInfo[] = []

  root.traverse((obj) => {
    const mesh = obj as unknown as Mesh
    if (!mesh.isMesh) return

    const geo = getGeometry(mesh)
    if (!geo) return

    geo.computeBoundingBox()
    const bb = geo.boundingBox
    if (!bb) return

    const size = bb.max.clone().sub(bb.min)
    const score = size.x * size.y * size.z
    const centerY = (bb.max.y + bb.min.y) / 2

    infos.push({ mesh, score, centerY })
  })

  infos.sort((a, b) => b.score - a.score)
  return infos
}

function setMatColor(
  mat0: Material,
  color: ColorRepresentation,
  emissive?: ColorRepresentation,
  emissiveIntensity?: number
) {
  const mat = mat0 as unknown as {
    color?: { set: (c: ColorRepresentation) => void }
    emissive?: { set: (c: ColorRepresentation) => void }
    emissiveIntensity?: number
    metalness?: number
    roughness?: number
    needsUpdate?: boolean
  }

  if (mat.color?.set) mat.color.set(color)

  if (emissive && mat.emissive?.set) {
    mat.emissive.set(emissive)
    mat.emissiveIntensity = emissiveIntensity ?? 0.08
  }

  if (typeof mat.metalness === "number") mat.metalness = 0.06
  if (typeof mat.roughness === "number") mat.roughness = 0.55

  mat.needsUpdate = true
}

function styleRobotAndSymbols(root: Group) {
  const infos = getMeshInfos(root)
  if (infos.length === 0) return { symbolMeshes: [] as Mesh[] }

  const BODY_COUNT = 3
  const ACCENT_COUNT = 6

  const body = new Set(infos.slice(0, BODY_COUNT).map((x) => x.mesh.uuid))
  const accentCandidates = new Set(infos.slice(BODY_COUNT, BODY_COUNT + ACCENT_COUNT).map((x) => x.mesh.uuid))

  const smallStart = Math.min(infos.length, 14)
  const small = new Set(infos.slice(smallStart).map((x) => x.mesh.uuid))

  const ys = infos.map((x) => x.centerY)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const yRange = Math.max(0.0001, maxY - minY)
  const headLine = minY + yRange * 0.72
  const feetLine = minY + yRange * 0.22

  root.traverse((obj) => {
    const mesh = obj as unknown as Mesh
    if (!mesh.isMesh || !mesh.material) return

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const info = infos.find((x) => x.mesh.uuid === mesh.uuid)
    const y = info?.centerY ?? 0

    if (body.has(mesh.uuid)) {
      mats.forEach((m) => setMatColor(m, BRAND_BLUE, BRAND_BLUE, 0.05))
      return
    }

    if (small.has(mesh.uuid)) {
      mats.forEach((m) => setMatColor(m, GRADIENT_BLUES[2], GRADIENT_BLUES[2], 0.22))
      return
    }

    const isHeadOrFeet = y >= headLine || y <= feetLine
    const isAccent = accentCandidates.has(mesh.uuid)

    if (isHeadOrFeet || isAccent) {
      mats.forEach((m, idx) => setMatColor(m, idx % 2 === 0 ? LIGHT_BLUE : SOFT_GREY))
    }
  })

  const symbolMeshes = infos.filter((x) => small.has(x.mesh.uuid)).map((x) => x.mesh)
  return { symbolMeshes }
}

function RobotModel({ url }: { url: string }) {
  const gltf = useGLTF(url) as unknown as { scene: Group; animations: AnimationClip[] }
  const scene = useMemo(() => skeletonClone(gltf.scene) as Group, [gltf.scene])

  const pivotRef = useRef<Group>(null)
  const modelRef = useRef<Group>(null)

  const anim = useAnimations(gltf.animations, modelRef) as unknown as {
    actions: Record<string, AnimationAction | undefined>
    mixer: AnimationMixer
  }

  const { actions, mixer } = anim
  const symbolMeshesRef = useRef<Mesh[]>([])

  useEffect(() => {
    const { symbolMeshes } = styleRobotAndSymbols(scene)
    symbolMeshesRef.current = symbolMeshes
  }, [scene])

  useEffect(() => {
    const all = Object.values(actions).filter((a): a is AnimationAction => Boolean(a))
    if (all.length === 0) return

    all.forEach((a) => {
      a.reset()
      a.setLoop(LoopRepeat, Infinity)
      a.clampWhenFinished = false
      a.fadeIn(0.15)
      a.timeScale = 1.0
      a.play()
    })

    return () => {
      all.forEach((a) => a.stop())
    }
  }, [actions])

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime()
    mixer.update(delta)

    if (pivotRef.current) {
      pivotRef.current.rotation.y = t * 0.55
    }

    const symbols = symbolMeshesRef.current
    if (symbols.length === 0) return

    const idxA = Math.floor((t * 1.6) % GRADIENT_BLUES.length)
    const idxB = (idxA + 1) % GRADIENT_BLUES.length
    const blend = (Math.sin(t * 2.2) + 1) / 2
    const c = blend < 0.5 ? GRADIENT_BLUES[idxA] : GRADIENT_BLUES[idxB]

    symbols.forEach((mesh, i) => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const pulse = 0.16 + 0.08 * Math.sin(t * 2.8 + i * 0.35)

      mats.forEach((m) => {
        const mm = m as unknown as {
          emissive?: { set: (x: string) => void }
          emissiveIntensity?: number
          color?: { set: (x: string) => void }
          needsUpdate?: boolean
        }

        if (mm.color?.set) mm.color.set(c)
        if (mm.emissive?.set) mm.emissive.set(c)
        mm.emissiveIntensity = pulse
        mm.needsUpdate = true
      })
    })
  })

  // ✅ manual scale/position to always fit (replaces Bounds)
  return (
    <group ref={pivotRef}>
      <group ref={modelRef} position={[0, -0.9, 0]} scale={1.25}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

function LoadingFallback() {
  return <div className="h-full w-full bg-transparent" />
}

export default function HeroRobot3D({ modelUrl, className }: Props) {
  const [webglOk, setWebglOk] = useState(true)
  const cleanupRef = useRef<(() => void) | null>(null)

  const onCreated = (state: RootState) => {
    const canvas = state.gl.domElement

    const handleLost = (e: Event) => {
      e.preventDefault()
      setWebglOk(false)
    }

    canvas.addEventListener("webglcontextlost", handleLost, false)
    cleanupRef.current = () => {
      canvas.removeEventListener("webglcontextlost", handleLost, false)
    }
  }

  useEffect(() => {
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [])

  return (
    <div className={["relative h-[360px] sm:h-[420px] md:h-[520px] w-full bg-transparent overflow-hidden", className ?? ""].join(" ")}>
      {webglOk ? (
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            className="absolute inset-0"
            frameloop="always"
            dpr={1}
            camera={{ position: [0, 0, 6], fov: 40 }}
            gl={{
              antialias: false,
              alpha: true,
              premultipliedAlpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
            }}
            onCreated={onCreated}
          >
            <ambientLight intensity={0.95} />
            <directionalLight position={[3, 4, 2]} intensity={1.1} />
            <directionalLight position={[-3, 2, -2]} intensity={0.7} />

            {/* ✅ removed Environment (most common GPU killer) */}

            <RobotModel url={modelUrl} />

            <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
          </Canvas>
        </Suspense>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={import.meta.env.BASE_URL + "image.png"}
            alt=""
            className="h-full w-full object-contain opacity-100"
            draggable={false}
          />
        </div>
      )}
    </div>
  )
}

useGLTF.preload("/robot.glb")