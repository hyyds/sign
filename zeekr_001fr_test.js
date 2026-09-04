/**
 * ============================================================
 *  【实验】极氪 001 FR —— 验证车模是不是纯靠 seriesCode 决定
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_001fr_test.snippet
 * ------------------------------------------------------------
 *  背景：FR 既没有 showcar/vehicle 透明车图（28 个组合全 404），
 *        本地 laya3DManifest.json 里也没有 fr 的模型包。
 *
 *  本脚本只把车系身份改成 DC1EFR，配置编码保持 001 原样
 *  （MID=1 / VID=11 / 001 的编码，保证图片请求不会 404）。
 *
 *  预期结果：
 *    车模变成 FR  → 说明 App 还有别处能取到 FR 资源，我判断错了
 *    车模还是 001 → 印证「没有资源就渲染不出来」，FR 确实做不了
 *
 *  两种结果都有用，测完把这条资源关掉即可。
 * ============================================================
 */

const ENABLED = true;
const DEBUG   = true;

const SERIES = "DC1EFR";
const NAME   = "ZEEKR 001 FR";

// 配置保持 001 原样，确保车图 URL 有效
const MID   = "1";
const VID   = "11";
const SLOTS = ["Z001C001", "Z001S003", "Z001H006"];

function note(a,b,c){ if(DEBUG) $notify("极氪·FR实验 "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

if (!ENABLED || typeof body !== "string" || !body.length) {
  $done({});

} else if (url.indexOf("favorite-vehicles") !== -1) {
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
  const PIC = "https://zeekrlife-oss.zeekrlife.com/showcar/vehicle/" + MID + "/" + VID + "/" + SLOTS.join("_") + ".png";
  let out = body;
  out = out.replace(/https:\\?\/\\?\/zeekrlife-oss\.zeekrlife\.com\\?\/showcar\\?\/vehicle\\?\/[0-9]+\\?\/[0-9]+\\?\/[A-Za-z0-9_]+\.png/g, PIC);
  out = out.replace(/"modelInfoId"\s*:\s*"?\d+"?/g, '"modelInfoId":"' + MID + '"');
  out = out.replace(/"versionId"\s*:\s*"?\d+"?/g,   '"versionId":"' + VID + '"');
  out = out.replace(/"productList"\s*:\s*\[[^\]]*\]/g,
                    '"productList":[' + SLOTS.map(function(s){return '"'+s+'"';}).join(",") + ']');
  note("配置", tail, MID + "/" + VID);
  $done({ body: out });
}
