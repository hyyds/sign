/**
 * ============================================================
 *  极氪「爱车」外观 —— 007
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_007.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z005PC089",   // 段1  车漆
  "Z005PC096",   // 段2  ?
  "Z005PC070",   // 段3  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  车漆 ──
 *    Z005PC089   #660618
 *    Z005PC090   #24242A
 *    Z005PC091   #78787E
 *    Z005PC092   #E4DED8
 *    Z005PC093   #967E72
 *    Z005PC094   #424836
 *    Z005PC095   #303030
 * ── 段2  ? ──
 *    Z005PC096
 * ── 段3  轮毂 ──
 *    Z005PC015
 *    Z005PC016
 *    Z005PC054
 *    Z005PC063
 *    Z005PC070
 *    Z005PC071
 *    Z005PC104
 */

function note(a,b,c){ if(DEBUG) $notify("极氪·007 "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body!=="string" || !body.length || body.indexOf("showcar/vehicle")===-1) {
  $done({});
} else {
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/5/74/" + SLOTS.join("_") + ".png";
  const out = body.replace(
    /https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g,
    PIC);
  note("换车型",tail,out===body?"未匹配到车图":"已切换");
  $done({body:out});
}
