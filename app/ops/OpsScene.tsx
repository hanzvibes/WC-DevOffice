"use client";
import {ContactShadows,Environment,Html,OrbitControls,RoundedBox,Text} from "@react-three/drei";
import {Canvas,useFrame,useThree} from "@react-three/fiber";
import {Suspense,useMemo,useRef} from "react";
import * as THREE from "three";
import {Agent} from "../../features/office/visuals/Agent";
import type {OfficeRow,Vec3} from "../../features/office/visuals/config";
import type {OpsMetrics,OpsUser} from "../../lib/customer-ops/types";

type VisualUser={user:OpsUser;row:OfficeRow;target:Vec3};

const ZONES={
 registered:[-3.8,0,-1.9] as Vec3,
 nurture:[-1.35,0,1.85] as Vec3,
 checkout:[1.25,0,-1.75] as Vec3,
 subscribed:[3.65,0,1.55] as Vec3,
 attention:[3.55,0,-2.05] as Vec3,
};

function stateFor(user:OpsUser){
 if(user.paymentStatus==="paid")return "DONE";
 if(user.paymentStatus==="pending")return "REVIEWING";
 if(user.paymentStatus==="failed")return "BLOCKED";
 if(user.verified)return "READING";
 return "IDLE";
}
function zoneFor(user:OpsUser){
 if(user.paymentStatus==="paid")return "subscribed" as const;
 if(user.paymentStatus==="pending")return "checkout" as const;
 if(user.paymentStatus==="failed")return "attention" as const;
 if(user.verified)return "nurture" as const;
 return "registered" as const;
}
function statusMessage(user:OpsUser){
 if(user.paymentStatus==="paid")return `${user.plan.toUpperCase()} subscriber`;
 if(user.paymentStatus==="pending")return `Checkout pending · ${user.plan}`;
 if(user.paymentStatus==="failed")return "Payment needs attention";
 if(user.verified)return "Verified · no subscription";
 return "New registration · unverified";
}
function spread(base:Vec3,index:number):Vec3{
 const col=index%3,row=Math.floor(index/3)%3;
 return [base[0]+(col-1)*.72,0,base[2]+(row-1)*.7];
}

export default function OpsScene({users,metrics,selectedId,onSelect}:{users:OpsUser[];metrics:OpsMetrics;selectedId:string|null;onSelect:(id:string|null)=>void}){
 const visual=useMemo(()=>{
  const counts:Record<string,number>={};
  return users.slice(0,18).map((user):VisualUser=>{
   const zone=zoneFor(user);const n=counts[zone]||0;counts[zone]=n+1;
   const state=stateFor(user);
   const row:OfficeRow={id:user.id,worker_id:user.id,worker_name:user.name,role:user.paymentStatus==="paid"?`${user.plan.toUpperCase()} CUSTOMER`:"CUSTOMER",state,message:statusMessage(user),task:user.weddingTitle||undefined,created_at:user.createdAt};
   return {user,row,target:spread(ZONES[zone],n)};
  });
 },[users]);
 const selected=visual.find(v=>v.user.id===selectedId)||null;
 return <div className="opsWorld"><Canvas shadows dpr={[1,1.45]} camera={{position:[10.8,9.6,12.7],fov:40}} onPointerMissed={()=>onSelect(null)} gl={{antialias:true,powerPreference:"high-performance"}}><Suspense fallback={null}><color attach="background" args={["#070a0f"]}/><fog attach="fog" args={["#070a0f",17,31]}/><ambientLight intensity={.72}/><hemisphereLight intensity={.5} groundColor="#11161e" color="#9db4d5"/><directionalLight castShadow position={[-6,11,8]} intensity={2.25} shadow-mapSize={[1536,1536]}/><pointLight position={[0,5,0]} intensity={15} distance={16} color="#89a7ff"/><CustomerOpsEnvironment metrics={metrics}/>{visual.map((v,index)=><Agent key={v.user.id} row={v.row} target={v.target} index={index} selected={selectedId===v.user.id} onSelect={()=>onSelect(v.user.id)}/>) }<OpsCamera selected={selected?.target||null}/><Environment preset="city"/><ContactShadows position={[0,.01,0]} opacity={.5} scale={20} blur={2.5}/><OrbitControls enabled={!selected} makeDefault target={[0,.8,0]} minDistance={8} maxDistance={21} minPolarAngle={.62} maxPolarAngle={Math.PI/2.12} enableDamping dampingFactor={.08}/></Suspense></Canvas><div className="opsWorldHint">{selected?"FOLLOWING CUSTOMER · CLOSE DETAIL FOR OVERVIEW":"DRAG · ORBIT / SCROLL · ZOOM"}</div></div>
}

function OpsCamera({selected}:{selected:Vec3|null}){const{camera,size}=useThree();const target=useRef(new THREE.Vector3());const desired=useRef(new THREE.Vector3());useFrame(({clock},dt)=>{const mobile=size.width<700;if(selected){target.current.set(selected[0],.9,selected[2]);desired.current.set(selected[0]+(mobile?4.8:5.8),mobile?5.4:6.1,selected[2]+(mobile?5.5:6.7));camera.position.lerp(desired.current,Math.min(1,dt*2.1));camera.lookAt(target.current);return}const t=clock.elapsedTime*.03;desired.current.set((mobile?10.8:10)+Math.sin(t)*.5,mobile?10.9:9.6,(mobile?14:12.6)+Math.cos(t)*.5);camera.position.lerp(desired.current,Math.min(1,dt*.15));camera.lookAt(0,.85,0)});return null}

