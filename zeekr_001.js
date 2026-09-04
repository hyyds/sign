/**
 * ============================================================
 *  极氪「爱车」外观 —— 001 轮毂/车漆
 *  Quantumult X · 重写类型 script-response-body
 *  配套资源：zeekr_001.snippet
 *  ⚠️ 同时只启用一个车型脚本
 * ============================================================
 */

const ENABLED = true;   // 总开关
const DEBUG   = true;   // 调通后改 false 关掉通知

function note(a,b,c){ if(DEBUG) $notify("极氪·001 轮毂/车漆 "+a,b,c); }
const url  = ($request && $request.url) ? $request.url : "";
const tail = url.split("?")[0].split("/").pop();
let body   = $response.body;

// ============ 改这三行 ============
const C = "C001";   // 车漆
const S = "S003";   // 车顶
const H = "H006";   // 轮毂
// =================================

/* 车漆 C  C001极昼白#CCCDD1(原车) C003中灰#828485 C004蓝灰#97A1B2
 *         C007深灰近黑#3D3D3F  C008宝石蓝#32559D  C009熔岩橙#C14813(=C010)
 *         ✗ C002/C005/C006 无图会404
 * 车顶 S  S001同车身色  S002纯黑  S003撞色车顶(原车,=S011)
 * 轮毂 H  H001黑色低风阻五叶片      H002黑银双色多辐涡轮
 *         H003全银十辐直条          H004黑银双色多辐(似H002非同款)
 *         H005银色十辐扭转          H006黑色花瓣六边形镂空 22寸 ★实车
 *         H007银黑双色五辐 19英寸五辐轻铝合金轮毂(官方默认)
 *         H008黑色密集编织多辐 中心Z标(=H009)
 *         ※ 尺寸仅 H006/H007 官方确认，其余按渲染图描述外观
 */

if (!ENABLED || typeof body!=="string" || !body.length || body.indexOf("Z001")===-1) {
  $done({});
} else {
  const before=(body.match(/Z001H\d{3}/g)||[])[0]||"-";
  let out=body
    .replace(/Z001C\d{3}_Z001S\d{3}_Z001H\d{3}/g,"Z001"+C+"_Z001"+S+"_Z001"+H)
    .replace(/Z001C\d{3}_Z001S\d{3}/g,"Z001"+C+"_Z001"+S)
    .replace(/Z001C\d{3}(?=["_])/g,"Z001"+C)
    .replace(/Z001H\d{3}(?=["_])/g,"Z001"+H);
  const n=parseInt(H.slice(1),10);
  if(n>0) out=out.replace(/\/pc\/hub\d+\.png/g,"/pc/hub"+n+".png");
  note("已改写",tail,before+" -> Z001"+H);
  $done({body:out});
}
