"use client";
import {RoundedBox,Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useRef,useState} from "react";
import * as THREE from "three";
import type {Vec3} from "./config";
const outline={outlineWidth:.007,outlineColor:"#02050a",outlineOpacity:1} as const;
export function ImmersiveMonitor({position,rotation=[0,0,0],title,lines,color="#6682ff",mobile=false,onFocus}:{position:Vec3;rotation?:Vec3;title:string;lines:string[];color?:string;mobile?:boolean;onFocus?:()=>void}){
 const group=useRef<THREE.Group>(null),glow=useRef<THREE.MeshStandardMaterial>(null);const[hovered,setHovered]=useState(false);
 useFrame(({clock})=>{if(glow.current)glow.current.emissiveIntensity=(hovered?.72:.32)+Math.sin(clock.elapsedTime*2.2)*.045;if(group.current)group.current.position.y=position[1]+(mobile?0:Math.sin(clock.elapsedTime*1.25)*.005)});
 return <group ref={group} position={position} rotation={rotation} onClick={e=>{e.stopPropagation();onFocus?.()}} onPointerOver={e=>{e.stopPropagation();setHovered(true)}} onPointerOut={()=>setHovered(false)}><RoundedBox args={[2.35,1.25,.12]} radius={.06}><meshStandardMaterial color="#060a10" roughness={.68}/></RoundedBox><mesh position={[0,0,.07]}><planeGeometry args={[2.16,1.05]}/><meshStandardMaterial ref={glow} color="#080d14" emissive={color} emissiveIntensity={.32} roughness={.86}/></mesh><Text position={[-.97,.38,.086]} fontSize={.125} anchorX="left" color={color} {...outline}>{title}</Text>{lines.slice(0,mobile?3:4).map((line,i)=><Text key={`${line}-${i}`} position={[-.97,.12-i*.23,.087]} fontSize={i===0?.18:.115} anchorX="left" color={i===0?"#ffffff":"#dbe4ef"} {...outline}>{line}</Text>)}{!mobile&&<><mesh position={[0,.5,.09]}><boxGeometry args={[2.02,.008,.01]}/><meshBasicMaterial color={color} transparent opacity={.55}/></mesh><mesh position={[0,-.5,.09]}><boxGeometry args={[2.02,.008,.01]}/><meshBasicMaterial color={color} transparent opacity={.24}/></mesh></>}</group>}
