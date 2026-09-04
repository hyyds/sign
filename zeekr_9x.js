/**
 * ============================================================
 *  极氪「爱车」外观 —— 9X
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_9x.snippet（一条资源搞定，不需要再配对别的）
 * ------------------------------------------------------------
 *  脚本同时处理两个接口：
 *    极氪侧 zeekrlife-mp-order/*      → 改配置编码，决定颜色/轮毂
 *    吉利侧 gric-api favorite-vehicles → 改车系身份，决定用哪个 3D 车模
 *  两边缺一不可，只改一边车模会被拉回 001。
 * ------------------------------------------------------------
 *  ⚠️ 同时只开一个车型脚本。
 *  ⚠️ seriesCode 同时决定 App 显示哪些车控功能：会少掉灯光秀等
 *     001 专有项，多出冰箱/遮阳帘等你车上没有的项。多出来的按钮
 *     点了会报错，但不会误伤车辆——指令要带 VIN，而 vin / tspHost
 *     / plateNo / pno18 本脚本一律不动。建议看完就关掉。
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false

// ---- 车系身份（决定 3D 车模）----
const SERIES = "EX1H";        // 已实测通过
const NAME   = "ZEEKR 9X";

// ---- 车型配置（决定颜色/轮毂）----
const MID  = "10";     // modelInfoId
const VID  = "54";    // versionId

// ============ 改这里：每段挑一个值 ============
const SLOTS = [
  "Z011PC011",   // 段1  外观/配置
  "Z011PC002",   // 段2  车漆
  "Z011PC021",   // 段3  外观/配置
  "Z011PC026",   // 段4  轮毂
];
// =============================================

/* 各段可选值
 * ── 段1  外观/配置 ──
 *    Z011PC011
 *    Z011PC012
 * ── 段2  车漆 ──
 *    Z011PC002   #6C6C6C
 *    Z011PC003   #DEDEDE
 *    Z011PC004   #D8D8DE
 *    Z011PC005   #1E1E24
 *    Z011PC006   #1E1E24
 *    Z011PC045   #423C36
 * ── 段3  外观/配置 ──
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

if (!ENABLED || typeof body !== "string" || !body.length) {
  $done({});

} else if (url.indexOf("favorite-vehicles") !== -1) {
  // —— 吉利侧：车系身份 ——
  if (body.indexOf("seriesCode") === -1) { $done({}); }
  else {
    const before = (body.match(/"seriesCode"\s*:\s*"([^"]*)"/) || [])[1] || "-";
    let out = body
      .replace(/"seriesCode"\s*:\s*"[^"]*"/g,   '"seriesCode":"' + SERIES + '"')
      .replace(/"appinnerCode"\s*:\s*"[^"]*"/g, '"appinnerCode":"' + SERIES + '"')
      .replace(/"seriesName"\s*:\s*"[^"]*"/g,   '"seriesName":"' + NAME + '"')
      .replace(/"modelCode"\s*:\s*"([A-Z0-9]+)(-[^"]*)?"/g,
               function(_, a, b){ return '"modelCode":"' + SERIES + (b || "") + '"'; });
    note("车系", tail, before + " -> " + SERIES);
    $done({ body: out });
  }

} else {
  // —— 极氪侧：车型配置 ——
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/" + MID + "/" + VID + "/" + SLOTS.join("_") + ".png";
  const before = body;
  let out = body;
  out = out.replace(/https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g, PIC);
  out = out.replace(/"modelInfoId"\s*:\s*"?\d+"?/g, '"modelInfoId":"' + MID + '"');
  out = out.replace(/"versionId"\s*:\s*"?\d+"?/g,   '"versionId":"' + VID + '"');
  out = out.replace(/"productList"\s*:\s*\[[^\]]*\]/g,
                    '"productList":[' + SLOTS.map(function(s){return '"'+s+'"';}).join(",") + ']');
  note(out === before ? "未匹配" : "配置", tail, MID + "/" + VID);
  $done({ body: out });
}
