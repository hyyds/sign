/**
 * ============================================================
 *  极氪「爱车」外观 —— 7X
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_7x.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z008PC003",   // 段1  车漆
  "Z008PC035",   // 段2  外观/车顶
  "Z008PC036",   // 段3  外观/车顶
  "Z008PC033",   // 段4  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  车漆 ──
 *    Z008PC003   #BABABA
 *    Z008PC004   #546684
 *    Z008PC005   #183624
 *    Z008PC006   #303036
 *    Z008PC043   #2A242A
 *    Z008PC044   #969CA2
 * ── 段2  外观/车顶 ──
 *    Z008PC010
 *    Z008PC035
 * ── 段3  外观/车顶 ──
 *    Z008PC021
 *    Z008PC036
 * ── 段4  轮毂 ──
 *    Z008PC011
 *    Z008PC012
 *    Z008PC032
 *    Z008PC033
 *    Z008PC034
 *    Z008PC046
 *    Z008PC049
 *    Z008PC050
 */

function note(a,b,c){ if(DEBUG) $notify("极氪·7X "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body!=="string" || !body.length || body.indexOf("showcar/vehicle")===-1) {
  $done({});
} else {
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/8/61/" + SLOTS.join("_") + ".png";
  const out = body.replace(
    /https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g,
    PIC);
  note("换车型",tail,out===body?"未匹配到车图":"已切换");
  $done({body:out});
}
