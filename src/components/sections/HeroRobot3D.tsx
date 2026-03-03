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
    toneMapped?: boolean
    needsUpdate?: boolean
  }

  if (mat.color?.set) mat.color.set(color)

  if (emissive && mat.emissive?.set) {
    mat.emissive.set(emissive)
    mat.emissiveIntensity = emissiveIntensity ?? 0.12
  }

  if (typeof mat.metalness === "number") mat.metalness = 0.02
  if (typeof mat.roughness === "number") mat.roughness = 0.62

  mat.needsUpdate = true
}

function styleRobotAndSymbols(root: Group) {
  const infos = getMeshInfos(root)
  if (infos.length === 0) return

  const ys = infos.map((x) => x.centerY)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const yRange = Math.max(0.0001, maxY - minY)

  const headLine = minY + yRange * 0.72
  const midLine = minY + yRange * 0.52

  const big = new Set(infos.slice(0, 4).map((x) => x.mesh.uuid))

  root.traverse((obj) => {
    const mesh = obj as unknown as Mesh
    if (!mesh.isMesh || !mesh.material) return

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const info = infos.find((x) => x.mesh.uuid === mesh.uuid)
    const y = info?.centerY ?? 0

    const isBig = big.has(mesh.uuid)
    const isHead = y >= headLine
    const isFaceZone = isHead && y <= headLine + yRange * 0.14
    const isHandsZone = y >= midLine && y <= headLine && !isBig

    mats.forEach((m) => {
      if (isFaceZone) {
        setMatColor(m, LIGHT_BLUE, LIGHT_BLUE, 0.26)
        return
      }

      if (isHandsZone) {
        setMatColor(m, SOFT_GREY, LIGHT_BLUE, 0.18)
        return
      }

      if (isBig) {
        setMatColor(m, BRAND_BLUE, LIGHT_BLUE, 0.12)
        return
      }

      setMatColor(m, LIGHT_BLUE, LIGHT_BLUE, 0.12)
    })
  })
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

  useEffect(() => {
    styleRobotAndSymbols(scene)
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
      pivotRef.current.rotation.y = t * 0.45
    }
  })

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

    state.gl.setPixelRatio(1.25)
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
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 6], fov: 40 }}
            gl={{
              antialias: true,
              alpha: true,
              premultipliedAlpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
            }}
            onCreated={onCreated}
          >
            <ambientLight intensity={1.35} />
            <directionalLight position={[4, 6, 4]} intensity={1.15} />
            <directionalLight position={[-4, 3, -2]} intensity={0.85} />
            <hemisphereLight intensity={0.55} />

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

useGLTF.preload(`${import.meta.env.BASE_URL}robot.glb`)