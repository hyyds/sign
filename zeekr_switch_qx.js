/**
 * 极氪 爱车外观切换器  —— Quantumult X
 * 重写类型必须选：script-response-body
 *
 * 原理：极氪后端下发车辆配置 JSON，里面带渲染用的三段编码
 *   Z001C### = 车漆   Z001S### = 规格   Z001H### = 轮毂
 * 本脚本改写这份 JSON（vehiclePicUrl / topViewImg / productList），
 * App 拿到新配置后就按新组合渲染。
 *
 * ---------- 可选值（已实测存在） ----------
 *  车漆 C: C001(极昼白) C003 C004 C007 C008 C009
 *  规格 S: S001 S002 S003 S011
 *  轮毂 H: H001 H002 H003 H004 H005
 *          H006 = 22寸花瓣（你的实车）
 *          H007 = 19寸五辐（官方错配的默认值）
 *          H008 H009
 * ------------------------------------------
 */

// ======== 只改这三行 ========
const C = "C001";   // 车漆
const S = "S003";   // 规格
const H = "H006";   // 轮毂 —— 22寸花瓣
// ===========================

let body = $response.body;

if (typeof body === "string" && body.length) {
  const out = body
    // 1) 图片 URL 里的完整三段：Z001C###_Z001S###_Z001H###
    .replace(/Z001C\d{3}_Z001S\d{3}_Z001H\d{3}/g,
             "Z001" + C + "_Z001" + S + "_Z001" + H)
    // 2) 俯视图 URL 里的两段：Z001C###_Z001S###
    .replace(/Z001C\d{3}_Z001S\d{3}/g,
             "Z001" + C + "_Z001" + S)
    // 3) productList 里独立成项的编码（带引号，避免误伤 Z001S008 等其他配置项）
    .replace(/"Z001C\d{3}"/g, '"Z001' + C + '"')
    .replace(/"Z001H\d{3}"/g, '"Z001' + H + '"');
  $done({ body: out });
} else {
  $done({});
}
