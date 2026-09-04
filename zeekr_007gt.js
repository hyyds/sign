/**
 * ============================================================
 *  极氪「爱车」外观 —— 007GT          ver 2
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_007gt.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ------------------------------------------------------------
 *  ver2 说明：App 是用响应里的 modelInfoId + versionId + 产品编码
 *  自己拼车图 URL 的，只改 vehiclePicUrl 不生效，所以这版把
 *  这几样一起改掉。
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

const MID  = "9";     // modelInfoId
const VID  = "50";    // versionId

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z010PC013",   // 段1  车漆
  "Z010PC015",   // 段2  外观/配置
  "Z010PC024",   // 段3  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  车漆 ──
 *    Z010PC005   #C6C6C6
 *    Z010PC006   #3C3C42
 *    Z010PC007   #242424
 *    Z010PC008   #EAE4DE
 *    Z010PC009   #90969C
 *    Z010PC010   #6690C0
 *    Z010PC011   #24241E
 *    Z010PC012   #2A242A
 *    Z010PC013   #60607E
 *    Z010PC053   #907E72
 * ── 段2  外观/配置 ──
 *    Z010PC014
 *    Z010PC015
 * ── 段3  轮毂 ──
 *    Z010PC016
 *    Z010PC017
 *    Z010PC018
 *    Z010PC019
 *    Z010PC020
 *    Z010PC021
 *    Z010PC022
 *    Z010PC023
 *    Z010PC024
 */

function note(a,b,c){ if(DEBUG) $notify("极氪·007GT "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body !== "string" || !body.length) {
  $done({});
} else {
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/" + MID + "/" + VID + "/" + SLOTS.join("_") + ".png";
  const before = body;
  let out = body;

  // 1) 整车图 / 俯视图 URL
  out = out.replace(/https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g, PIC);
  // 2) 车型 / 年款 标识（App 用它俩拼 URL）
  out = out.replace(/"modelInfoId"\s*:\s*"?\d+"?/g, '"modelInfoId":"' + MID + '"');
  out = out.replace(/"versionId"\s*:\s*"?\d+"?/g,   '"versionId":"' + VID + '"');
  // 3) 产品编码清单
  out = out.replace(/"productList"\s*:\s*\[[^\]]*\]/g,
                    '"productList":[' + SLOTS.map(function(s){return '"'+s+'"';}).join(",") + ']');

  note(out === before ? "未匹配" : "已切换", tail, MID + "/" + VID + " " + SLOTS.join("_"));
  $done({ body: out });
}
