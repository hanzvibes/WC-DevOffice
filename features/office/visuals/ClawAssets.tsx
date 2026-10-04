"use client";

import {Text,useGLTF,useTexture} from "@react-three/drei";
import {Suspense,useMemo} from "react";
import * as THREE from "three";
import {OPS_CENTER_X} from "./CustomerOpsWing";
import type {ActivityFlags} from "./Environment";
import type {Vec3} from "./config";

const CLAW_COMMIT="0565b7892909eca7bbc8f2d9b0fad171dd75ad7c";
const RAW=`https://raw.githubusercontent.com/iamlukethedev/Claw3D/${CLAW_COMMIT}/public/office-assets`;
const MODEL_BASE=`${RAW}/models/furniture`;

const MODELS={
 desk:"desk.glb",
 deskCorner:"deskCorner.glb",
 chairDesk:"chairDesk.glb",
 chairModern:"chairModernCushion.glb",
 computer:"computerScreen.glb",
 cabinet:"kitchenCabinet.glb",
 coffeeMachine:"kitchenCoffeeMachine.glb",
 fridge:"kitchenFridgeSmall.glb",
 lamp:"lampRoundFloor.glb",
 loungeChair:"loungeDesignChair.glb",
 sofa:"loungeSofa.glb",
 smallPlant:"plantSmall1.glb",
 plant:"pottedPlant.glb",
 table:"table.glb",
 coffeeTable:"tableCoffee.glb",
 roundTable:"tableRound.glb",
 bookcase:"bookcaseClosed.glb",
} as const;

type ModelKey=keyof typeof MODELS;
type Scale=number|[number,number,number];

function ClawModel({name,position,rotation=[0,0,0],scale=1,tint,mobile=false}:{name:ModelKey;position:Vec3;rotation?:Vec3;scale?:Scale;tint?:string;mobile?:boolean}){
 const path=`${MODEL_BASE}/${MODELS[name]}`;
 const {scene}=useGLTF(path);
 const object=useMemo(()=>{
  const clone=scene.clone(true);
  const tintColor=tint?new THREE.Color(tint):null;
  clone.traverse(child=>{
   if(!(child as THREE.Mesh).isMesh)return;
   const mesh=child as THREE.Mesh;
   mesh.castShadow=!mobile;
   mesh.receiveShadow=!mobile;
   const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];
   const next=mats.map(material=>{
    const m=material.clone() as THREE.MeshStandardMaterial;
    if(tintColor&&"color" in m)m.color.lerp(tintColor,.42);
    if("roughness" in m)m.roughness=.72;
    if("metalness" in m)m.metalness=.06;
    return m;
   });
   mesh.material=Array.isArray(mesh.material)?next:next[0];
  });
  return clone;
 },[scene,tint,mobile]);
 return <primitive object={object} position={position} rotation={rotation} scale={scale}/>;
}

function DevShell({activity}:{activity:ActivityFlags}){
 return <group>
  <mesh receiveShadow position={[0,-.12,0]}><boxGeometry args={[11.4,.24,8.8]}/><meshStandardMaterial color="#1d222a" roughness={.98}/></mesh>
  <mesh receiveShadow position={[0,1.72,-4.28]}><boxGeometry args={[11.4,3.65,.18]}/><meshStandardMaterial color="#10161f"/></mesh>
  <mesh receiveShadow position={[-5.6,1.72,0]}><boxGeometry args={[.18,3.65,8.8]}/><meshStandardMaterial color="#121821"/></mesh>
  <mesh receiveShadow position={[5.6,1.72,0]}><boxGeometry args={[.18,3.65,8.8]}/><meshStandardMaterial color="#10151c"/></mesh>
  <Text position={[0,3.14,-4.16]} fontSize={.35} color="#e5ebf5">WEDDING COPILOT · DEV STUDIO</Text>
  <Signal p={[-3.45,2.5,-4.13]} label="ENGINEERING" color={activity.coding?"#6682ff":"#526078"}/>
  <Signal p={[3.35,2.5,-4.13]} label="QA LAB" color={activity.testing?"#58dba1":"#526078"}/>
  <Signal p={[3.2,2.05,3.95]} label="REVIEW" color={activity.review?"#efb85d":"#776552"}/>
  <Signal p={[-3.55,2.05,3.95]} label="DEPLOY" color={activity.done?"#a58aff":"#635a78"}/>
 </group>;
}

function Signal({p,label,color}:{p:Vec3;label:string;color:string}){
 return <group position={p}><mesh><boxGeometry args={[1.65,.045,.04]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.25}/></mesh><Text position={[0,.2,.03]} fontSize={.12} color={color}>{label}</Text></group>;
}

