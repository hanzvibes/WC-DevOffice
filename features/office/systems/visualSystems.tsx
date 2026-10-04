"use client";
import{useFrame}from"@react-three/fiber";
import{useMemo,useRef}from"react";
import*as THREE from"three";
import{OPS_CENTER_X}from"../visuals/CustomerOpsWing";
export function VisualSystems({mobile}:{mobile:boolean}){return <group><Beacon position={[0,.035,.4]} color="#6682ff" mobile={mobile}/><Beacon position={[OPS_CENTER_X,.035,.4]} color="#9f8cff" mobile={mobile}/>{!mobile&&<AmbientDust/>}</group>}
function Beacon({position,color,mobile}:{position:[number,number,number];color:string;mobile:boolean}){const ring=useRef<THREE.Mesh>(null);useFrame(({clock})=>{if(ring.current){const s=1+Math.sin(clock.elapsedTime*1.7)*.04;ring.current.scale.setScalar(s)}});return <mesh ref={ring} position={position} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[mobile?.9:1.2,mobile?1:1.32,32]}/><meshBasicMaterial color={color} transparent opacity={mobile?.06:.09}/></mesh>}
function AmbientDust(){const ref=useRef<THREE.Points>(null),positions=useMemo(()=>{const a=new Float32Array(36*3);for(let i=0;i<36;i++){a[i*3]=-5+Math.random()*30;a[i*3+1]=.3+Math.random()*3;a[i*3+2]=-5+Math.random()*10}return a},[]);useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=Math.sin(clock.elapsedTime*.05)*.03});return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/></bufferGeometry><pointsMaterial size={.025} color="#9db0c8" transparent opacity={.16} depthWrite={false}/></points>}
