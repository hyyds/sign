/**
 * ============================================================
 *  极氪「爱车」外观 —— 8X
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_8x.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z012PC006",   // 段1  外观/车顶
  "Z012PC008",   // 段2  车漆
  "Z012PC027",   // 段3  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  外观/车顶 ──
 *    Z012PC006
 *    Z012PC007
 *    Z012PC046
 * ── 段2  车漆 ──
 *    Z012PC008   #2A2A30
 *    Z012PC013   #0C6684
 *    Z012PC014   #36363C
 * ── 段3  轮毂 ──
 *    Z012PC027
 *    Z012PC049
 *    Z012PC050
 */

function note(a,b,c){ if(DEBUG) $notify("极氪·8X "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body!=="string" || !body.length || body.indexOf("showcar/vehicle")===-1) {
  $done({});
} else {
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/11/70/" + SLOTS.join("_") + ".png";
  const out = body.replace(
    /https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g,
    PIC);
  note("换车型",tail,out===body?"未匹配到车图":"已切换");
  $done({body:out});
}
