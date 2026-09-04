/**
 * ============================================================
 *  【试探版】只改车系显示名，不动任何编码
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_test_series.snippet
 * ------------------------------------------------------------
 *  目的：确认爱车页的 3D 车模到底认哪个字段
 *    · 车模跟着变 → 认 seriesName，车控功能完全不受影响
 *    · 只有标题变 → 必须改 seriesCode，那会连带改变车控功能列表
 *
 *  本脚本只改一个显示字段，vin / tspHost / plateNo / seriesCode
 *  全部原样不动，不影响车控。
 * ============================================================
 */

const ENABLED = true;
const DEBUG   = true;

// 想显示成哪台车（纯文字）
const NAME = "ZEEKR 9X";

let body = $response.body;

if (!ENABLED || typeof body !== "string" || body.indexOf("seriesName") === -1) {
  $done({});
} else {
  const before = (body.match(/"seriesName"\s*:\s*"([^"]*)"/) || [])[1] || "-";
  const out = body.replace(/"seriesName"\s*:\s*"[^"]*"/g, '"seriesName":"' + NAME + '"');
  if (DEBUG) $notify("极氪·试探", "seriesName", before + " -> " + NAME);
  $done({ body: out });
}
