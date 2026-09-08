/**
 * ============================================================
 *  华发 · 滑行天数    Quantumult X · script-response-body
 *  配套资源: huafa_growth_days.snippet
 * ------------------------------------------------------------
 *  把 user/growth 响应里的 currentGrowthValue(成长值)
 *  渲染成 "滑行XX天"。
 *  换算: 总积分 = 当前等级门槛(levelList.absoluteValue) + 余额
 *        天数   = floor(总积分 / 每次积分)
 *  响应是 AES-128-CBC 加密, 解密->改值->重加密, 需开启 MITM。
 *  测完把这条资源关掉即可。
 * ============================================================
 */

const ENABLED        = true;
const DEBUG          = true;
const POINTS_PER_DAY = 1000;              // 每次滑行获得的成长值
const AES_KEY        = "BiwhZQXWSFEomnlr";
const AES_IV         = "1673492601549025";

function note(a, b, c){ if(DEBUG && typeof $notify !== "undefined") $notify("华发·滑行天数 " + a, b || "", c || ""); }

// ---------- 纯JS AES-128-CBC ----------
var SBOX=[],INV_SBOX=[],RCON=[0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];
(function(){var p=1,q=1;do{p=p^(p<<1)^(p&0x80?0x11b:0);p&=0xff;q^=q<<1;q^=q<<2;q^=q<<4;q&=0xff;if(q&0x80)q^=0x09;q&=0xff;
var x=q^((q<<1)|(q>>7))^((q<<2)|(q>>6))^((q<<3)|(q>>5))^((q<<4)|(q>>4));SBOX[p]=(x&0xff)^0x63;}while(p!==1);SBOX[0]=0x63;
for(var i=0;i<256;i++)INV_SBOX[SBOX[i]]=i;})();
function xtime(a){return((a<<1)^(a&0x80?0x1b:0))&0xff;}
function mul(a,b){var r=0;for(var i=0;i<8;i++){if(b&1)r^=a;var hi=a&0x80;a=(a<<1)&0xff;if(hi)a^=0x1b;b>>=1;}return r&0xff;}
function keyExpansion(key){var w=[];for(var i=0;i<4;i++)w[i]=[key[4*i],key[4*i+1],key[4*i+2],key[4*i+3]];
for(i=4;i<44;i++){var t=w[i-1].slice();if(i%4===0){t=[t[1],t[2],t[3],t[0]];t=t.map(function(b){return SBOX[b];});t[0]^=RCON[i/4-1];}
w[i]=w[i-4].map(function(b,j){return b^t[j];});}return w;}
function addRoundKey(s,w,r){for(var c=0;c<4;c++)for(var row=0;row<4;row++)s[row][c]^=w[r*4+c][row];}
function subBytes(s,box){for(var r=0;r<4;r++)for(var c=0;c<4;c++)s[r][c]=box[s[r][c]];}
function shiftRows(s){for(var r=1;r<4;r++){var t=s[r].slice();for(var c=0;c<4;c++)s[r][c]=t[(c+r)%4];}}
function invShiftRows(s){for(var r=1;r<4;r++){var t=s[r].slice();for(var c=0;c<4;c++)s[r][c]=t[(c-r+4)%4];}}
function mixColumns(s){for(var c=0;c<4;c++){var a=[s[0][c],s[1][c],s[2][c],s[3][c]];
s[0][c]=xtime(a[0])^(xtime(a[1])^a[1])^a[2]^a[3];s[1][c]=a[0]^xtime(a[1])^(xtime(a[2])^a[2])^a[3];
s[2][c]=a[0]^a[1]^xtime(a[2])^(xtime(a[3])^a[3]);s[3][c]=(xtime(a[0])^a[0])^a[1]^a[2]^xtime(a[3]);}}
function invMixColumns(s){for(var c=0;c<4;c++){var a=[s[0][c],s[1][c],s[2][c],s[3][c]];
s[0][c]=mul(a[0],14)^mul(a[1],11)^mul(a[2],13)^mul(a[3],9);s[1][c]=mul(a[0],9)^mul(a[1],14)^mul(a[2],11)^mul(a[3],13);
s[2][c]=mul(a[0],13)^mul(a[1],9)^mul(a[2],14)^mul(a[3],11);s[3][c]=mul(a[0],11)^mul(a[1],13)^mul(a[2],9)^mul(a[3],14);}}
function toState(b){var s=[[],[],[],[]];for(var i=0;i<16;i++)s[i%4][(i/4)|0]=b[i];return s;}
function fromState(s){var b=[];for(var i=0;i<16;i++)b[i]=s[i%4][(i/4)|0];return b;}
function encBlock(block,w){var s=toState(block);addRoundKey(s,w,0);
for(var r=1;r<10;r++){subBytes(s,SBOX);shiftRows(s);mixColumns(s);addRoundKey(s,w,r);}
subBytes(s,SBOX);shiftRows(s);addRoundKey(s,w,10);return fromState(s);}
function decBlock(block,w){var s=toState(block);addRoundKey(s,w,10);
for(var r=9;r>=1;r--){invShiftRows(s);subBytes(s,INV_SBOX);addRoundKey(s,w,r);invMixColumns(s);}
invShiftRows(s);subBytes(s,INV_SBOX);addRoundKey(s,w,0);return fromState(s);}
function strBytes(str){var a=[];for(var i=0;i<str.length;i++)a.push(str.charCodeAt(i)&0xff);return a;}
function cbcEncrypt(plainBytes,keyStr,ivStr){var w=keyExpansion(strBytes(keyStr));
var pad=16-(plainBytes.length%16);for(var i=0;i<pad;i++)plainBytes.push(pad);
var prev=strBytes(ivStr),out=[];for(i=0;i<plainBytes.length;i+=16){
var blk=plainBytes.slice(i,i+16).map(function(b,j){return b^prev[j];});var enc=encBlock(blk,w);out=out.concat(enc);prev=enc;}return out;}
function cbcDecrypt(cipherBytes,keyStr,ivStr){var w=keyExpansion(strBytes(keyStr));
var prev=strBytes(ivStr),out=[];for(var i=0;i<cipherBytes.length;i+=16){
var blk=cipherBytes.slice(i,i+16);var dec=decBlock(blk,w).map(function(b,j){return b^prev[j];});out=out.concat(dec);prev=blk;}
var pad=out[out.length-1];return out.slice(0,out.length-pad);}

