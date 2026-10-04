"use client";
import{useEffect,useMemo}from"react";
import{configureNavigation,type NavObstacle}from"../navigation";
import{MODEL_FOOTPRINT,type LayoutItem}from"../runtime/layout";
function obstacleFor(item:LayoutItem):NavObstacle|null{if(!item.blocksNavigation)return null;const base=MODEL_FOOTPRINT[item.model],raw=item.scale??1,sx=Array.isArray(raw)?raw[0]:raw,sz=Array.isArray(raw)?raw[2]:raw,rot=item.rotation?.[1]||0,swap=Math.abs(Math.sin(rot))>.7,w=(swap?base[1]:base[0])*Math.max(.7,sx)*.55,d=(swap?base[0]:base[1])*Math.max(.7,sz)*.55;return{minX:item.position[0]-w,maxX:item.position[0]+w,minZ:item.position[2]-d,maxZ:item.position[2]+d}}
export function NavigationSystem({layout}:{layout:LayoutItem[]}){const obstacles=useMemo(()=>layout.map(obstacleFor).filter((v):v is NavObstacle=>!!v),[layout]);useEffect(()=>configureNavigation(obstacles),[obstacles]);return null}
