"use client";
import {RoundedBox,Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useRef,useState} from "react";
import * as THREE from "three";
import type {Vec3} from "./config";
export function ImmersiveMonitor({position,rotation=[0,0,0],title,lines,color="#6682ff",mobile=false,onFocus}:{position:Vec3;rotation?:Vec3;title:string;lines:string[];color?:string;mobile?:boolean;onFocus?:()=>void}){
 const group=useRef<THREE.Group>(null),glow=useRef<THREE.MeshStandardMaterial>(null);const[hovered,setHovered]=useState(false);
 useFrame(({clock})=>{if(glow.current)glow.current.emissiveIntensity=(hovered?1.1:.5)+Math.sin(clock.elapsedTime*2.2)*.08;if(group.current)group.current.position.y=position[1]+(mobile?0:Math.sin(clock.elapsedTime*1.25)*.005)});
 return <group ref={group} position={position} rotation={rotation} onClick={e=>{e.stopPropagation();onFocus?.()}} onPointerOver={e=>{e.stopPropagation();setHovered(true)}} onPointerOut={()=>setHovered(false)}><RoundedBox args={[2.35,1.25,.12]} radius={.06}><meshStandardMaterial color="#0a1018" roughness={.6}/></RoundedBox><mesh position={[0,0,.07]}><planeGeometry args={[2.16,1.05]}/><meshStandardMaterial ref={glow} color="#111927" emissive={color} emissiveIntensity={.5} roughness={.8}/></mesh><Text position={[-.97,.38,.085]} fontSize={.105} anchorX="left" color={color}>{title}</Text>{lines.slice(0,mobile?3:4).map((line,i)=><Text key={`${line}-${i}`} position={[-.97,.12-i*.22,.086]} fontSize={i===0?.16:.1} anchorX="left" color={i===0?"#e8eef7":"#92a0b3"}>{line}</Text>)}{!mobile&&<><mesh position={[0,.5,.09]}><boxGeometry args={[2.02,.008,.01]}/><meshBasicMaterial color={color} transparent opacity={.45}/></mesh><mesh position={[0,-.5,.09]}><boxGeometry args={[2.02,.008,.01]}/><meshBasicMaterial color={color} transparent opacity={.18}/></mesh></>}</group>}
