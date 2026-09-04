/**
 * 极氪 爱车外观切换器  —— Quantumult X
 * 重写类型：script-response-body
 *
 * 极氪后端有 5 个接口都会下发同一套渲染编码，任何一个漏掉，
 * 页面都会在后到的响应里被盖回原样（表现为"闪一下又变回去"）。
 * 所以 5 条规则必须全部加上。
 *
 * ---------- 可选值（已实测存在） ----------
 *  车漆 C: C001(极昼白) C003 C004 C007 C008 C009
 *  规格 S: S001 S002 S003 S011
 *  轮毂 H: H001~H009；H006 = 22寸花瓣（你的实车）
 *                      H007 = 19寸五辐（官方默认）
 * ------------------------------------------
 */

// ======== 只改这三行 ========
const C = "C001";   // 车漆
const S = "S003";   // 规格
const H = "H006";   // 轮毂 —— 22寸花瓣
// ===========================

const SYNC_THUMBS = true;   // 同步替换配置清单里的轮毂缩略图

let body = $response.body;

if (typeof body === "string" && body.length && body.indexOf("Z001") !== -1) {
  let out = body
    // 1) 主车图 URL 的完整三段
    .replace(/Z001C\d{3}_Z001S\d{3}_Z001H\d{3}/g,
             "Z001" + C + "_Z001" + S + "_Z001" + H)
    // 2) 俯视图 URL 的两段
    .replace(/Z001C\d{3}_Z001S\d{3}/g,
             "Z001" + C + "_Z001" + S)
    // 3) 独立成项的编码 + SKU 缩略图前缀（后面跟引号或下划线才替换，
    //    避免误伤 Z001S008 / Z001T001 等其它配置项）
    .replace(/Z001C\d{3}(?=["_])/g, "Z001" + C)
    .replace(/Z001H\d{3}(?=["_])/g, "Z001" + H);

  // 4) 轮毂缩略图 pc/hub{N}.png，N 取自 H 编号
  if (SYNC_THUMBS) {
    const n = parseInt(H.slice(1), 10);
    if (n > 0) out = out.replace(/\/pc\/hub\d+\.png/g, "/pc/hub" + n + ".png");
  }

  $done({ body: out });
} else {
  $done({});
}
