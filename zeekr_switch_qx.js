/**
 * ============================================================
 *  极氪 001 · 爱车外观切换器  (Quantumult X JS)
 * ============================================================
 *  部署：
 *  1. 本文件放到手机/云端可访问路径
 *  2. Quantumult X → 配置 → 重写 → 添加：
 *       ^https://zeekrlife-oss\.zeekrlife\.com/(showcar|frontend/unity/laya)/vehicle/1/11/.* script-path=<本文件路径>
 *  3. MITM 勾选 hostname：zeekrlife-oss.zeekrlife.com
 *  4. 打开 Quantumult X 的「MitM + 重写」，进爱车页刷新
 * ============================================================
 *  「切换 & 保存」用法（任选其一）：
 *    ① 改下面 PRESET_IDX 的数值（1 起计），保存后切组即生效；
 *    ② 用 Quantumult X 的 $prefs 持久化：脚本会自动记录上次
 *       选中的组合，下次运行保持不变（需在 QuantumultX 里
 *       把本脚本作为"定时/手动"执行一次以写入）。
 * ============================================================
 *  已实测样式（OSS 官方池，全部真实存在）：
 *     颜色 C:  C001极昼白 C003 C004 C007 C008 C009
 *     规格 S:  S001 S002 S003 S011
 *     轮毂 H:  H001~H009；H006=22寸花瓣轮毂(你的实车)
 *             H007=当前默认(19寸五辐)
 * ============================================================
 */

// ---------- 组合预设集（按喜好增删） ----------
const PRESETS = {
  "花瓣·极昼白":   { C: "C001", S: "S003", H: "H006" }, // 你的实车·22寸花瓣
  "花瓣·墨蓝":     { C: "C009", S: "S003", H: "H006" }, // 花瓣 + 墨蓝车漆
  "大轮圈·极昼白": { C: "C001", S: "S003", H: "H009" }, // 另一种大轮毂
  "默认19寸":      { C: "C001", S: "S003", H: "H007" }, // 切回官方默认
};
const PRESET_KEYS = Object.keys(PRESETS);

// 默认/当前想用的组合序号（1 起）。改这里 = 切换组合。
var PRESET_IDX = 1;

// ============================================================
//  以下引擎逻辑一般无需改动
// ============================================================
const url = $request.url || "";
if (!url || url.indexOf("vehicle/1/11/") === -1) {
  $done({});
  return;
}

// 从 $prefs 读回上次保存的生效序号（若存在则沿用）
var savedIdx = null;
try {
  savedIdx = $prefs.valueForKey("zk001_combo_idx");
} catch (e) { savedIdx = null; }
if (savedIdx && PRESET_KEYS[savedIdx - 1]) {
  PRESET_IDX = savedIdx;
}
// 把这次解析到的"当前生效组合"写回 prefs（供下次持续）
try {
  $prefs.setValueForKey("" + PRESET_IDX, "zk001_combo_idx");
} catch (e) {}

var idx = PRESET_IDX;
if (idx < 1) idx = 1;
if (idx > PRESET_KEYS.length) idx = PRESET_KEYS.length;
var combo = PRESETS[PRESET_KEYS[idx - 1]];

let u = url.replace(/Z001C\d{3}/, "Z001" + combo.C);
u = u.replace(/Z001S\d{3}/,  "Z001" + combo.S);
u = u.replace(/Z001H\d{3}/,  "Z001" + combo.H);

if (u !== url) {
  $done({ url: u });
} else {
  $done({});
}