// ---------- base64 <-> bytes ----------
var B64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64ToBytes(str){str=str.replace(/[^A-Za-z0-9+/=]/g,"");var out=[];var i=0;
while(i<str.length){var e1=B64.indexOf(str.charAt(i++)),e2=B64.indexOf(str.charAt(i++)),
e3=B64.indexOf(str.charAt(i++)),e4=B64.indexOf(str.charAt(i++));
var c1=(e1<<2)|(e2>>4),c2=((e2&15)<<4)|(e3>>2),c3=((e3&3)<<6)|e4;out.push(c1);
if(e3!==64&&e3>=0)out.push(c2&0xff);if(e4!==64&&e4>=0)out.push(c3&0xff);}return out;}
function bytesToB64(bytes){var out="";for(var i=0;i<bytes.length;i+=3){var b1=bytes[i],b2=i+1<bytes.length?bytes[i+1]:NaN,b3=i+2<bytes.length?bytes[i+2]:NaN;
out+=B64.charAt(b1>>2);out+=B64.charAt(((b1&3)<<4)|(isNaN(b2)?0:b2>>4));
out+=isNaN(b2)?"=":B64.charAt(((b2&15)<<2)|(isNaN(b3)?0:b3>>6));out+=isNaN(b3)?"=":B64.charAt(b3&63);}return out;}