function CustomerOpsEnvironment({metrics}:{metrics:OpsMetrics}){return <group><Architecture/><Floor/><Zone p={ZONES.registered} title="REGISTRATION" subtitle={`${metrics.totalUsers} users`} color="#66b7ff"/><Zone p={ZONES.nurture} title="NO SUBSCRIPTION" subtitle={`${metrics.unsubscribed} users`} color="#7b8798"/><Zone p={ZONES.checkout} title="CHECKOUT" subtitle={`${metrics.payments.pending} pending`} color="#efb85d"/><Zone p={ZONES.subscribed} title="SUBSCRIBERS" subtitle={`${metrics.subscribers} paid`} color="#9f8cff"/><Zone p={ZONES.attention} title="ATTENTION" subtitle={`${metrics.payments.failed} failed`} color="#ff636b"/><CommandWall metrics={metrics}/><ReceptionDesk/><SubscriptionDesk/></group>}
function Architecture(){return <group><mesh receiveShadow position={[0,-.12,0]}><boxGeometry args={[11.8,.24,9]}/><meshStandardMaterial color="#20252d" roughness={.95}/></mesh><mesh receiveShadow position={[0,1.8,-4.45]}><boxGeometry args={[11.8,3.8,.18]}/><meshStandardMaterial color="#131923"/></mesh><mesh receiveShadow position={[-5.8,1.8,0]}><boxGeometry args={[.18,3.8,9]}/><meshStandardMaterial color="#151b24"/></mesh><Text position={[0,3.22,-4.32]} fontSize={.34} color="#dce7f6">WEDDING COPILOT · CUSTOMER OPS</Text></group>}
function Floor(){return <group><mesh position={[0,.012,.35]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[2.1,7.4]}/><meshStandardMaterial color="#252c36" roughness={1}/></mesh>{[-2.15,2.15].map(x=><mesh key={x} position={[x,.015,.2]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[.045,7.6]}/><meshBasicMaterial color="#3b4655"/></mesh>)}</group>}
function Zone({p,title,subtitle,color}:{p:Vec3;title:string;subtitle:string;color:string}){return <group position={p}><mesh receiveShadow position={[0,.018,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[1.45,32]}/><meshStandardMaterial color="#1b222c" roughness={1}/></mesh><mesh position={[0,.024,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.18,1.28,40]}/><meshBasicMaterial color={color} transparent opacity={.55}/></mesh><Text position={[0,2.15,-.35]} fontSize={.18} color={color}>{title}</Text><Text position={[0,1.9,-.35]} fontSize={.1} color="#8290a4">{subtitle}</Text></group>}
function CommandWall({metrics}:{metrics:OpsMetrics}){return <group position={[0,1.75,-4.18]}><RoundedBox args={[5.4,1.9,.12]} radius={.08}><meshStandardMaterial color="#0c121a"/></RoundedBox><Text position={[-2.25,.55,.08]} fontSize={.12} color="#718198">CUSTOMER HEALTH</Text><Text position={[-2.25,.18,.08]} fontSize={.28} color="#edf3fb" anchorX="left">{`${metrics.totalUsers} REGISTERED`}</Text><Text position={[-2.25,-.2,.08]} fontSize={.13} color="#58dba1" anchorX="left">{`${metrics.subscribers} SUBSCRIBERS · ${metrics.conversionRate}% CONVERSION`}</Text><Text position={[.55,.5,.08]} fontSize={.12} color="#718198" anchorX="left">PLANS</Text><Text position={[.55,.16,.08]} fontSize={.14} color="#7c8cff" anchorX="left">{`STARTER ${metrics.plans.starter}`}</Text><Text position={[.55,-.12,.08]} fontSize={.14} color="#50cfa0" anchorX="left">{`LITE ${metrics.plans.lite}`}</Text><Text position={[.55,-.4,.08]} fontSize={.14} color="#b291ff" anchorX="left">{`PRO ${metrics.plans.pro}`}</Text></group>}
function ReceptionDesk(){return <group position={[-3.75,0,-2.9]}><RoundedBox castShadow position={[0,.82,0]} args={[2.1,.16,.8]} radius={.08}><meshStandardMaterial color="#4b3b30"/></RoundedBox><mesh position={[0,1.25,-.18]}><boxGeometry args={[.7,.5,.05]}/><meshStandardMaterial color="#17202b" emissive="#66b7ff" emissiveIntensity={.35}/></mesh></group>}
function SubscriptionDesk(){return <group position={[3.55,0,.2]}><RoundedBox castShadow position={[0,.82,0]} args={[2.1,.16,.8]} radius={.08}><meshStandardMaterial color="#4b3b30"/></RoundedBox><mesh position={[0,1.25,-.18]}><boxGeometry args={[.7,.5,.05]}/><meshStandardMaterial color="#17202b" emissive="#9f8cff" emissiveIntensity={.4}/></mesh><Text position={[0,1.75,-.18]} fontSize={.13} color="#b8a8ff">SUBSCRIPTION DESK</Text></group>}
