/**
 * ============================================================
 *  极氪 车系身份改写（换整车车模用）
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_series.snippet
 * ------------------------------------------------------------
 *  用法：与对应车型脚本（如 zeekr_9x）一起开启。
 *        本脚本改吉利侧的车系身份，车型脚本改极氪侧的配置编码，
 *        两边一致车模才不会被拉回 001。
 * ------------------------------------------------------------
 *  ⚠️ 重要：seriesCode 同时决定 App 显示哪些车控功能。
 *     改成 9X 后：
 *       会消失 → 灯光秀 / 家人账号 / 手表钥匙 等 6 项
 *       会多出 → 冰箱 / 遮阳帘 / 储物盒 / 人脸识别 等 13 项
 *     多出来的按钮点了会报错（你车上没有），但不会误伤车辆：
 *     指令要带 VIN，而 vin / tspHost / plateNo 本脚本一律不动。
 *     建议看完就把这条资源关掉。
 * ============================================================
 *  车系代码表（取自 App 内 vehicle_functions.json）
 *    DC1E   = 001            DC1EFR = 001 FR
 *    EF1E   = 009            EF1E4S = 009 光辉
 *    BX1E   = 极氪X           CC1E   = 007GT
 *    CM2E   = MIX            EX1H   = 9X
 *    其余未确认：CS1E DC1EA2 EF1EA1 CX1E EX1E DX1H DX1E BX1EA2
 * ============================================================
 */

const ENABLED = true;
const DEBUG   = true;

// ============ 改这两行 ============
const SERIES = "EX1H";        // 目标车系代码
const NAME   = "ZEEKR 9X";    // 目标显示名
// =================================

const ALSO_MODELCODE = true;  // 一并把 modelCode 前缀换成目标车系

let body = $response.body;

if (!ENABLED || typeof body !== "string" || body.indexOf("seriesCode") === -1) {
  $done({});
} else {
  const before = (body.match(/"seriesCode"\s*:\s*"([^"]*)"/) || [])[1] || "-";
  let out = body
    .replace(/"seriesCode"\s*:\s*"[^"]*"/g,   '"seriesCode":"' + SERIES + '"')
    .replace(/"appinnerCode"\s*:\s*"[^"]*"/g, '"appinnerCode":"' + SERIES + '"')
    .replace(/"seriesName"\s*:\s*"[^"]*"/g,   '"seriesName":"' + NAME + '"');

  if (ALSO_MODELCODE) {
    out = out.replace(/"modelCode"\s*:\s*"([A-Z0-9]+)(-[^"]*)?"/g,
                      function(_, a, b){ return '"modelCode":"' + SERIES + (b || "") + '"'; });
  }

  if (DEBUG) $notify("极氪·车系", "seriesCode", before + " -> " + SERIES);
  $done({ body: out });
}
