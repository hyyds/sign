/**
 * ============================================================
 *  极氪「爱车」外观 —— 009
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_009.snippet（一条资源搞定，不需要再配对别的）
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
const SERIES = "EF1E";        // App 内 light_show_ef1e.json
const NAME   = "ZEEKR 009";

// ---- 车型配置（决定颜色/轮毂）----
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
