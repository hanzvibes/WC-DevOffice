"use client";
import {Html,Sparkles,Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useEffect,useMemo,useRef,useState,type RefObject} from "react";
import * as THREE from "three";
import {angleDelta,faceAngle,routeBetween} from "../navigation";
import {profileFor,stateColor,type OfficeRow,type Vec3} from "./config";

type LabelVariant="full"|"customer";

export function Agent({row,target,index,selected,onSelect,initialPosition=[0,0,3.45],labelVariant="full",mobile=false}:{row:OfficeRow;target:Vec3;index:number;selected:boolean;onSelect:()=>void;initialPosition?:Vec3;labelVariant?:LabelVariant;mobile?:boolean}){
 const root=useRef<THREE.Group>(null),body=useRef<THREE.Group>(null),path=useRef<THREE.Vector3[]>([]),last=useRef(""),blink=useRef<THREE.Group>(null),goal=useRef(new THREE.Vector3(...target)),frameBudget=useRef(0);
 const[hovered,setHovered]=useState(false);
 const profile=useMemo(()=>profileFor(row.worker_id,index),[row.worker_id,index]);
 const detail=!mobile||selected,cast=!mobile||selected,showLabel=!mobile||selected||hovered;
 useEffect(()=>{goal.current.set(...target);if(!root.current)return;const key=target.join(",");if(key!==last.current){path.current=routeBetween(root.current.position,target);last.current=key}},[target]);
 useEffect(()=>{if(typeof document==="undefined")return;document.body.style.cursor=hovered?"pointer":"default";return()=>{document.body.style.cursor="default"}},[hovered]);
 useFrame(({clock},dt)=>{
  if(mobile&&!selected){frameBudget.current+=dt;if(frameBudget.current<1/30)return;dt=frameBudget.current;frameBudget.current=0}
  const g=root.current,b=body.current;if(!g||!b)return;
  const next=path.current[0]??goal.current,dist=g.position.distanceTo(next),moving=dist>.07,moveEase=1-Math.exp(-dt*5.8),turnEase=1-Math.exp(-dt*8);
  if(moving){const ang=faceAngle(g.position,next);g.rotation.y+=angleDelta(g.rotation.y,ang)*turnEase;g.position.lerp(next,moveEase)}else if(path.current.length)path.current.shift();else{const facing=["CODING","TESTING","DONE"].includes(row.state)?Math.PI:row.state==="REVIEWING"?0:g.rotation.y;g.rotation.y+=angleDelta(g.rotation.y,facing)*(1-Math.exp(-dt*4.5))}
  const phase=Math.sin(clock.elapsedTime*9),typing=Math.sin(clock.elapsedTime*17),working=["CODING","TESTING"].includes(row.state)&&!moving,review=row.state==="REVIEWING"&&!moving,done=row.state==="DONE"&&!moving,blocked=row.state==="BLOCKED"&&!moving,reading=row.state==="READING"&&!moving;
  const legL=g.getObjectByName("legL"),legR=g.getObjectByName("legR"),armL=g.getObjectByName("armL"),armR=g.getObjectByName("armR");
  if(legL)legL.rotation.x=moving?phase*.48:working?-.95:0;if(legR)legR.rotation.x=moving?-phase*.48:working?-.95:0;
  if(armL)armL.rotation.x=moving?-phase*.4:working?-1.0+typing*.055:review?-.45+phase*.12:done?-1.45:reading?-.3:blocked?.1:0;
  if(armR)armR.rotation.x=moving?phase*.4:working?-1.0-typing*.055:review?-.76-phase*.12:done?-1.45:reading?-.56:blocked?.1:0;
  b.position.y=moving?Math.abs(phase)*.028:working?-.18:done?Math.abs(Math.sin(clock.elapsedTime*4.7))*.045:Math.sin(clock.elapsedTime*1.8+index)*.01;
  b.rotation.z=blocked?Math.sin(clock.elapsedTime*1.9)*.022:0;b.rotation.x=working?.075:reading?.025:0;
  if(blink.current&&detail){const t=(clock.elapsedTime+index*.73)%4.6;blink.current.scale.y=t<.1?.07:1}
 });
 const blocked=row.state==="BLOCKED",working=["CODING","TESTING"].includes(row.state),done=row.state==="DONE",review=row.state==="REVIEWING",reading=row.state==="READING";
 const labelClass=`agentLabel ${labelVariant} ${blocked?"blocked ":""}${selected?"selected ":""}${hovered?"hovered":""}`;
 return <group ref={root} position={initialPosition} onClick={e=>{e.stopPropagation();onSelect()}} onPointerOver={e=>{e.stopPropagation();setHovered(true)}} onPointerOut={()=>setHovered(false)}>
  <StatusRing state={row.state} selected={selected||hovered} mobile={mobile}/>
  <group ref={body}>
   <Torso outfit={blocked?"#d85656":profile.outfit} detail={detail} cast={cast} mobile={mobile}/>
   <Head skin={profile.skin} hair={profile.hair} style={profile.hairStyle} state={row.state} blink={blink} detail={detail} cast={cast} mobile={mobile}/>
   <Limb name="legL" p={[-.14,.48,0]} skin={profile.skin} cast={cast} mobile={mobile}/><Limb name="legR" p={[.14,.48,0]} skin={profile.skin} cast={cast} mobile={mobile}/>
   <Limb name="armL" p={[-.36,1.02,0]} arm sleeve={profile.outfit} skin={profile.skin} cast={cast} mobile={mobile}/><Limb name="armR" p={[.36,1.02,0]} arm sleeve={profile.outfit} skin={profile.skin} cast={cast} mobile={mobile}/>
   {working&&<WorkAccessory state={row.state}/>} {review&&<ReviewTablet/>}{reading&&<PlanningCard/>}
   {done&&(!mobile||selected)&&<Sparkles count={mobile?6:12} scale={[1.3,1.65,1.1]} position={[0,1.1,0]} size={2} speed={.42} color="#b8a8ff"/>}
   {blocked&&(!mobile||selected)&&<Text position={[0,2,0]} fontSize={.26} color="#ff6d74">!</Text>}
  </group>
  {showLabel&&<Html center position={[0,2.12,0]} distanceFactor={labelVariant==="customer"?10.8:9.4}><div className={labelClass}><b>{row.worker_name}</b><span>{row.role}</span><i style={{borderColor:stateColor(row.state),color:stateColor(row.state)}}>{row.state}</i><small>{row.message.slice(0,58)}</small></div></Html>}
 </group>
}
function Torso({outfit,detail,cast,mobile}:{outfit:string;detail:boolean;cast:boolean;mobile:boolean}){return <group><mesh castShadow={cast} position={[0,1.04,0]}><capsuleGeometry args={[.3,.42,mobile?5:7,mobile?8:12]}/><meshStandardMaterial color={outfit} roughness={.7}/></mesh><mesh position={[0,1.09,.292]}><boxGeometry args={[.21,.07,.025]}/><meshStandardMaterial color="#e8edf5"/></mesh>{detail&&<><mesh position={[-.12,1.26,.286]} rotation={[0,0,-.42]}><boxGeometry args={[.16,.035,.018]}/><meshStandardMaterial color="#f2f4f7" transparent opacity={.55}/></mesh><mesh position={[.12,1.26,.286]} rotation={[0,0,.42]}><boxGeometry args={[.16,.035,.018]}/><meshStandardMaterial color="#f2f4f7" transparent opacity={.55}/></mesh></>}<mesh castShadow={cast} position={[0,1.31,0]}><cylinderGeometry args={[.105,.11,.13,mobile?8:12]}/><meshStandardMaterial color="#d5a17d"/></mesh></group>}
function Head({skin,hair,style,state,blink,detail,cast,mobile}:{skin:string;hair:string;style:number;state:string;blink:RefObject<THREE.Group|null>;detail:boolean;cast:boolean;mobile:boolean}){const sad=state==="BLOCKED",happy=state==="DONE";return <group><mesh castShadow={cast} position={[0,1.48,0]}><sphereGeometry args={[.265,mobile?12:18,mobile?10:16]}/><meshStandardMaterial color={skin} roughness={.82}/></mesh><Hair color={hair} style={style} mobile={mobile} cast={cast}/><group ref={blink} position={[0,1.48,.248]}><Eye x={-.086} sad={sad}/><Eye x={.086} sad={sad}/></group><mesh position={[0,1.407,.258]} scale={[happy?1.2:1,.32,1]}><sphereGeometry args={[.052,8,8]}/><meshBasicMaterial color={happy?"#a84d45":"#7e4038"}/></mesh>{detail&&<FaceDetails skin={skin} sad={sad}/>} {(state==="CODING"||state==="TESTING")&&detail&&<Headphones/>}</group>}
function FaceDetails({skin,sad}:{skin:string;sad:boolean}){return <group><mesh position={[0,1.47,.267]} rotation={[Math.PI/2,0,0]}><coneGeometry args={[.035,.07,8]}/><meshStandardMaterial color={skin}/></mesh>{[-.17,.17].map(x=><mesh key={x} position={[x,1.48,.04]}><sphereGeometry args={[.065,8,8]}/><meshStandardMaterial color={skin}/></mesh>)}<mesh position={[-.086,1.56,.254]} rotation={[0,0,sad?.18:-.08]}><boxGeometry args={[.095,.016,.012]}/><meshBasicMaterial color="#4b3329"/></mesh><mesh position={[.086,1.56,.254]} rotation={[0,0,sad?-.18:.08]}><boxGeometry args={[.095,.016,.012]}/><meshBasicMaterial color="#4b3329"/></mesh></group>}
function Eye({x,sad}:{x:number;sad:boolean}){return <mesh position={[x,.035,0]} scale={[1,sad?.58:1,1]}><sphereGeometry args={[.032,8,8]}/><meshBasicMaterial color="#15171a"/></mesh>}
function Hair({color,style,mobile,cast}:{color:string;style:number;mobile:boolean;cast:boolean}){const seg=mobile?10:16;if(style===1)return <group><mesh castShadow={cast} position={[0,1.68,-.02]} scale={[1,.75,1]}><sphereGeometry args={[.275,seg,seg,0,Math.PI*2,0,Math.PI/2.05]}/><meshStandardMaterial color={color}/></mesh><mesh castShadow={cast} position={[-.14,1.65,.05]} rotation={[0,0,.25]}><boxGeometry args={[.12,.18,.12]}/><meshStandardMaterial color={color}/></mesh></group>;if(style===2)return <group><mesh castShadow={cast} position={[0,1.69,-.02]}><sphereGeometry args={[.265,seg,seg,0,Math.PI*2,0,Math.PI/2.1]}/><meshStandardMaterial color={color}/></mesh><mesh castShadow={cast} position={[.02,1.81,-.03]}><sphereGeometry args={[.14,mobile?8:12,mobile?8:12]}/><meshStandardMaterial color={color}/></mesh></group>;return <mesh castShadow={cast} position={[0,1.7,-.015]}><sphereGeometry args={[.265,seg,seg,0,Math.PI*2,0,Math.PI/2.05]}/><meshStandardMaterial color={color}/></mesh>}
function Headphones(){return <group position={[0,1.55,0]}><mesh rotation={[0,0,Math.PI/2]}><torusGeometry args={[.265,.027,7,16,Math.PI]}/><meshStandardMaterial color="#11161e"/></mesh>{[-.265,.265].map(x=><mesh key={x} position={[x,0,0]}><boxGeometry args={[.045,.18,.08]}/><meshStandardMaterial color="#1f2630"/></mesh>)}</group>}
function Limb({name,p,arm=false,sleeve,skin,cast,mobile}:{name:string;p:Vec3;arm?:boolean;sleeve?:string;skin:string;cast:boolean;mobile:boolean}){return <group name={name} position={p}><mesh castShadow={cast} position={[0,-.24,0]}><capsuleGeometry args={[arm?.08:.1,arm?.34:.42,mobile?4:6,mobile?7:10]}/><meshStandardMaterial color={arm?(sleeve||skin):"#202633"}/></mesh>{arm&&<mesh castShadow={cast} position={[0,-.47,0]}><sphereGeometry args={[.09,mobile?8:10,mobile?8:10]}/><meshStandardMaterial color={skin}/></mesh>}{!arm&&<mesh castShadow={cast} position={[0,-.52,.07]}><boxGeometry args={[.2,.11,.36]}/><meshStandardMaterial color="#11151c"/></mesh>}</group>}
function WorkAccessory({state}:{state:string}){const color=state==="TESTING"?"#54d99b":"#6682ff";return <group position={[0,.87,.42]} rotation={[-.15,0,0]}><mesh><boxGeometry args={[.55,.035,.32]}/><meshStandardMaterial color="#151a22"/></mesh><mesh position={[0,.24,-.13]} rotation={[-1.15,0,0]}><boxGeometry args={[.55,.38,.035]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.05}/></mesh></group>}
function ReviewTablet(){return <group position={[0,.98,.38]} rotation={[-.28,0,0]}><mesh><boxGeometry args={[.42,.03,.3]}/><meshStandardMaterial color="#20262f"/></mesh><mesh position={[0,.018,.015]}><planeGeometry args={[.34,.22]}/><meshStandardMaterial color="#efb85d" emissive="#efb85d" emissiveIntensity={.45}/></mesh></group>}
function PlanningCard(){return <group position={[.16,1.05,.35]} rotation={[-.45,.2,.08]}><mesh><boxGeometry args={[.3,.018,.4]}/><meshStandardMaterial color="#e8edf2"/></mesh>{[.08,0,-.08].map(y=><mesh key={y} position={[0,.012,y]}><boxGeometry args={[.2,.005,.014]}/><meshBasicMaterial color="#68778a"/></mesh>)}</group>}
function StatusRing({state,selected,mobile}:{state:string;selected:boolean;mobile:boolean}){const ref=useRef<THREE.Mesh>(null),color=stateColor(state);useFrame(({clock})=>{if(ref.current){const s=1+Math.sin(clock.elapsedTime*2.7)*.06+(selected?.09:0);ref.current.scale.setScalar(s)}});return <mesh ref={ref} rotation={[-Math.PI/2,0,0]} position={[0,.025,0]}><ringGeometry args={[.43,.5,mobile?20:30]}/><meshBasicMaterial color={color} transparent opacity={selected?.9:.58}/></mesh>}