// ---------- UTF-8 <-> bytes ----------
function utf8Encode(str){var b=[];for(var i=0;i<str.length;i++){var c=str.charCodeAt(i);
if(c<0x80)b.push(c);else if(c<0x800){b.push(0xc0|(c>>6));b.push(0x80|(c&0x3f));}
else if(c>=0xd800&&c<0xe000){var c2=str.charCodeAt(++i);var cp=0x10000+((c&0x3ff)<<10)+(c2&0x3ff);
b.push(0xf0|(cp>>18));b.push(0x80|((cp>>12)&0x3f));b.push(0x80|((cp>>6)&0x3f));b.push(0x80|(cp&0x3f));}
else{b.push(0xe0|(c>>12));b.push(0x80|((c>>6)&0x3f));b.push(0x80|(c&0x3f));}}return b;}
function utf8Decode(bytes){var s="",i=0;while(i<bytes.length){var c=bytes[i++];
if(c<0x80)s+=String.fromCharCode(c);else if(c<0xe0){s+=String.fromCharCode(((c&0x1f)<<6)|(bytes[i++]&0x3f));}
else if(c<0xf0){s+=String.fromCharCode(((c&0x0f)<<12)|((bytes[i++]&0x3f)<<6)|(bytes[i++]&0x3f));}
else{var cp=((c&0x07)<<18)|((bytes[i++]&0x3f)<<12)|((bytes[i++]&0x3f)<<6)|(bytes[i++]&0x3f);cp-=0x10000;
s+=String.fromCharCode(0xd800+(cp>>10),0xdc00+(cp&0x3ff));}}return s;}

// ---------- 主逻辑 ----------
const requestUrl = ($request && $request.url) ? $request.url : "";
const requestTail = requestUrl.split("?")[0].split("/").pop();
let responseBody = ($response && $response.body) ? $response.body : "";

if (!ENABLED || typeof responseBody !== "string" || !responseBody.length) {
  $done({});

} else {
  // 一进来先把响应体原文开头亮出来, 用于判断 body 到底是不是纯密文
  note("触发", "len=" + responseBody.length, "原文前80=" + responseBody.substring(0, 80));
  try {
    const envelope = JSON.parse(responseBody);   // 外层: {"code","msg","time","data":"密文"}

    if (typeof envelope.data !== "string" || !envelope.data.length) {
      note("跳过", "外层无 data 密文字段", "");
      $done({});
    } else {
      const plainText    = utf8Decode(cbcDecrypt(b64ToBytes(envelope.data), AES_KEY, AES_IV));
      const growthObject = JSON.parse(plainText);

      if (typeof growthObject.currentGrowthValue === "number") {
        let levelThreshold = 0;
        if (growthObject.levelList) {
          for (let i = 0; i < growthObject.levelList.length; i++) {
            if (growthObject.levelList[i].level === growthObject.level) {
              levelThreshold = growthObject.levelList[i].absoluteValue;
              break;
            }
          }
        }
        const totalPoints = levelThreshold + growthObject.currentGrowthValue;
        const skateDays   = Math.floor(totalPoints / POINTS_PER_DAY);
        growthObject.currentGrowthValue = "滑行" + skateDays + "天";
        // growthObject.currentLevelName = "已滑行" + skateDays + "天"; // 想连等级名一起改, 取消本行注释
        note("成功", "滑行" + skateDays + "天", "门槛" + levelThreshold + "+余额=" + totalPoints);
      } else {
        note("跳过", requestTail, "无 currentGrowthValue 数字字段");
      }

      // 把改后的明文重新加密, 塞回外层 data 字段, 整个外层 JSON 返回
      envelope.data = bytesToB64(cbcEncrypt(utf8Encode(JSON.stringify(growthObject)), AES_KEY, AES_IV));
      $done({ body: JSON.stringify(envelope) });
    }

  } catch (e) {
    note("出错", (e && e.message) || String(e), "原文前60=" + responseBody.substring(0, 60));
    $done({}); // 出错放行原始响应, 避免小程序拿不到数据
  }
}
