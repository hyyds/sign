/**
 * 极氪 爱车外观切换器  —— Quantumult X
 * 重写类型：script-response-body
 * ver: 3  (带调试通知)
 *
 *  车漆 C: C001(极昼白) C003 C004 C007 C008 C009
 *  规格 S: S001 S002 S003 S011
 *  轮毂 H: H001~H009；H006=22寸花瓣  H007=19寸五辐(官方默认)
 */

// ======== 只改这三行 ========
const C = "C001";
const S = "S003";
const H = "H006";
// ===========================

const SYNC_THUMBS = true;
const DEBUG = true;          // 调通后改成 false 关掉通知

function notify(t, s, b) { if (DEBUG) $notify("极氪切换器 " + t, s, b); }

let body = $response.body;
const url = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").slice(-1)[0];

if (typeof body !== "string" || !body.length) {
  notify("跳过", tail, "响应体为空或非文本");
  $done({});
} else if (body.indexOf("Z001") === -1) {
  notify("跳过", tail, "响应里没有 Z001 编码");
  $done({});
} else {
  const before = (body.match(/Z001H\d{3}/g) || []).join(",");
  let out = body
    .replace(/Z001C\d{3}_Z001S\d{3}_Z001H\d{3}/g, "Z001" + C + "_Z001" + S + "_Z001" + H)
    .replace(/Z001C\d{3}_Z001S\d{3}/g, "Z001" + C + "_Z001" + S)
    .replace(/Z001C\d{3}(?=["_])/g, "Z001" + C)
    .replace(/Z001H\d{3}(?=["_])/g, "Z001" + H);

  if (SYNC_THUMBS) {
    const n = parseInt(H.slice(1), 10);
    if (n > 0) out = out.replace(/\/pc\/hub\d+\.png/g, "/pc/hub" + n + ".png");
  }

  const after = (out.match(/Z001H\d{3}/g) || []).join(",");
  notify("已改写", tail, before + "  ->  " + after);
  $done({ body: out });
}
