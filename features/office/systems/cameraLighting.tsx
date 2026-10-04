"use client";
import {useFrame,useThree} from "@react-three/fiber";
import {useEffect,useRef} from "react";
import * as THREE from "three";
import {OPS_CENTER_X} from "../visuals/CustomerOpsWing";
import {SPOTS,type OfficeRow,type Vec3} from "../visuals/config";

export type Room="hq"|"dev"|"ops";
export function HQLighting({mobile}:{mobile:boolean}){
 const sun=useRef<THREE.DirectionalLight>(null),ambient=useRef<THREE.AmbientLight>(null),hemi=useRef<THREE.HemisphereLight>(null);
 useFrame(({clock})=>{const t=(Math.sin(clock.elapsedTime/70)+1)/2;if(sun.current){sun.current.intensity=(mobile?1.15:1.75)+t*(mobile?.28:.55);sun.current.color.set(t>.58?"#f0f4ff":"#ffd9a5")}if(ambient.current)ambient.current.intensity=(mobile?.78:.6)+t*.16;if(hemi.current)hemi.current.intensity=(mobile?.5:.38)+t*.12});
 return <><ambientLight ref={ambient} intensity={mobile?.88:.72}/><hemisphereLight ref={hemi} intensity={mobile?.58:.46} groundColor="#11141a" color="#9fb6d7"/><directionalLight ref={sun} castShadow={!mobile} position={[7,14,9]} intensity={mobile?1.45:2.15} shadow-mapSize={mobile?[512,512]:[1536,1536]}/><pointLight position={[0,5,-1]} intensity={mobile?7:12} distance={18} color="#8ca8ff"/><pointLight position={[OPS_CENTER_X,5,-1]} intensity={mobile?7:12} distance={20} color="#9f8cff"/></>;
}
export function HQCameraRig({selected,room,opsTarget,navTick,focusPoint}:{selected:OfficeRow|null;room:Room;opsTarget:Vec3|null;navTick:number;focusPoint?:Vec3|null}){
 const{camera,size}=useThree(),target=useRef(new THREE.Vector3()),look=useRef(new THREE.Vector3()),desired=useRef(new THREE.Vector3()),moving=useRef(true),mobile=size.width<700;
 useEffect(()=>{const p=camera as THREE.PerspectiveCamera;if(typeof p.fov==="number"){p.fov=mobile?48:40;p.updateProjectionMatrix()}moving.current=true},[camera,mobile,room,selected?.worker_id,opsTarget?.[0],opsTarget?.[2],focusPoint?.[0],focusPoint?.[2],navTick]);
 useFrame((_,dt)=>{if(!moving.current)return;if(focusPoint){target.current.set(focusPoint[0],.9,focusPoint[2]);desired.current.set(focusPoint[0]+(mobile?3.4:5.8),mobile?5.1:6.3,focusPoint[2]+(mobile?5:6.6))}else if(selected){const p=SPOTS[selected.state]||SPOTS.READING;target.current.set(p[0],.96,p[2]);desired.current.set(p[0]+(mobile?3.5:6),mobile?4.9:6.2,p[2]+(mobile?5:7))}else if(opsTarget){target.current.set(opsTarget[0],.92,opsTarget[2]);desired.current.set(opsTarget[0]+(mobile?3.2:5.7),mobile?5:6.2,opsTarget[2]+(mobile?5:6.6))}else if(room==="ops"){target.current.set(OPS_CENTER_X,.8,0);desired.current.set(mobile?OPS_CENTER_X:OPS_CENTER_X+8.8,mobile?13.2:10.8,mobile?16:14.5)}else if(room==="hq"){target.current.set(OPS_CENTER_X/2,.8,0);desired.current.set(OPS_CENTER_X/2,mobile?20:15.5,mobile?28:23)}else{target.current.set(0,.8,0);desired.current.set(mobile?0:9.6,mobile?12.2:9.8,mobile?14.2:12.6)}const move=1-Math.exp(-dt*3.15),aim=1-Math.exp(-dt*4.25);camera.position.lerp(desired.current,move);look.current.lerp(target.current,aim);camera.lookAt(look.current);if(camera.position.distanceTo(desired.current)<.045&&look.current.distanceTo(target.current)<.035)moving.current=false});
 return null;
}
