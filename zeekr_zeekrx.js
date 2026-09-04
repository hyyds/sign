/**
 * ============================================================
 *  极氪「爱车」外观 —— 极氪X
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_zeekrx.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z003PC007",   // 段1  车漆
  "Z003PC011",   // 段2  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  车漆 ──
 *    Z003PC004   #E4E4E4
 *    Z003PC005   #BAC0C0
 *    Z003PC006   #BAAEAE
 *    Z003PC007   #D2C6C0
 *    Z003PC008   #42C6C6
 *    Z003PC009   #3C483C
 * ── 段2  轮毂 ──
 *    Z003PC010
 *    Z003PC011
 *    Z003PC012
 *    Z003PC013
 *    Z003PC014
 */

function note(a,b,c){ if(DEBUG) $notify("极氪·极氪X "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body!=="string" || !body.length || body.indexOf("showcar/vehicle")===-1) {
  $done({});
} else {
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/3/14/" + SLOTS.join("_") + ".png";
  const out = body.replace(
    /https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g,
    PIC);
  note("换车型",tail,out===body?"未匹配到车图":"已切换");
  $done({body:out});
}
