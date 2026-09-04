/**
 * ============================================================
 *  极氪「爱车」外观 —— 009
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_009.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z009PC001",   // 段1  车漆
  "Z009PC005",   // 段2  外观/车顶
  "Z009PC018",   // 段3  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  车漆 ──
 *    Z009PC001   #242424
 *    Z009PC002   #C6CCCC
 *    Z009PC003   #181E2A
 *    Z009PC004   #72726C
 * ── 段2  外观/车顶 ──
 *    Z009PC005
 *    Z009PC006
 * ── 段3  轮毂 ──
 *    Z009PC018
 *    Z009PC019
 *    Z009PC020
 *    Z009PC021
 */

function note(a,b,c){ if(DEBUG) $notify("极氪·009 "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body!=="string" || !body.length || body.indexOf("showcar/vehicle")===-1) {
  $done({});
} else {
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/2/8/" + SLOTS.join("_") + ".png";
  const out = body.replace(
    /https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g,
    PIC);
  note("换车型",tail,out===body?"未匹配到车图":"已切换");
  $done({body:out});
}
