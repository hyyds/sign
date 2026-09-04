/**
 * ============================================================
 *  极氪「爱车」外观 —— 9X
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_9x.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z011PC011",   // 段1  外观/车顶
  "Z011PC002",   // 段2  车漆
  "Z011PC021",   // 段3  外观/车顶
  "Z011PC026",   // 段4  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  外观/车顶 ──
 *    Z011PC011
 *    Z011PC012
 * ── 段2  车漆 ──
 *    Z011PC002   #6C6C6C
 *    Z011PC003   #DEDEDE
 *    Z011PC004   #D8D8DE
 *    Z011PC005   #1E1E24
 *    Z011PC006   #1E1E24
 *    Z011PC045   #423C36
 * ── 段3  外观/车顶 ──
 *    Z011PC020
 *    Z011PC021
 *    Z011PC022
 *    Z011PC023
 *    Z011PC038
 * ── 段4  轮毂 ──
 *    Z011PC024
 *    Z011PC026
 *    Z011PC027
 *    Z011PC028
 *    Z011PC029
 *    Z011PC032
 *    Z011PC039
 */

function note(a,b,c){ if(DEBUG) $notify("极氪·9X "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body!=="string" || !body.length || body.indexOf("showcar/vehicle")===-1) {
  $done({});
} else {
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/10/54/" + SLOTS.join("_") + ".png";
  const out = body.replace(
    /https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g,
    PIC);
  note("换车型",tail,out===body?"未匹配到车图":"已切换");
  $done({body:out});
}