function ClawBackdrop(){
 const texture=useTexture(`${RAW}/backgrounds/office-bg.png`);
 texture.colorSpace=THREE.SRGBColorSpace;
 return <group position={[0,1.86,-4.17]}><mesh><planeGeometry args={[2.35,1.32]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh><mesh position={[0,0,-.025]}><boxGeometry args={[2.5,1.47,.06]}/><meshStandardMaterial color="#1b222c"/></mesh></group>;
}

function DevFurniture({mobile}:{mobile:boolean}){
 return <group>
  <ClawModel name="desk" position={[-3.5,0,-2.05]} scale={[2.35,2.05,2.15]} tint="#6e4930" mobile={mobile}/>
  <ClawModel name="chairDesk" position={[-3.5,0,-1.15]} rotation={[0,Math.PI,0]} scale={1.35} tint="#39475c" mobile={mobile}/>
  <ClawModel name="computer" position={[-3.82,.92,-2.22]} scale={1.15} tint="#455173" mobile={mobile}/>
  <ClawModel name="computer" position={[-3.18,.92,-2.22]} scale={1.15} tint="#455173" mobile={mobile}/>

  <ClawModel name="roundTable" position={[3.2,0,1.9]} scale={2.55} tint="#755033" mobile={mobile}/>
  <ClawModel name="chairModern" position={[2.15,0,1.9]} rotation={[0,Math.PI/2,0]} scale={1.25} tint="#48556b" mobile={mobile}/>
  <ClawModel name="chairModern" position={[4.25,0,1.9]} rotation={[0,-Math.PI/2,0]} scale={1.25} tint="#48556b" mobile={mobile}/>

  <ClawModel name="sofa" position={[0,0,3.15]} rotation={[0,Math.PI,0]} scale={1.8} tint="#344b70" mobile={mobile}/>
  <ClawModel name="loungeChair" position={[1.65,0,3.05]} rotation={[0,-.75,0]} scale={1.4} tint="#5b4774" mobile={mobile}/>
  <ClawModel name="coffeeTable" position={[0,0,2.15]} scale={[2.05,1.2,1.55]} tint="#6e4d33" mobile={mobile}/>
  <ClawModel name="lamp" position={[-1.72,0,3.12]} scale={1.25} tint="#c09a58" mobile={mobile}/>

  <ClawModel name="bookcase" position={[-4.85,0,2.72]} scale={[1.45,1.9,1.45]} tint="#5a3523" mobile={mobile}/>
  <ClawModel name="plant" position={[-5.02,0,-3.45]} scale={[1.25,1.8,1.25]} mobile={mobile}/>

  <ClawModel name="cabinet" position={[4.55,0,3.22]} scale={[2.15,1.05,1]} tint="#4b535f" mobile={mobile}/>
  <ClawModel name="coffeeMachine" position={[4.18,.82,3.17]} scale={.85} tint="#2d303b" mobile={mobile}/>
  <ClawModel name="fridge" position={[5.02,0,2.52]} scale={[1,1.4,1]} tint="#58616a" mobile={mobile}/>
  <ClawModel name="smallPlant" position={[4.92,0,-3.42]} scale={[1,1.85,1]} mobile={mobile}/>
 </group>;
}

function OpsFurniture({mobile}:{mobile:boolean}){
 return <group>
  <ClawModel name="deskCorner" position={[OPS_CENTER_X-4.7,0,-4.02]} rotation={[0,.05,0]} scale={1.8} tint="#6b442a" mobile={mobile}/>
  <ClawModel name="chairDesk" position={[OPS_CENTER_X-4.7,0,-3.15]} rotation={[0,Math.PI,0]} scale={1.25} tint="#414d61" mobile={mobile}/>
  <ClawModel name="computer" position={[OPS_CENTER_X-4.55,.92,-4.15]} scale={1.08} tint="#56658c" mobile={mobile}/>
  <ClawModel name="table" position={[OPS_CENTER_X,0,-2.7]} scale={[1.8,1.3,1.25]} tint="#765033" mobile={mobile}/>
  <ClawModel name="smallPlant" position={[OPS_CENTER_X-7.05,0,4.15]} scale={[1,1.8,1]} mobile={mobile}/>
 </group>;
}

export function ClawAssetWorld({activity,mobile}:{activity:ActivityFlags;mobile:boolean}){
 return <group>
  <DevShell activity={activity}/>
  {!mobile&&<Suspense fallback={null}><ClawBackdrop/></Suspense>}
  <Suspense fallback={null}><DevFurniture mobile={mobile}/><OpsFurniture mobile={mobile}/></Suspense>
 </group>;
}
