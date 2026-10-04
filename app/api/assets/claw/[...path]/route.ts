const COMMIT="0565b7892909eca7bbc8f2d9b0fad171dd75ad7c";
const ROOT=`https://raw.githubusercontent.com/iamlukethedev/Claw3D/${COMMIT}/public/office-assets`;
const ALLOWED=/^[a-zA-Z0-9._\/-]+$/;
export const runtime="edge";
export async function GET(_request:Request,{params}:{params:Promise<{path:string[]}>}){const{path}=await params;const joined=path.join("/");if(!joined||!ALLOWED.test(joined)||joined.includes(".."))return new Response("Invalid asset path",{status:400});const upstream=await fetch(`${ROOT}/${joined}`,{cache:"force-cache"});if(!upstream.ok)return new Response("Asset unavailable",{status:upstream.status});const headers=new Headers();headers.set("Content-Type",upstream.headers.get("content-type")||contentType(joined));headers.set("Cache-Control","public, max-age=31536000, s-maxage=31536000, immutable");headers.set("Access-Control-Allow-Origin","*");return new Response(upstream.body,{status:200,headers})}
function contentType(path:string){if(path.endsWith(".glb"))return"model/gltf-binary";if(path.endsWith(".png"))return"image/png";if(path.endsWith(".jpg")||path.endsWith(".jpeg"))return"image/jpeg";return"application/octet-stream"}
