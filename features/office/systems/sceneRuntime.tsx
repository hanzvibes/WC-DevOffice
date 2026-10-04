"use client";
import {useEffect,useMemo,useState} from "react";
export type SceneQuality={mobile:boolean;dpr:[number,number];shadows:boolean;antialias:boolean;agentLimit:number;customerLimit:number;ambientNpcCount:number};
export function useSceneQuality():SceneQuality{
 const[mobile,setMobile]=useState(()=>typeof window!=="undefined"&&window.matchMedia("(max-width:700px)").matches);
 useEffect(()=>{const media=window.matchMedia("(max-width:700px)");const sync=()=>setMobile(media.matches);sync();media.addEventListener("change",sync);return()=>media.removeEventListener("change",sync)},[]);
 return useMemo(()=>mobile?{mobile:true,dpr:[.68,1],shadows:false,antialias:false,agentLimit:6,customerLimit:8,ambientNpcCount:1}:{mobile:false,dpr:[1,1.3],shadows:true,antialias:true,agentLimit:8,customerLimit:16,ambientNpcCount:2},[mobile]);
}
export function usePageVisibility(){const[visible,setVisible]=useState(()=>typeof document==="undefined"||!document.hidden);useEffect(()=>{const sync=()=>setVisible(!document.hidden);document.addEventListener("visibilitychange",sync);return()=>document.removeEventListener("visibilitychange",sync)},[]);return visible}
