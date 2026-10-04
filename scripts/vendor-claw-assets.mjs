import{mkdir,readdir,rename,writeFile}from"node:fs/promises";
import{existsSync}from"node:fs";
import{spawnSync}from"node:child_process";
import path from"node:path";
const commit="0565b7892909eca7bbc8f2d9b0fad171dd75ad7c",root=`https://raw.githubusercontent.com/iamlukethedev/Claw3D/${commit}/public/office-assets`,models=["desk.glb","deskCorner.glb","chairDesk.glb","chairModernCushion.glb","computerScreen.glb","kitchenCabinet.glb","kitchenCoffeeMachine.glb","kitchenFridgeSmall.glb","lampRoundFloor.glb","loungeDesignChair.glb","loungeSofa.glb","plantSmall1.glb","pottedPlant.glb","table.glb","tableCoffee.glb","tableRound.glb","bookcaseClosed.glb"],optimize=process.argv.includes("--optimize"),base=path.join(process.cwd(),"public","office-assets"),modelDir=path.join(base,"models","furniture");
await mkdir(modelDir,{recursive:true});await mkdir(path.join(base,"backgrounds"),{recursive:true});
async function download(rel){const out=path.join(base,rel);if(existsSync(out))return;const res=await fetch(`${root}/${rel}`);if(!res.ok)throw new Error(`Failed ${rel}: ${res.status}`);await writeFile(out,Buffer.from(await res.arrayBuffer()));console.log("downloaded",rel)}
for(const file of models)await download(`models/furniture/${file}`);await download("backgrounds/office-bg.png");
if(optimize){for(const file of(await readdir(modelDir)).filter(f=>f.endsWith(".glb"))){const src=path.join(modelDir,file),tmp=path.join(modelDir,`.${file}.tmp.glb`),cmd=process.platform==="win32"?"npx.cmd":"npx",result=spawnSync(cmd,["--yes","@gltf-transform/cli","optimize",src,tmp,"--compress","meshopt"],{stdio:"inherit"});if(result.status!==0)throw new Error(`gltf-transform failed for ${file}`);await rename(tmp,src)}}
console.log(optimize?"Claw3D assets vendored + optimized":"Claw3D assets vendored");
