/**
 * ============================================================
 *  极氪「爱车」外观 —— 009          ver 2
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_009.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ------------------------------------------------------------
 *  ver2 说明：App 是用响应里的 modelInfoId + versionId + 产品编码
 *  自己拼车图 URL 的，只改 vehiclePicUrl 不生效，所以这版把
 *  这几样一起改掉。
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

const MID  = "2";     // modelInfoId
const VID  = "8";    // versionId

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z009PC001",   // 段1  车漆
  "Z009PC005",   // 段2  外观/配置
  "Z009PC018",   // 段3  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  车漆 ──
 *    Z009PC001   #242424
 *    Z009PC002   #C6CCCC
 *    Z009PC003   #181E2A
 *    Z009PC004   #72726C
 * ── 段2  外观/配置 ──
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
