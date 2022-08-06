import flask
import json
import os
from flask import request
import base64
import hashlib
import time
import uuid
import logging
from urllib.parse import quote
from requests import post, get
from urllib3 import disable_warnings

disable_warnings()

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

os.environ['FLASK_ENV']="development"

server = flask.Flask(__name__)


def bytes2bin(bytes):
    arr = []
    for v in [m for m in bytes]:
        arr.append(
            [(v & 128) >> 7, (v & 64) >> 6, (v & 32) >> 5, (v & 16) >> 4, (v & 8) >> 3, (v & 4) >> 2, (v & 2) >> 1,  v & 1])
    return [i for j in arr for i in j]


def bin2bytes(arr):
    length = len(arr) // 8
    arr1 = [0 for _ in range(length)]
    for j in range(length):
        arr1[j] = arr[j * 8] << 7 | arr[j * 8 + 1] << 6 | arr[j * 8 + 2] << 5 | arr[j * 8 + 3] << 4 | arr[j * 8 + 4] << 3 | arr[j * 8 + 5] << 2 | arr[j * 8 + 6] << 1 | arr[j * 8 + 7]
    return bytes(arr1)


def sub_12ECC(input):
    arr = [0x37, 0x92, 0x44, 0x68, 0xA5, 0x3D, 0xCC, 0x7F, 0xBB, 0xF, 0xD9, 0x88, 0xEE, 0x9A, 0xE9, 0x5A]
    key2 = b"80306f4370b39fd5630ad0529f77adb6"
    arr1 = [0 for _ in range(len(input))]
    for i in range(len(input)):
        r0 = int(input[i])
        r2 = arr[i & 0xf]
        r4 = int(key2[i & 7])
        r0 = r2 ^ r0
        r0 = r0 ^ r4
        r0 = r0 + r2
        r2 = r2 ^ r0
        r1 = int(key2[i & 7])
        r2 = r2 ^ r1
        arr1[i] = r2 & 0xff
    return bytes(arr1)


def sub_10EA4(input):
    table = [[0, 0], [1, 4], [2, 61], [3, 15], [4, 56], [5, 40], [6, 6], [7, 59], [8, 62], [9, 58], [10, 17], [11, 2], [12, 12], [13, 8], [14, 32], [15, 60], [16, 13], [17, 45], [18, 34], [19, 14], [20, 36], [21, 21], [22, 22], [23, 39], [24, 23], [25, 25], [26, 26], [27, 20], [28, 1], [29, 33], [30, 46], [31, 55], [32, 35], [33, 24], [34, 57], [35, 19], [36, 53], [37, 37], [38, 38], [39, 5], [40, 30], [41, 41], [42, 42], [43, 18], [44, 47], [45, 27], [46, 9], [47, 44], [48, 51], [49, 7], [50, 49], [51, 63], [52, 28], [53, 43], [54, 54], [55, 52], [56, 31], [57, 10], [ 58, 29], [59, 11], [60, 3], [61, 16], [62, 50], [63, 48]]
    arr = bytes2bin(input)
    arr1 = [0 for _ in range(len(arr))]
    for i in range(len(table)):
        arr1[table[i][1]] = arr[table[i][0]]
    return bin2bytes(arr1)


def sub_4B7C(input):
    table = [[0, 6, 0, 1], [1, 4, 1, 0], [2, 5, 0, 1], [3, 0, 0, 1], [4, 2, 0, 1], [5, 3, 0, 1], [6, 1, 1, 0], [7, 7, 0, 1]]
    arr = bytes2bin(input)
    arr1 = [0 for _ in range(8)]
    for i in range(8):
        if arr[i] == 0:
            arr1[table[i][1]] = table[i][2]
        else:
            arr1[table[i][1]] = table[i][3]
    return bin2bytes(arr1)


def sub_10D70(input):
    if len(input) == 1:
        return sub_4B7C(input)
    return b""


def sub_12510(input):
    output = bytes()
    for i in range(len(input) // 8):
        output += sub_10EA4(input[i * 8:(i + 1) * 8])
    output += sub_10D70(input[-(len(input) % 8):])
    return output


def sub_126AC(input, random1, random2):
    arr = [0, 1, 2]
    if random2 == 1:
        arr = [1, 2, 0]
    if random2 == 2:
        arr = [2, 0, 1]
    version = arr[random1]
    if version == 0:
        return sub_12510(input)
    if version == 2:
        return sub_12ECC(input)
    if version == 1:
        print("错误的类型")


def get_sign(functionId, body, uuid, client, clientVersion):
    st = str(int(time.time() * 1000))
    random1, random2 = 2, 0
    sv = f"{random1}{random2}"
    string = f"functionId={functionId}&body={body}&uuid={uuid}&client={client}&clientVersion={clientVersion}&st={st}&sv=1{sv}"
    ret_bytes = sub_126AC(str.encode(string), random1, random2)
    sign = f"client={client}&clientVersion={clientVersion}&uuid={uuid}&st={st}&sign={hashlib.md5(base64.b64encode(ret_bytes)).hexdigest()}&sv=1{sv}"
    return sign


def get_cookie(sign, body, key):
    url = f"https://api.m.jd.com/client.action?functionId=genToken&{sign}"
    headers = {
        "cookie": key,
        'user-agent': "JD4iPhone/167774 (iPhone; iOS 14.6; Scale/2.00)",
        'accept-language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
        'content-type': 'application/x-www-form-urlencoded;'
    }
    try:
        res = post(url, headers=headers, data=body, verify=False)
        token = res.json()['tokenKey']
    except Exception as error:
        return False
    url = 'https://un.m.jd.com/cgi-bin/app/appjmp'
    params = {
        'tokenKey': token,
        'to': 'https://plogin.m.jd.com/cgi-bin/m/thirdapp_auth_page',
        'client_type': 'android',
        'appid': 879,
        'appup_type': 1,
    }
    try:
        res = get(url=url, params=params, verify=False, allow_redirects=False).cookies.get_dict()
    except Exception as error:
        return False
    if "app_open" in res['pt_key']:
        cookie = f"pt_key={res['pt_key']};pt_pin={res['pt_pin']};"
        return cookie
    else:
        return False


@server.route('/getSign', methods=['post'])
def main():
    fn = request.values.get('fn') or request.get_json()['fn']
    body = request.values.get('body') or request.get_json()['body']
    wskey = request.values.get('wskey')
    if fn:
        sign = get_sign(fn, body, "".join(str(uuid.uuid4()).split("-")), "apple", "11.1.4")
        res = {"code": 200, "data": {"sign": f'body={quote(body)}&{sign}'}}
    else:
        res = {"code": 400, "data": "请传入url参数！"}
    if fn:
        print(res)
        return json.dumps(res, ensure_ascii=False)
    if wskey and "pin" in wskey and "wskey" in wskey:
        url = "https://plogin.m.jd.com/jd-mlogin/static/html/appjmp_blank.html"
        body = '{"to":"%s"}' % url
        sign = get_sign("genToken", body, "".join(str(uuid.uuid4()).split("-")), "apple", "11.1.4")
        body = f'body={quote(body)}'
        cookie = get_cookie(sign, body, wskey)
        if cookie:
            res = {"code": 200, "data": { "cookie": cookie}}
            print(res['data']['wskey'])
        else:
            res = {"code": 400, "data": "获取cookie失败！"}
    else:
        res = {"code": 400, "data": "请传入正确的wskey值！"}
    if wskey:
        print(res)
        return json.dumps(res, ensure_ascii=False)


if __name__ == '__main__':
    server.run(host='127.0.0.1', port=9000, debug=False)
