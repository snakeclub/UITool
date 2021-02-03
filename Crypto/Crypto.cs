using System;
using System.Collections.Generic;
using System.Text;
using MSScriptControl;

namespace Crypto
{
    /// <summary>
    /// 加密解密类库(32位程序，编译需选x86)
    /// </summary>
    public static class Crypto
    {
        #region 函数JS定义

        #region crypto.js
        private static string JScrypto = @"var base64map = ""ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"";
                                    var Crypto = new Object();
                                    Crypto.util = {
	                                    rotl: function (n, b) {
		                                    return (n << b) | (n >>> (32 - b));
	                                    },
	                                    rotr: function (n, b) {
		                                    return (n << (32 - b)) | (n >>> b);
	                                    },
	                                    endian: function (n) {
		                                    if (n.constructor == Number) {
			                                    return util.rotl(n,  8) & 0x00FF00FF |
			                                           util.rotl(n, 24) & 0xFF00FF00;
		                                    }
		                                    for (var i = 0; i < n.length; i++)
			                                    n[i] = util.endian(n[i]);
		                                    return n;
	                                    },
	                                    randomBytes: function (n) {
		                                    for (var bytes = []; n > 0; n--)
			                                    bytes.push(Math.floor(Math.random() * 256));
		                                    return bytes;
	                                    },
	                                    bytesToWords: function (bytes) {
		                                    for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
			                                    words[b >>> 5] |= bytes[i] << (24 - b % 32);
		                                    return words;
	                                    },
	                                    wordsToBytes: function (words) {
		                                    for (var bytes = [], b = 0; b < words.length * 32; b += 8)
			                                    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
		                                    return bytes;
	                                    },
	                                    bytesToHex: function (bytes) {
		                                    for (var hex = [], i = 0; i < bytes.length; i++) {
			                                    hex.push((bytes[i] >>> 4).toString(16));
			                                    hex.push((bytes[i] & 0xF).toString(16));
		                                    }
		                                    return hex.join("""");
	                                    },
	                                    hexToBytes: function (hex) {
		                                    for (var bytes = [], c = 0; c < hex.length; c += 2)
			                                    bytes.push(parseInt(hex.substr(c, 2), 16));
		                                    return bytes;
	                                    },
	                                    bytesToBase64: function (bytes) {
		                                    if (typeof btoa == ""function"") return btoa(Binary.bytesToString(bytes));
		                                    for(var base64 = [], i = 0; i < bytes.length; i += 3) {
			                                    var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
			                                    for (var j = 0; j < 4; j++) {
				                                    if (i * 8 + j * 6 <= bytes.length * 8)
					                                    base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
				                                    else base64.push(""="");
			                                    }
		                                    }
		                                    return base64.join("""");
	                                    },
	                                    base64ToBytes: function (base64) {
		                                    if (typeof atob == ""function"") return Binary.stringToBytes(atob(base64));
		                                    base64 = base64.replace(/[^A-Z0-9+\/]/ig, """");
		                                    for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
			                                    if (imod4 == 0) continue;
			                                    bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
			                                               (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
		                                    }
		                                    return bytes;
	                                    },
                                        stringToHex : function(s){
                                            var r="""";
                                            var hexes=new Array(""0"",""1"",""2"",""3"",""4"",""5"",""6"",""7"",""8"",""9"",""a"",""b"",""c"",""d"",""e"",""f"");
                                            for(var i=0;i<(s.length);i++){r+=hexes[s.charCodeAt(i)>>4]+hexes[s.charCodeAt(i)&0xf];}
                                            return r;
                                        },
                                        hexToString : function(s){
                                            var r="""";
                                            for(var i=0;i<s.length;i+=2){
                                                var sxx=parseInt(s.substring(i,i+2),16);
                                                r+=String.fromCharCode(sxx);
                                            }
                                            return r;
                                        },
                                        utf8StringToHex : function(s){
                                            return Crypto.util.bytesToHex(Crypto.charenc.UTF8.stringToBytes(s));
                                        },
                                        hexToUtf8String : function(s){
                                            return Crypto.charenc.UTF8.bytesToString(Crypto.util.hexToBytes(s));
                                        }
                                    };
                                    Crypto.mode = {};
                                    Crypto.charenc = {};
                                    Crypto.charenc.UTF8 = {
	                                    stringToBytes: function (str) {
		                                    return Crypto.charenc.Binary.stringToBytes(unescape(encodeURIComponent(str)));
	                                    },
	                                    bytesToString: function (bytes) {
		                                    return decodeURIComponent(escape(Crypto.charenc.Binary.bytesToString(bytes)));
	                                    }
                                    };
                                    Crypto.charenc.Binary = {
	                                    stringToBytes: function (str) {
		                                    for (var bytes = [], i = 0; i < str.length; i++)
			                                    bytes.push(str.charCodeAt(i) & 0xFF);
		                                    return bytes;
	                                    },
	                                    bytesToString: function (bytes) {
		                                    for (var str = [], i = 0; i < bytes.length; i++)
			                                    str.push(String.fromCharCode(bytes[i]));
		                                    return str.join("""");
	                                    }
                                    };";
        #endregion crypto.js

        #region md5.js
        private static string JSmd5 = @"var C = Crypto,
                                        util = C.util,
                                        charenc = C.charenc,
                                        UTF8 = C.charenc.UTF8,
                                        Binary = C.charenc.Binary;
                                    var MD5 = C.MD5 = function (message, options) {
	                                    var digestbytes = util.wordsToBytes(MD5._md5(message));
	                                    return options && options.asBytes ? digestbytes :
	                                           options && options.asString ? Binary.bytesToString(digestbytes) :
	                                           util.bytesToHex(digestbytes);
                                    };
                                    MD5._md5 = function (message) {
	                                    if (message.constructor == String) message = UTF8.stringToBytes(message);
	                                    var m = util.bytesToWords(message),
	                                        l = message.length * 8,
	                                        a =  1732584193,
	                                        b = -271733879,
	                                        c = -1732584194,
	                                        d =  271733878;
	                                    for (var i = 0; i < m.length; i++) {
		                                    m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
		                                           ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
	                                    }
	                                    m[l >>> 5] |= 0x80 << (l % 32);
	                                    m[(((l + 64) >>> 9) << 4) + 14] = l;
	                                    var FF = MD5._ff,
	                                        GG = MD5._gg,
	                                        HH = MD5._hh,
	                                        II = MD5._ii;
	                                    for (var i = 0; i < m.length; i += 16) {
		                                    var aa = a,
		                                        bb = b,
		                                        cc = c,
		                                        dd = d;
		                                    a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
		                                    d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
		                                    c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
		                                    b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
		                                    a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
		                                    d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
		                                    c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
		                                    b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
		                                    a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
		                                    d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
		                                    c = FF(c, d, a, b, m[i+10], 17, -42063);
		                                    b = FF(b, c, d, a, m[i+11], 22, -1990404162);
		                                    a = FF(a, b, c, d, m[i+12],  7,  1804603682);
		                                    d = FF(d, a, b, c, m[i+13], 12, -40341101);
		                                    c = FF(c, d, a, b, m[i+14], 17, -1502002290);
		                                    b = FF(b, c, d, a, m[i+15], 22,  1236535329);
		                                    a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
		                                    d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
		                                    c = GG(c, d, a, b, m[i+11], 14,  643717713);
		                                    b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
		                                    a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
		                                    d = GG(d, a, b, c, m[i+10],  9,  38016083);
		                                    c = GG(c, d, a, b, m[i+15], 14, -660478335);
		                                    b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
		                                    a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
		                                    d = GG(d, a, b, c, m[i+14],  9, -1019803690);
		                                    c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
		                                    b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
		                                    a = GG(a, b, c, d, m[i+13],  5, -1444681467);
		                                    d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
		                                    c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
		                                    b = GG(b, c, d, a, m[i+12], 20, -1926607734);
		                                    a = HH(a, b, c, d, m[i+ 5],  4, -378558);
		                                    d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
		                                    c = HH(c, d, a, b, m[i+11], 16,  1839030562);
		                                    b = HH(b, c, d, a, m[i+14], 23, -35309556);
		                                    a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
		                                    d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
		                                    c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
		                                    b = HH(b, c, d, a, m[i+10], 23, -1094730640);
		                                    a = HH(a, b, c, d, m[i+13],  4,  681279174);
		                                    d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
		                                    c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
		                                    b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
		                                    a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
		                                    d = HH(d, a, b, c, m[i+12], 11, -421815835);
		                                    c = HH(c, d, a, b, m[i+15], 16,  530742520);
		                                    b = HH(b, c, d, a, m[i+ 2], 23, -995338651);
		                                    a = II(a, b, c, d, m[i+ 0],  6, -198630844);
		                                    d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
		                                    c = II(c, d, a, b, m[i+14], 15, -1416354905);
		                                    b = II(b, c, d, a, m[i+ 5], 21, -57434055);
		                                    a = II(a, b, c, d, m[i+12],  6,  1700485571);
		                                    d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
		                                    c = II(c, d, a, b, m[i+10], 15, -1051523);
		                                    b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
		                                    a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
		                                    d = II(d, a, b, c, m[i+15], 10, -30611744);
		                                    c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
		                                    b = II(b, c, d, a, m[i+13], 21,  1309151649);
		                                    a = II(a, b, c, d, m[i+ 4],  6, -145523070);
		                                    d = II(d, a, b, c, m[i+11], 10, -1120210379);
		                                    c = II(c, d, a, b, m[i+ 2], 15,  718787259);
		                                    b = II(b, c, d, a, m[i+ 9], 21, -343485551);
		                                    a = (a + aa) >>> 0;
		                                    b = (b + bb) >>> 0;
		                                    c = (c + cc) >>> 0;
		                                    d = (d + dd) >>> 0;
	                                    }
	                                    return util.endian([a, b, c, d]);
                                    };
                                    MD5._ff  = function (a, b, c, d, x, s, t) {
	                                    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
	                                    return ((n << s) | (n >>> (32 - s))) + b;
                                    };
                                    MD5._gg  = function (a, b, c, d, x, s, t) {
	                                    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
	                                    return ((n << s) | (n >>> (32 - s))) + b;
                                    };
                                    MD5._hh  = function (a, b, c, d, x, s, t) {
	                                    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
	                                    return ((n << s) | (n >>> (32 - s))) + b;
                                    };
                                    MD5._ii  = function (a, b, c, d, x, s, t) {
	                                    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
	                                    return ((n << s) | (n >>> (32 - s))) + b;
                                    };
                                    MD5._blocksize = 16;
                                    MD5._digestsize = 16;";
        #endregion md5.js

        #region sha1.js
        private static string JSsha1 = @"var C = Crypto,
                                        util = C.util,
                                        charenc = C.charenc,
                                        UTF8 = C.charenc.UTF8,
                                        Binary = C.charenc.Binary;
                                    var SHA1 = C.SHA1 = function (message, options) {
	                                    var digestbytes = util.wordsToBytes(SHA1._sha1(message));
	                                    return options && options.asBytes ? digestbytes :
	                                           options && options.asString ? Binary.bytesToString(digestbytes) :
	                                           util.bytesToHex(digestbytes);
                                    };
                                    SHA1._sha1 = function (message) {
	                                    if (message.constructor == String) message = UTF8.stringToBytes(message);
	                                    var m  = util.bytesToWords(message),
	                                        l  = message.length * 8,
	                                        w  =  [],
	                                        H0 =  1732584193,
	                                        H1 = -271733879,
	                                        H2 = -1732584194,
	                                        H3 =  271733878,
	                                        H4 = -1009589776;
	                                    m[l >> 5] |= 0x80 << (24 - l % 32);
	                                    m[((l + 64 >>> 9) << 4) + 15] = l;
	                                    for (var i = 0; i < m.length; i += 16) {
		                                    var a = H0,
		                                        b = H1,
		                                        c = H2,
		                                        d = H3,
		                                        e = H4;
		                                    for (var j = 0; j < 80; j++) {
			                                    if (j < 16) w[j] = m[i + j];
			                                    else {
				                                    var n = w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16];
				                                    w[j] = (n << 1) | (n >>> 31);
			                                    }
			                                    var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
			                                             j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
			                                             j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
			                                             j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
			                                                      (H1 ^ H2 ^ H3) - 899497514);
			                                    H4 =  H3;
			                                    H3 =  H2;
			                                    H2 = (H1 << 30) | (H1 >>> 2);
			                                    H1 =  H0;
			                                    H0 =  t;
		                                    }
		                                    H0 += a;
		                                    H1 += b;
		                                    H2 += c;
		                                    H3 += d;
		                                    H4 += e;
	                                    }
	                                    return [H0, H1, H2, H3, H4];
                                    };
                                    SHA1._blocksize = 16;
                                    SHA1._digestsize = 20;";
        #endregion sha1.js

        #region sha256.js
        private static string JSsha256 = @"var C = Crypto,
                                        util = C.util,
                                        charenc = C.charenc,
                                        UTF8 = C.charenc.UTF8,
                                        Binary = C.charenc.Binary;
                                    var K = [ 0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
                                              0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
                                              0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
                                              0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
                                              0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
                                              0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
                                              0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
                                              0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
                                              0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
                                              0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
                                              0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
                                              0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
                                              0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
                                              0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
                                              0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
                                              0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2 ];
                                    var SHA256 = C.SHA256 = function (message, options) {
                                        var digestbytes = util.wordsToBytes(SHA256._sha256(message));
                                        return options && options.asBytes ? digestbytes :
                                               options && options.asString ? Binary.bytesToString(digestbytes) :
                                               util.bytesToHex(digestbytes);
                                    };
                                    SHA256._sha256 = function (message) {
                                        if (message.constructor == String) message = UTF8.stringToBytes(message);
                                        var m = util.bytesToWords(message),
                                            l = message.length * 8,
                                            H = [ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
                                                  0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ],
                                            w = [],
                                            a, b, c, d, e, f, g, h, i, j,
                                            t1, t2;
                                        m[l >> 5] |= 0x80 << (24 - l % 32);
                                        m[((l + 64 >> 9) << 4) + 15] = l;
                                        for (var i = 0; i < m.length; i += 16) {
	                                        a = H[0];
	                                        b = H[1];
	                                        c = H[2];
	                                        d = H[3];
	                                        e = H[4];
	                                        f = H[5];
	                                        g = H[6];
	                                        h = H[7];
	                                        for (var j = 0; j < 64; j++) {
		                                        if (j < 16) w[j] = m[j + i];
		                                        else {
			                                        var gamma0x = w[j - 15],
			                                            gamma1x = w[j - 2],
			                                            gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
			                                                      ((gamma0x << 14) | (gamma0x >>> 18)) ^
			                                                       (gamma0x >>> 3),
			                                            gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
			                                                      ((gamma1x <<  13) | (gamma1x >>> 19)) ^
			                                                       (gamma1x >>> 10);
			                                        w[j] = gamma0 + (w[j - 7] >>> 0) +
			                                               gamma1 + (w[j - 16] >>> 0);
		                                        }
		                                        var ch  = e & f ^ ~e & g,
		                                            maj = a & b ^ a & c ^ b & c,
		                                            sigma0 = ((a << 30) | (a >>>  2)) ^
		                                                     ((a << 19) | (a >>> 13)) ^
		                                                     ((a << 10) | (a >>> 22)),
		                                            sigma1 = ((e << 26) | (e >>>  6)) ^
		                                                     ((e << 21) | (e >>> 11)) ^
		                                                     ((e <<  7) | (e >>> 25));
		                                        t1 = (h >>> 0) + sigma1 + ch + (K[j]) + (w[j] >>> 0);
		                                        t2 = sigma0 + maj;
		                                        h = g;
		                                        g = f;
		                                        f = e;
		                                        e = d + t1;
		                                        d = c;
		                                        c = b;
		                                        b = a;
		                                        a = t1 + t2;
	                                        }
	                                        H[0] += a;
	                                        H[1] += b;
	                                        H[2] += c;
	                                        H[3] += d;
	                                        H[4] += e;
	                                        H[5] += f;
	                                        H[6] += g;
	                                        H[7] += h;
                                        }
                                        return H;
                                    };
                                    SHA256._blocksize = 16;
                                    SHA256._digestsize = 32;";
        #endregion sha256.js

        #region ofb.js
        private static string JSofb = @"Crypto.mode.OFB = {
	                                    encrypt: OFB,
	                                    decrypt: OFB
                                    };

                                    function OFB(cipher, m, iv) {
	                                    var blockSizeInBytes = cipher._blocksize * 4,
	                                        keystream = iv.slice(0);
	                                    for (var i = 0; i < m.length; i++) {
		                                    if (i % blockSizeInBytes == 0)
			                                    cipher._encryptblock(keystream, 0);
		                                    m[i] ^= keystream[i % blockSizeInBytes];
	                                    }
                                    };";
        #endregion ofb.js

        #region pbkdf2.js
        private static string JSpbkdf2 = @"var C = Crypto,
                                            util = C.util,
                                            charenc = C.charenc,
                                            UTF8 = C.charenc.UTF8,
                                            Binary = C.charenc.Binary;
                                        C.PBKDF2 = function (password, salt, keylen, options) {
	                                        if (password.constructor == String) password = UTF8.stringToBytes(password);
	                                        if (salt.constructor == String) salt = UTF8.stringToBytes(salt);
	                                        var hasher = options && options.hasher || C.SHA1,
	                                            iterations = options && options.iterations || 1;
	                                        function PRF(password, salt) {
		                                        return C.HMAC(hasher, salt, password, { asBytes: true });
	                                        }
	                                        var derivedKeyBytes = [],
	                                            blockindex = 1;
	                                        while (derivedKeyBytes.length < keylen) {
		                                        var block = PRF(password, salt.concat(util.wordsToBytes([blockindex])));
		                                        for (var u = block, i = 1; i < iterations; i++) {
			                                        u = PRF(password, u);
			                                        for (var j = 0; j < block.length; j++) block[j] ^= u[j];
		                                        }
		                                        derivedKeyBytes = derivedKeyBytes.concat(block);
		                                        blockindex++;
	                                        }
	                                        derivedKeyBytes.length = keylen;
	                                        return options && options.asBytes ? derivedKeyBytes :
	                                               options && options.asString ? Binary.bytesToString(derivedKeyBytes) :
	                                               util.bytesToHex(derivedKeyBytes);
                                        };";
        #endregion pbkdf2.js

        #region hmac.js
        private static string JShmac = @"var C = Crypto,
                                        util = C.util,
                                        charenc = C.charenc,
                                        UTF8 = C.charenc.UTF8,
                                        Binary = C.charenc.Binary;
                                    C.HMAC = function (hasher, message, key, options) {
	                                    if (message.constructor == String) message = UTF8.stringToBytes(message);
	                                    if (key.constructor == String) key = UTF8.stringToBytes(key);
	                                    if (key.length > hasher._blocksize * 4)
		                                    key = hasher(key, { asBytes: true });
	                                    var okey = key.slice(0),
	                                        ikey = key.slice(0);
	                                    for (var i = 0; i < hasher._blocksize * 4; i++) {
		                                    okey[i] ^= 0x5C;
		                                    ikey[i] ^= 0x36;
	                                    }
	                                    var hmacbytes = hasher(okey.concat(hasher(ikey.concat(message), { asBytes: true })), { asBytes: true });
	                                    return options && options.asBytes ? hmacbytes :
	                                           options && options.asString ? Binary.bytesToString(hmacbytes) :
	                                           util.bytesToHex(hmacbytes);
                                    };";
        #endregion hmac.js

        #region aes.js
        private static string JSaes = @"var C = Crypto,
                                        util = C.util,
                                        charenc = C.charenc,
                                        UTF8 = C.charenc.UTF8,
                                        Binary = C.charenc.Binary;
                                    var SBOX = [ 0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
                                                 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
                                                 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
                                                 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
                                                 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
                                                 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
                                                 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
                                                 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
                                                 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
                                                 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
                                                 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
                                                 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
                                                 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
                                                 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
                                                 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
                                                 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
                                                 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
                                                 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
                                                 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
                                                 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
                                                 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
                                                 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
                                                 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
                                                 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
                                                 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
                                                 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
                                                 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
                                                 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
                                                 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
                                                 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
                                                 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
                                                 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16 ];
                                    for (var INVSBOX = [], i = 0; i < 256; i++) INVSBOX[SBOX[i]] = i;
                                    var MULT2 = [],
                                        MULT3 = [],
                                        MULT9 = [],
                                        MULTB = [],
                                        MULTD = [],
                                        MULTE = [];
                                    function xtime(a, b) {
	                                    for (var result = 0, i = 0; i < 8; i++) {
		                                    if (b & 1) result ^= a;
		                                    var hiBitSet = a & 0x80;
		                                    a = (a << 1) & 0xFF;
		                                    if (hiBitSet) a ^= 0x1b;
		                                    b >>>= 1;
	                                    }
	                                    return result;
                                    }
                                    for (var i = 0; i < 256; i++) {
	                                    MULT2[i] = xtime(i,2);
	                                    MULT3[i] = xtime(i,3);
	                                    MULT9[i] = xtime(i,9);
	                                    MULTB[i] = xtime(i,0xB);
	                                    MULTD[i] = xtime(i,0xD);
	                                    MULTE[i] = xtime(i,0xE);
                                    }
                                    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
                                    var state = [[], [], [], []],
                                        keylength,
                                        nrounds,
                                        keyschedule;
                                    var AES = C.AES = {
	                                    encrypt: function (message, password, options) {
		                                    options = options || {};
		                                    var
			                                    m = UTF8.stringToBytes(message),
			                                    iv = options.iv || util.randomBytes(AES._blocksize * 4),
			                                    k = (
				                                    password.constructor == String ?
				                                    C.PBKDF2(password, iv, 32, { asBytes: true }) :
				                                    password
			                                    ),
			                                    mode = options.mode || C.mode.OFB;
		                                    AES._init(k);
		                                    mode.encrypt(AES, m, iv);
		                                    return util.bytesToBase64(options.iv ? m : iv.concat(m));
	                                    },
	                                    decrypt: function (ciphertext, password, options) {
		                                    options = options || {};
		                                    var
			                                    c = util.base64ToBytes(ciphertext),
			                                    iv = options.iv || c.splice(0, AES._blocksize * 4),
			                                    k = (
				                                    password.constructor == String ?
				                                    C.PBKDF2(password, iv, 32, { asBytes: true }) :
				                                    password
			                                    ),
			                                    mode = options.mode || C.mode.OFB;
		                                    AES._init(k);
		                                    mode.decrypt(AES, c, iv);
		                                    return UTF8.bytesToString(c);
	                                    },
	                                    _blocksize: 4,
	                                    _encryptblock: function (m, offset) {
		                                    for (var row = 0; row < AES._blocksize; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] = m[offset + col * 4 + row];
		                                    }
		                                    for (var row = 0; row < 4; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] ^= keyschedule[col][row];
		                                    }
		                                    for (var round = 1; round < nrounds; round++) {
			                                    for (var row = 0; row < 4; row++) {
				                                    for (var col = 0; col < 4; col++)
					                                    state[row][col] = SBOX[state[row][col]];
			                                    }
			                                    state[1].push(state[1].shift());
			                                    state[2].push(state[2].shift());
			                                    state[2].push(state[2].shift());
			                                    state[3].unshift(state[3].pop());
			                                    for (var col = 0; col < 4; col++) {
				                                    var s0 = state[0][col],
				                                        s1 = state[1][col],
				                                        s2 = state[2][col],
				                                        s3 = state[3][col];
				                                    state[0][col] = MULT2[s0] ^ MULT3[s1] ^ s2 ^ s3;
				                                    state[1][col] = s0 ^ MULT2[s1] ^ MULT3[s2] ^ s3;
				                                    state[2][col] = s0 ^ s1 ^ MULT2[s2] ^ MULT3[s3];
				                                    state[3][col] = MULT3[s0] ^ s1 ^ s2 ^ MULT2[s3];
			                                    }
			                                    for (var row = 0; row < 4; row++) {
				                                    for (var col = 0; col < 4; col++)
					                                    state[row][col] ^= keyschedule[round * 4 + col][row];
			                                    }
		                                    }
		                                    for (var row = 0; row < 4; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] = SBOX[state[row][col]];
		                                    }
		                                    state[1].push(state[1].shift());
		                                    state[2].push(state[2].shift());
		                                    state[2].push(state[2].shift());
		                                    state[3].unshift(state[3].pop());
		                                    for (var row = 0; row < 4; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] ^= keyschedule[nrounds * 4 + col][row];
		                                    }
		                                    for (var row = 0; row < AES._blocksize; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    m[offset + col * 4 + row] = state[row][col];
		                                    }
	                                    },
	                                    _decryptblock: function (c, offset) {
		                                    for (var row = 0; row < AES._blocksize; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] = c[offset + col * 4 + row];
		                                    }
		                                    for (var row = 0; row < 4; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] ^= keyschedule[nrounds * 4 + col][row];
		                                    }
		                                    for (var round = 1; round < nrounds; round++) {
			                                    state[1].unshift(state[1].pop());
			                                    state[2].push(state[2].shift());
			                                    state[2].push(state[2].shift());
			                                    state[3].push(state[3].shift());
			                                    for (var row = 0; row < 4; row++) {
				                                    for (var col = 0; col < 4; col++)
					                                    state[row][col] = INVSBOX[state[row][col]];
			                                    }
			                                    for (var row = 0; row < 4; row++) {
				                                    for (var col = 0; col < 4; col++)
					                                    state[row][col] ^= keyschedule[(nrounds - round) * 4 + col][row];
			                                    }
			                                    for (var col = 0; col < 4; col++) {
				                                    var s0 = state[0][col],
				                                        s1 = state[1][col],
				                                        s2 = state[2][col],
				                                        s3 = state[3][col];
				                                    state[0][col] = MULTE[s0] ^ MULTB[s1] ^ MULTD[s2] ^ MULT9[s3];
				                                    state[1][col] = MULT9[s0] ^ MULTE[s1] ^ MULTB[s2] ^ MULTD[s3];
				                                    state[2][col] = MULTD[s0] ^ MULT9[s1] ^ MULTE[s2] ^ MULTB[s3];
				                                    state[3][col] = MULTB[s0] ^ MULTD[s1] ^ MULT9[s2] ^ MULTE[s3];
			                                    }
		                                    }
		                                    state[1].unshift(state[1].pop());
		                                    state[2].push(state[2].shift());
		                                    state[2].push(state[2].shift());
		                                    state[3].push(state[3].shift());
		                                    for (var row = 0; row < 4; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] = INVSBOX[state[row][col]];
		                                    }
		                                    for (var row = 0; row < 4; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    state[row][col] ^= keyschedule[col][row];
		                                    }
		                                    for (var row = 0; row < AES._blocksize; row++) {
			                                    for (var col = 0; col < 4; col++)
				                                    c[offset + col * 4 + row] = state[row][col];
		                                    }
	                                    },
	                                    _init: function (k) {
		                                    keylength = k.length / 4;
		                                    nrounds = keylength + 6;
		                                    AES._keyexpansion(k);
	                                    },
	                                    _keyexpansion: function (k) {
		                                    keyschedule = [];
		                                    for (var row = 0; row < keylength; row++) {
			                                    keyschedule[row] = [
				                                    k[row * 4],
				                                    k[row * 4 + 1],
				                                    k[row * 4 + 2],
				                                    k[row * 4 + 3]
			                                    ];
		                                    }
		                                    for (var row = keylength; row < AES._blocksize * (nrounds + 1); row++) {
			                                    var temp = [
				                                    keyschedule[row - 1][0],
				                                    keyschedule[row - 1][1],
				                                    keyschedule[row - 1][2],
				                                    keyschedule[row - 1][3]
			                                    ];
			                                    if (row % keylength == 0) {
				                                    temp.push(temp.shift());
				                                    temp[0] = SBOX[temp[0]];
				                                    temp[1] = SBOX[temp[1]];
				                                    temp[2] = SBOX[temp[2]];
				                                    temp[3] = SBOX[temp[3]];
				                                    temp[0] ^= RCON[row / keylength];
			                                    } else if (keylength > 6 && row % keylength == 4) {
				                                    temp[0] = SBOX[temp[0]];
				                                    temp[1] = SBOX[temp[1]];
				                                    temp[2] = SBOX[temp[2]];
				                                    temp[3] = SBOX[temp[3]];
			                                    }
			                                    keyschedule[row] = [
				                                    keyschedule[row - keylength][0] ^ temp[0],
				                                    keyschedule[row - keylength][1] ^ temp[1],
				                                    keyschedule[row - keylength][2] ^ temp[2],
				                                    keyschedule[row - keylength][3] ^ temp[3]
			                                    ];
		                                    }
	                                    }
                                    };";
        #endregion aes.js

        #region rabbit.js
        private static string JSrabbit = @"var C = Crypto,
                                        util = C.util,
                                        charenc = C.charenc,
                                        UTF8 = C.charenc.UTF8,
                                        Binary = C.charenc.Binary;
                                    var x = [],
                                        c = [],
                                        b;
                                    var Rabbit = C.Rabbit = {
                                        encrypt: function (message, password) {
	                                        var
	                                            m = UTF8.stringToBytes(message),
	                                            iv = util.randomBytes(8),
	                                            k = password.constructor == String ?
	                                                C.PBKDF2(password, iv, 32, { asBytes: true }) :
	                                                password;
	                                        Rabbit._rabbit(m, k, util.bytesToWords(iv));
	                                        return util.bytesToBase64(iv.concat(m));
                                        },
                                        decrypt: function (ciphertext, password) {
	                                        var
	                                            c = util.base64ToBytes(ciphertext),
	                                            iv = c.splice(0, 8),
	                                            k = password.constructor == String ?
	                                                C.PBKDF2(password, iv, 32, { asBytes: true }) :
	                                                password;
	                                        Rabbit._rabbit(c, k, util.bytesToWords(iv));
	                                        return UTF8.bytesToString(c);
                                        },
                                        _rabbit: function (m, k, iv) {
	                                        Rabbit._keysetup(k);
	                                        if (iv) Rabbit._ivsetup(iv);
	                                        for (var s = [], i = 0; i < m.length; i++) {
		                                        if (i % 16 == 0) {
			                                        Rabbit._nextstate();
			                                        s[0] = x[0] ^ (x[5] >>> 16) ^ (x[3] << 16);
			                                        s[1] = x[2] ^ (x[7] >>> 16) ^ (x[5] << 16);
			                                        s[2] = x[4] ^ (x[1] >>> 16) ^ (x[7] << 16);
			                                        s[3] = x[6] ^ (x[3] >>> 16) ^ (x[1] << 16);
			                                        for (var j = 0; j < 4; j++) {
				                                        s[j] = ((s[j] <<  8) | (s[j] >>> 24)) & 0x00FF00FF |
				                                               ((s[j] << 24) | (s[j] >>>  8)) & 0xFF00FF00;
			                                        }
			                                        for (var b = 120; b >= 0; b -= 8)
				                                        s[b / 8] = (s[b >>> 5] >>> (24 - b % 32)) & 0xFF;
		                                        }
		                                        m[i] ^= s[i % 16];
	                                        }
                                        },
                                        _keysetup: function (k) {
	                                        x[0] = k[0];
	                                        x[2] = k[1];
	                                        x[4] = k[2];
	                                        x[6] = k[3];
	                                        x[1] = (k[3] << 16) | (k[2] >>> 16);
	                                        x[3] = (k[0] << 16) | (k[3] >>> 16);
	                                        x[5] = (k[1] << 16) | (k[0] >>> 16);
	                                        x[7] = (k[2] << 16) | (k[1] >>> 16);
	                                        c[0] = util.rotl(k[2], 16);
	                                        c[2] = util.rotl(k[3], 16);
	                                        c[4] = util.rotl(k[0], 16);
	                                        c[6] = util.rotl(k[1], 16);
	                                        c[1] = (k[0] & 0xFFFF0000) | (k[1] & 0xFFFF);
	                                        c[3] = (k[1] & 0xFFFF0000) | (k[2] & 0xFFFF);
	                                        c[5] = (k[2] & 0xFFFF0000) | (k[3] & 0xFFFF);
	                                        c[7] = (k[3] & 0xFFFF0000) | (k[0] & 0xFFFF);
	                                        b = 0;
	                                        for (var i = 0; i < 4; i++) Rabbit._nextstate();
	                                        for (var i = 0; i < 8; i++) c[i] ^= x[(i + 4) & 7];
                                        },
                                        _ivsetup: function (iv) {
	                                        var i0 = util.endian(iv[0]),
	                                            i2 = util.endian(iv[1]),
	                                            i1 = (i0 >>> 16) | (i2 & 0xFFFF0000),
	                                            i3 = (i2 <<  16) | (i0 & 0x0000FFFF);
	                                        c[0] ^= i0;
	                                        c[1] ^= i1;
	                                        c[2] ^= i2;
	                                        c[3] ^= i3;
	                                        c[4] ^= i0;
	                                        c[5] ^= i1;
	                                        c[6] ^= i2;
	                                        c[7] ^= i3;
	                                        for (var i = 0; i < 4; i++) Rabbit._nextstate();
                                        },
                                        _nextstate: function () {
	                                        for (var c_old = [], i = 0; i < 8; i++) c_old[i] = c[i];
	                                        c[0] = (c[0] + 0x4D34D34D + b) >>> 0;
	                                        c[1] = (c[1] + 0xD34D34D3 + ((c[0] >>> 0) < (c_old[0] >>> 0) ? 1 : 0)) >>> 0;
	                                        c[2] = (c[2] + 0x34D34D34 + ((c[1] >>> 0) < (c_old[1] >>> 0) ? 1 : 0)) >>> 0;
	                                        c[3] = (c[3] + 0x4D34D34D + ((c[2] >>> 0) < (c_old[2] >>> 0) ? 1 : 0)) >>> 0;
	                                        c[4] = (c[4] + 0xD34D34D3 + ((c[3] >>> 0) < (c_old[3] >>> 0) ? 1 : 0)) >>> 0;
	                                        c[5] = (c[5] + 0x34D34D34 + ((c[4] >>> 0) < (c_old[4] >>> 0) ? 1 : 0)) >>> 0;
	                                        c[6] = (c[6] + 0x4D34D34D + ((c[5] >>> 0) < (c_old[5] >>> 0) ? 1 : 0)) >>> 0;
	                                        c[7] = (c[7] + 0xD34D34D3 + ((c[6] >>> 0) < (c_old[6] >>> 0) ? 1 : 0)) >>> 0;
	                                        b = (c[7] >>> 0) < (c_old[7] >>> 0) ? 1 : 0;
	                                        for (var g = [], i = 0; i < 8; i++) {
		                                        var gx = (x[i] + c[i]) >>> 0;
		                                        var ga = gx & 0xFFFF,
		                                            gb = gx >>> 16;
		                                        var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb,
		                                            gl = (((gx & 0xFFFF0000) * gx) >>> 0) + (((gx & 0x0000FFFF) * gx) >>> 0) >>> 0;
		                                        g[i] = gh ^ gl;
	                                        }
	                                        x[0] = g[0] + ((g[7] << 16) | (g[7] >>> 16)) + ((g[6] << 16) | (g[6] >>> 16));
	                                        x[1] = g[1] + ((g[0] <<  8) | (g[0] >>> 24)) + g[7];
	                                        x[2] = g[2] + ((g[1] << 16) | (g[1] >>> 16)) + ((g[0] << 16) | (g[0] >>> 16));
	                                        x[3] = g[3] + ((g[2] <<  8) | (g[2] >>> 24)) + g[1];
	                                        x[4] = g[4] + ((g[3] << 16) | (g[3] >>> 16)) + ((g[2] << 16) | (g[2] >>> 16));
	                                        x[5] = g[5] + ((g[4] <<  8) | (g[4] >>> 24)) + g[3];
	                                        x[6] = g[6] + ((g[5] << 16) | (g[5] >>> 16)) + ((g[4] << 16) | (g[4] >>> 16));
	                                        x[7] = g[7] + ((g[6] <<  8) | (g[6] >>> 24)) + g[5];
                                        }
                                    };";
        #endregion rabbit.js

        #region marc4.js
        private static string JSmarc4 = @"var C = Crypto,
                                        util = C.util,
                                        charenc = C.charenc,
                                        UTF8 = C.charenc.UTF8,
                                        Binary = C.charenc.Binary;
                                    var MARC4 = C.MARC4 = {
	                                    encrypt: function (message, password) {
		                                    var
		                                        m = UTF8.stringToBytes(message),
		                                        iv = util.randomBytes(16),
		                                        k = password.constructor == String ?
		                                            C.PBKDF2(password, iv, 32, { asBytes: true }) :
		                                            password;
		                                    MARC4._marc4(m, k, 1536);
		                                    return util.bytesToBase64(iv.concat(m));
	                                    },
	                                    decrypt: function (ciphertext, password) {
		                                    var
		                                        c = util.base64ToBytes(ciphertext),
		                                        iv = c.splice(0, 16),
		                                        k = password.constructor == String ?
		                                            C.PBKDF2(password, iv, 32, { asBytes: true }) :
		                                            password;
		                                    MARC4._marc4(c, k, 1536);
		                                    return UTF8.bytesToString(c);
	                                    },
	                                    _marc4: function (m, k, drop) {
		                                    var i, j, s, temp;
		                                    for (i = 0, s = []; i < 256; i++) s[i] = i;
		                                    for (i = 0, j = 0;  i < 256; i++) {
			                                    j = (j + s[i] + k[i % k.length]) % 256;
			                                    temp = s[i];
			                                    s[i] = s[j];
			                                    s[j] = temp;
		                                    }
		                                    i = j = 0;
		                                    for (var k = -drop; k < m.length; k++) {
			                                    i = (i + 1) % 256;
			                                    j = (j + s[i]) % 256;
			                                    temp = s[i];
			                                    s[i] = s[j];
			                                    s[j] = temp;
			                                    if (k < 0) continue;
			                                    m[k] ^= s[(s[i] + s[j]) % 256];
		                                    }
	                                    }
                                    };";
        #endregion marc4.js

        #region des.js
        private static string JSdes = @"function DES(encrypt,message,key,mode,iv){
                                    //declaring this locally speeds things up a bit
                                    var spfunction1=new Array(0x1010400,0,0x10000,0x1010404,0x1010004,0x10404,0x4,0x10000,0x400,0x1010400,0x1010404,0x400,0x1000404,0x1010004,0x1000000,0x4,0x404,0x1000400,0x1000400,0x10400,0x10400,0x1010000,0x1010000,0x1000404,0x10004,0x1000004,0x1000004,0x10004,0,0x404,0x10404,0x1000000,0x10000,0x1010404,0x4,0x1010000,0x1010400,0x1000000,0x1000000,0x400,0x1010004,0x10000,0x10400,0x1000004,0x400,0x4,0x1000404,0x10404,0x1010404,0x10004,0x1010000,0x1000404,0x1000004,0x404,0x10404,0x1010400,0x404,0x1000400,0x1000400,0,0x10004,0x10400,0,0x1010004);

                                    var spfunction2=new Array(-0x7fef7fe0,-0x7fff8000,0x8000,0x108020,0x100000,0x20,-0x7fefffe0,-0x7fff7fe0,-0x7fffffe0,-0x7fef7fe0,-0x7fef8000,-0x80000000,-0x7fff8000,0x100000,0x20,-0x7fefffe0,0x108000,0x100020,-0x7fff7fe0,0,-0x80000000,0x8000,0x108020,-0x7ff00000,0x100020,-0x7fffffe0,0,0x108000,0x8020,-0x7fef8000,-0x7ff00000,0x8020,0,0x108020,-0x7fefffe0,0x100000,-0x7fff7fe0,-0x7ff00000,-0x7fef8000,0x8000,-0x7ff00000,-0x7fff8000,0x20,-0x7fef7fe0,0x108020,0x20,0x8000,-0x80000000,0x8020,-0x7fef8000,0x100000,-0x7fffffe0,0x100020,-0x7fff7fe0,-0x7fffffe0,0x100020,0x108000,0,-0x7fff8000,0x8020,-0x80000000,-0x7fefffe0,-0x7fef7fe0,0x108000);

                                    var spfunction3=new Array(0x208,0x8020200,0,0x8020008,0x8000200,0,0x20208,0x8000200,0x20008,0x8000008,0x8000008,0x20000,0x8020208,0x20008,0x8020000,0x208,0x8000000,0x8,0x8020200,0x200,0x20200,0x8020000,0x8020008,0x20208,0x8000208,0x20200,0x20000,0x8000208,0x8,0x8020208,0x200,0x8000000,0x8020200,0x8000000,0x20008,0x208,0x20000,0x8020200,0x8000200,0,0x200,0x20008,0x8020208,0x8000200,0x8000008,0x200,0,0x8020008,0x8000208,0x20000,0x8000000,0x8020208,0x8,0x20208,0x20200,0x8000008,0x8020000,0x8000208,0x208,0x8020000,0x20208,0x8,0x8020008,0x20200);

                                    var spfunction4=new Array(0x802001,0x2081,0x2081,0x80,0x802080,0x800081,0x800001,0x2001,0,0x802000,0x802000,0x802081,0x81,0,0x800080,0x800001,0x1,0x2000,0x800000,0x802001,0x80,0x800000,0x2001,0x2080,0x800081,0x1,0x2080,0x800080,0x2000,0x802080,0x802081,0x81,0x800080,0x800001,0x802000,0x802081,0x81,0,0,0x802000,0x2080,0x800080,0x800081,0x1,0x802001,0x2081,0x2081,0x80,0x802081,0x81,0x1,0x2000,0x800001,0x2001,0x802080,0x800081,0x2001,0x2080,0x800000,0x802001,0x80,0x800000,0x2000,0x802080);

                                    var spfunction5=new Array(0x100,0x2080100,0x2080000,0x42000100,0x80000,0x100,0x40000000,0x2080000,0x40080100,0x80000,0x2000100,0x40080100,0x42000100,0x42080000,0x80100,0x40000000,0x2000000,0x40080000,0x40080000,0,0x40000100,0x42080100,0x42080100,0x2000100,0x42080000,0x40000100,0,0x42000000,0x2080100,0x2000000,0x42000000,0x80100,0x80000,0x42000100,0x100,0x2000000,0x40000000,0x2080000,0x42000100,0x40080100,0x2000100,0x40000000,0x42080000,0x2080100,0x40080100,0x100,0x2000000,0x42080000,0x42080100,0x80100,0x42000000,0x42080100,0x2080000,0,0x40080000,0x42000000,0x80100,0x2000100,0x40000100,0x80000,0,0x40080000,0x2080100,0x40000100);

                                    var spfunction6=new Array(0x20000010,0x20400000,0x4000,0x20404010,0x20400000,0x10,0x20404010,0x400000,0x20004000,0x404010,0x400000,0x20000010,0x400010,0x20004000,0x20000000,0x4010,0,0x400010,0x20004010,0x4000,0x404000,0x20004010,0x10,0x20400010,0x20400010,0,0x404010,0x20404000,0x4010,0x404000,0x20404000,0x20000000,0x20004000,0x10,0x20400010,0x404000,0x20404010,0x400000,0x4010,0x20000010,0x400000,0x20004000,0x20000000,0x4010,0x20000010,0x20404010,0x404000,0x20400000,0x404010,0x20404000,0,0x20400010,0x10,0x4000,0x20400000,0x404010,0x4000,0x400010,0x20004010,0,0x20404000,0x20000000,0x400010,0x20004010);

                                    var spfunction7=new Array(0x200000,0x4200002,0x4000802,0,0x800,0x4000802,0x200802,0x4200800,0x4200802,0x200000,0,0x4000002,0x2,0x4000000,0x4200002,0x802,0x4000800,0x200802,0x200002,0x4000800,0x4000002,0x4200000,0x4200800,0x200002,0x4200000,0x800,0x802,0x4200802,0x200800,0x2,0x4000000,0x200800,0x4000000,0x200800,0x200000,0x4000802,0x4000802,0x4200002,0x4200002,0x2,0x200002,0x4000000,0x4000800,0x200000,0x4200800,0x802,0x200802,0x4200800,0x802,0x4000002,0x4200802,0x4200000,0x200800,0,0x2,0x4200802,0,0x200802,0x4200000,0x800,0x4000002,0x4000800,0x800,0x200002);

                                    var spfunction8=new Array(0x10001040,0x1000,0x40000,0x10041040,0x10000000,0x10001040,0x40,0x10000000,0x40040,0x10040000,0x10041040,0x41000,0x10041000,0x41040,0x1000,0x40,0x10040000,0x10000040,0x10001000,0x1040,0x41000,0x40040,0x10040040,0x10041000,0x1040,0,0,0x10040040,0x10000040,0x10001000,0x41040,0x40000,0x41040,0x40000,0x10041000,0x1000,0x40,0x10040040,0x1000,0x41040,0x10001000,0x40,0x10000040,0x10040000,0x10040040,0x10000000,0x40000,0x10001040,0,0x10041040,0x40040,0x10000040,0x10040000,0x10001000,0x10001040,0,0x10041040,0x41000,0x41000,0x1040,0x1040,0x40040,0x10000000,0x10041000);

                                    //create the 16 or 48 subkeys we will need
                                    var keys=DES_CreateKeys(key);
                                    var m=0,i,j,temp,temp2,right1,right2,left,right,looping;
                                    var cbcleft,cbcleft2,cbcright,cbcright2
                                    var endloop,loopinc;
                                    var len=message.length;
                                    var chunk=0;

                                    //set up the loops for single and triple des
                                    var iterations=keys.length==32?3 :9;//single or triple des
                                    if(iterations==3){looping=encrypt?new Array(0,32,2):new Array(30,-2,-2);}
                                    else{looping=encrypt?new Array(0,32,2,62,30,-2,64,96,2):new Array(94,62,-2,32,64,2,30,-2,-2);}
                                    message+=""\0\0\0\0\0\0\0\0"";//pad the message out with null bytes

                                    //store the result here
                                    result="""";
                                    tempresult="""";
                                    if(mode==1){//CBC mode
                                        cbcleft=(iv.charCodeAt(m++)<<24)|(iv.charCodeAt(m++)<<16)|(iv.charCodeAt(m++)<<8)|iv.charCodeAt(m++);
                                        cbcright=(iv.charCodeAt(m++)<<24)|(iv.charCodeAt(m++)<<16)|(iv.charCodeAt(m++)<<8)|iv.charCodeAt(m++);
                                        m=0;
                                    }

                                    //loop through each 64 bit chunk of the message
                                    while(m<len){
                                        if(encrypt){/*加密时按双字节操作*/
                                            left=(message.charCodeAt(m++)<<16)|message.charCodeAt(m++);
                                            right=(message.charCodeAt(m++)<<16)|message.charCodeAt(m++);
                                        }else{
                                            left=(message.charCodeAt(m++)<<24)|(message.charCodeAt(m++)<<16)|(message.charCodeAt(m++)<<8)|message.charCodeAt(m++);
                                            right=(message.charCodeAt(m++)<<24)|(message.charCodeAt(m++)<<16)|(message.charCodeAt(m++)<<8)|message.charCodeAt(m++);
                                        }

                                        //for Cipher Block Chaining mode,xor the message with the previous result
                                        if(mode==1){if(encrypt){left^=cbcleft;right^=cbcright;}else{cbcleft2=cbcleft;cbcright2=cbcright;cbcleft=left;cbcright=right;}}

                                        //first each 64 but chunk of the message must be permuted according to IP
                                        temp=((left>>>4)^right)&0x0f0f0f0f;right^=temp;left^=(temp<<4);
                                        temp=((left>>>16)^right)&0x0000ffff;right^=temp;left^=(temp<<16);
                                        temp=((right>>>2)^left)&0x33333333;left^=temp;right^=(temp<<2);
                                        temp=((right>>>8)^left)&0x00ff00ff;left^=temp;right^=(temp<<8);
                                        temp=((left>>>1)^right)&0x55555555;right^=temp;left^=(temp<<1);
                                        left=((left<<1)|(left>>>31));
                                        right=((right<<1)|(right>>>31));

                                        //do this either 1 or 3 times for each chunk of the message
                                        for(j=0;j<iterations;j+=3){
                                            endloop=looping[j+1];
                                            loopinc=looping[j+2];

                                            //now go through and perform the encryption or decryption 
                                            for(i=looping[j];i!=endloop;i+=loopinc){//for efficiency
                                                right1=right^keys[i];
                                                right2=((right>>>4)|(right<<28))^keys[i+1];

                                                //the result is attained by passing these bytes through the S selection functions
                                                temp=left;
                                                left=right;
                                                right=temp^(spfunction2[(right1>>>24)&0x3f]|spfunction4[(right1>>>16)&0x3f]|spfunction6[(right1>>>8)&0x3f]|spfunction8[right1&0x3f]|spfunction1[(right2>>>24)&0x3f]|spfunction3[(right2>>>16)&0x3f]|spfunction5[(right2>>>8)&0x3f]|spfunction7[right2&0x3f]);

                                            }

                                            temp=left;left=right;right=temp;//unreverse left and right

                                        }//for either 1 or 3 iterations

                                        //move then each one bit to the right
                                        left=((left>>>1)|(left<<31));
                                        right=((right>>>1)|(right<<31));
                                        
                                        //now perform IP-1,which is IP in the opposite direction
                                        temp=((left>>>1)^right)&0x55555555;right^=temp;left^=(temp<<1);
                                        temp=((right>>>8)^left)&0x00ff00ff;left^=temp;right^=(temp<<8);
                                        temp=((right>>>2)^left)&0x33333333;left^=temp;right^=(temp<<2);
                                        temp=((left>>>16)^right)&0x0000ffff;right^=temp;left^=(temp<<16);
                                        temp=((left>>>4)^right)&0x0f0f0f0f;right^=temp;left^=(temp<<4);

                                        //for Cipher Block Chaining mode,xor the message with the previous result
                                        if(mode==1){if(encrypt){cbcleft=left;cbcright=right;}else{left^=cbcleft2;right^=cbcright2;}}

                                        if(encrypt){tempresult+=String.fromCharCode((left>>>24),((left>>>16)&0xff),((left>>>8)&0xff),(left&0xff),(right>>>24),((right>>>16)&0xff),((right>>>8)&0xff),(right&0xff));}
                                        else{tempresult+=String.fromCharCode(((left>>>16)&0xffff),(left&0xffff),((right>>>16)&0xffff),(right&0xffff));}/*解密时输出双字节*/
                                        
                                        encrypt?chunk+=16:chunk+=8;
                                        if(chunk==512){result+=tempresult;tempresult="""";chunk=0;}
                                    }//for every 8 characters,or 64 bits in the message

                                    //return the result as an array
                                    return result+tempresult;
                                }//end of des


                                function DES_CreateKeys(key){
                                    //declaring this locally speeds things up a bit
                                    pc2bytes0=new Array(0,0x4,0x20000000,0x20000004,0x10000,0x10004,0x20010000,0x20010004,0x200,0x204,0x20000200,0x20000204,0x10200,0x10204,0x20010200,0x20010204);
                                    pc2bytes1=new Array(0,0x1,0x100000,0x100001,0x4000000,0x4000001,0x4100000,0x4100001,0x100,0x101,0x100100,0x100101,0x4000100,0x4000101,0x4100100,0x4100101);
                                    pc2bytes2=new Array(0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808,0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808);
                                    pc2bytes3=new Array(0,0x200000,0x8000000,0x8200000,0x2000,0x202000,0x8002000,0x8202000,0x20000,0x220000,0x8020000,0x8220000,0x22000,0x222000,0x8022000,0x8222000);
                                    pc2bytes4=new Array(0,0x40000,0x10,0x40010,0,0x40000,0x10,0x40010,0x1000,0x41000,0x1010,0x41010,0x1000,0x41000,0x1010,0x41010);
                                    pc2bytes5=new Array(0,0x400,0x20,0x420,0,0x400,0x20,0x420,0x2000000,0x2000400,0x2000020,0x2000420,0x2000000,0x2000400,0x2000020,0x2000420);
                                    pc2bytes6=new Array(0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002,0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002);
                                    pc2bytes7=new Array(0,0x10000,0x800,0x10800,0x20000000,0x20010000,0x20000800,0x20010800,0x20000,0x30000,0x20800,0x30800,0x20020000,0x20030000,0x20020800,0x20030800);
                                    pc2bytes8=new Array(0,0x40000,0,0x40000,0x2,0x40002,0x2,0x40002,0x2000000,0x2040000,0x2000000,0x2040000,0x2000002,0x2040002,0x2000002,0x2040002);
                                    pc2bytes9=new Array(0,0x10000000,0x8,0x10000008,0,0x10000000,0x8,0x10000008,0x400,0x10000400,0x408,0x10000408,0x400,0x10000400,0x408,0x10000408);
                                    pc2bytes10=new Array(0,0x20,0,0x20,0x100000,0x100020,0x100000,0x100020,0x2000,0x2020,0x2000,0x2020,0x102000,0x102020,0x102000,0x102020);
                                    pc2bytes11=new Array(0,0x1000000,0x200,0x1000200,0x200000,0x1200000,0x200200,0x1200200,0x4000000,0x5000000,0x4000200,0x5000200,0x4200000,0x5200000,0x4200200,0x5200200);
                                    pc2bytes12=new Array(0,0x1000,0x8000000,0x8001000,0x80000,0x81000,0x8080000,0x8081000,0x10,0x1010,0x8000010,0x8001010,0x80010,0x81010,0x8080010,0x8081010);
                                    pc2bytes13=new Array(0,0x4,0x100,0x104,0,0x4,0x100,0x104,0x1,0x5,0x101,0x105,0x1,0x5,0x101,0x105);

                                    //how many iterations(1 for des,3 for triple des)
                                    var iterations=key.length>=24?3 :1;

                                    //stores the return keys
                                    var keys=new Array(32 * iterations);

                                    //now define the left shifts which need to be done
                                    var shifts=new Array(0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0);

                                    //other variables
                                    var lefttemp,righttemp,m=0,n=0,temp;

                                    for(var j=0;j<iterations;j++){//either 1 or 3 iterations

                                        left=(key.charCodeAt(m++)<<24)|(key.charCodeAt(m++)<<16)|(key.charCodeAt(m++)<<8)|key.charCodeAt(m++);
                                        right=(key.charCodeAt(m++)<<24)|(key.charCodeAt(m++)<<16)|(key.charCodeAt(m++)<<8)|key.charCodeAt(m++);
                                        temp=((left>>>4)^right)&0x0f0f0f0f;right^=temp;left^=(temp<<4);
                                        temp=((right>>>-16)^left)&0x0000ffff;left^=temp;right^=(temp<<-16);
                                        temp=((left>>>2)^right)&0x33333333;right^=temp;left^=(temp<<2);
                                        temp=((right>>>-16)^left)&0x0000ffff;left^=temp;right^=(temp<<-16);
                                        temp=((left>>>1)^right)&0x55555555;right^=temp;left^=(temp<<1);
                                        temp=((right>>>8)^left)&0x00ff00ff;left^=temp;right^=(temp<<8);
                                        temp=((left>>>1)^right)&0x55555555;right^=temp;left^=(temp<<1);

                                        //the right side needs to be shifted and to get the last four bits of the left side
                                        temp=(left<<8)|((right>>>20)&0x000000f0);

                                        //left needs to be put upside down
                                        left=(right<<24)|((right<<8)&0xff0000)|((right>>>8)&0xff00)|((right>>>24)&0xf0);
                                        right=temp;

                                        //now go through and perform these shifts on the left and right keys
                                        for(i=0;i<shifts.length;i++){
                                            //shift the keys either one or two bits to the left
                                            if(shifts[i]){left=(left<<2)|(left>>>26);right=(right<<2)|(right>>>26);}
                                            else{left=(left<<1)|(left>>>27);right=(right<<1)|(right>>>27);}

                                            left&=-0xf;right&=-0xf;

                                            //now apply PC-2,in such a way that E is easier when encrypting or decrypting
                                            //this conversion will look like PC-2 except only the last 6 bits of each byte are used
                                            //rather than 48 consecutive bits and the order of lines will be according to 
                                            //how the S selection functions will be applied:S2,S4,S6,S8,S1,S3,S5,S7
                                            lefttemp=pc2bytes0[left>>>28]|pc2bytes1[(left>>>24)&0xf]
                                            |pc2bytes2[(left>>>20)&0xf]|pc2bytes3[(left>>>16)&0xf]
                                            |pc2bytes4[(left>>>12)&0xf]|pc2bytes5[(left>>>8)&0xf]
                                            |pc2bytes6[(left>>>4)&0xf];
                                            
                                            righttemp=pc2bytes7[right>>>28]|pc2bytes8[(right>>>24)&0xf]
                                            |pc2bytes9[(right>>>20)&0xf]|pc2bytes10[(right>>>16)&0xf]
                                            |pc2bytes11[(right>>>12)&0xf]|pc2bytes12[(right>>>8)&0xf]
                                            |pc2bytes13[(right>>>4)&0xf];
                                            temp=((righttemp>>>16)^lefttemp)&0x0000ffff;
                                            keys[n++]=lefttemp^temp;keys[n++]=righttemp^(temp<<16);
                                        }

                                    }//for each iterations

                                    //return the keys we""ve created
                                    return keys;
                                };";
        #endregion des.js

        #region BigInt.js
        private static string JSBigInt = @"var biRadixBase = 2;
                                var biRadixBits = 16;
                                var bitsPerDigit = biRadixBits;
                                var biRadix = 1 << 16;
                                var biHalfRadix = biRadix >>> 1;
                                var biRadixSquared = biRadix * biRadix;
                                var maxDigitVal = biRadix - 1;
                                var maxInteger = 9999999999999998;
                                var maxDigits;
                                var ZERO_ARRAY;
                                var bigZero, bigOne;
                                function setMaxDigits(value)
                                {
	                                maxDigits = value;
	                                ZERO_ARRAY = new Array(maxDigits);
	                                for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
	                                bigZero = new BigInt();
	                                bigOne = new BigInt();
	                                bigOne.digits[0] = 1;
                                }
                                setMaxDigits(20);
                                var dpl10 = 15;
                                var lr10 = biFromNumber(1000000000000000);
                                function BigInt(flag)
                                {
	                                if (typeof flag == ""boolean"" && flag == true) {
		                                this.digits = null;
	                                }
	                                else {
		                                this.digits = ZERO_ARRAY.slice(0);
	                                }
	                                this.isNeg = false;
                                }
                                function biFromDecimal(s)
                                {
	                                var isNeg = s.charAt(0) == '-';
	                                var i = isNeg ? 1 : 0;
	                                var result;
	                                while (i < s.length && s.charAt(i) == '0') ++i;
	                                if (i == s.length) {
		                                result = new BigInt();
	                                }
	                                else {
		                                var digitCount = s.length - i;
		                                var fgl = digitCount % dpl10;
		                                if (fgl == 0) fgl = dpl10;
		                                result = biFromNumber(Number(s.substr(i, fgl)));
		                                i += fgl;
		                                while (i < s.length) {
			                                result = biAdd(biMultiply(result, lr10),
			                                               biFromNumber(Number(s.substr(i, dpl10))));
			                                i += dpl10;
		                                }
		                                result.isNeg = isNeg;
	                                }
	                                return result;
                                }
                                function biCopy(bi)
                                {
	                                var result = new BigInt(true);
	                                result.digits = bi.digits.slice(0);
	                                result.isNeg = bi.isNeg;
	                                return result;
                                }
                                function biFromNumber(i)
                                {
	                                var result = new BigInt();
	                                result.isNeg = i < 0;
	                                i = Math.abs(i);
	                                var j = 0;
	                                while (i > 0) {
		                                result.digits[j++] = i & maxDigitVal;
		                                i >>= biRadixBits;
	                                }
	                                return result;
                                }
                                function reverseStr(s)
                                {
	                                var result = """";
	                                for (var i = s.length - 1; i > -1; --i) {
		                                result += s.charAt(i);
	                                }
	                                return result;
                                }
                                var hexatrigesimalToChar = new Array(
                                 '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                                 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
                                 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
                                 'u', 'v', 'w', 'x', 'y', 'z'
                                );
                                function biToString(x, radix)
                                {
	                                var b = new BigInt();
	                                b.digits[0] = radix;
	                                var qr = biDivideModulo(x, b);
	                                var result = hexatrigesimalToChar[qr[1].digits[0]];
	                                while (biCompare(qr[0], bigZero) == 1) {
		                                qr = biDivideModulo(qr[0], b);
		                                digit = qr[1].digits[0];
		                                result += hexatrigesimalToChar[qr[1].digits[0]];
	                                }
	                                return (x.isNeg ? ""-"" : """") + reverseStr(result);
                                }
                                function biToDecimal(x)
                                {
	                                var b = new BigInt();
	                                b.digits[0] = 10;
	                                var qr = biDivideModulo(x, b);
	                                var result = String(qr[1].digits[0]);
	                                while (biCompare(qr[0], bigZero) == 1) {
		                                qr = biDivideModulo(qr[0], b);
		                                result += String(qr[1].digits[0]);
	                                }
	                                return (x.isNeg ? ""-"" : """") + reverseStr(result);
                                }
                                var hexToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                                                          'a', 'b', 'c', 'd', 'e', 'f');
                                function digitToHex(n)
                                {
	                                var mask = 0xf;
	                                var result = """";
	                                for (i = 0; i < 4; ++i) {
		                                result += hexToChar[n & mask];
		                                n >>>= 4;
	                                }
	                                return reverseStr(result);
                                }
                                function biToHex(x)
                                {
	                                var result = """";
	                                var n = biHighIndex(x);
	                                for (var i = biHighIndex(x); i > -1; --i) {
		                                result += digitToHex(x.digits[i]);
	                                }
	                                return result;
                                }
                                function charToHex(c)
                                {
	                                var ZERO = 48;
	                                var NINE = ZERO + 9;
	                                var littleA = 97;
	                                var littleZ = littleA + 25;
	                                var bigA = 65;
	                                var bigZ = 65 + 25;
	                                var result;
	                                if (c >= ZERO && c <= NINE) {
		                                result = c - ZERO;
	                                } else if (c >= bigA && c <= bigZ) {
		                                result = 10 + c - bigA;
	                                } else if (c >= littleA && c <= littleZ) {
		                                result = 10 + c - littleA;
	                                } else {
		                                result = 0;
	                                }
	                                return result;
                                }
                                function hexToDigit(s)
                                {
	                                var result = 0;
	                                var sl = Math.min(s.length, 4);
	                                for (var i = 0; i < sl; ++i) {
		                                result <<= 4;
		                                result |= charToHex(s.charCodeAt(i))
	                                }
	                                return result;
                                }
                                function biFromHex(s)
                                {
	                                var result = new BigInt();
	                                var sl = s.length;
	                                for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
		                                result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
	                                }
	                                return result;
                                }
                                function biFromString(s, radix)
                                {
	                                var isNeg = s.charAt(0) == '-';
	                                var istop = isNeg ? 1 : 0;
	                                var result = new BigInt();
	                                var place = new BigInt();
	                                place.digits[0] = 1;
	                                for (var i = s.length - 1; i >= istop; i--) {
		                                var c = s.charCodeAt(i);
		                                var digit = charToHex(c);
		                                var biDigit = biMultiplyDigit(place, digit);
		                                result = biAdd(result, biDigit);
		                                place = biMultiplyDigit(place, radix);
	                                }
	                                result.isNeg = isNeg;
	                                return result;
                                }
                                function biDump(b)
                                {
	                                return (b.isNeg ? ""-"" : """") + b.digits.join("" "");
                                }
                                function biAdd(x, y)
                                {
	                                var result;
	                                if (x.isNeg != y.isNeg) {
		                                y.isNeg = !y.isNeg;
		                                result = biSubtract(x, y);
		                                y.isNeg = !y.isNeg;
	                                }
	                                else {
		                                result = new BigInt();
		                                var c = 0;
		                                var n;
		                                for (var i = 0; i < x.digits.length; ++i) {
			                                n = x.digits[i] + y.digits[i] + c;
			                                result.digits[i] = n & 0xffff;
			                                c = Number(n >= biRadix);
		                                }
		                                result.isNeg = x.isNeg;
	                                }
	                                return result;
                                }
                                function biSubtract(x, y)
                                {
	                                var result;
	                                if (x.isNeg != y.isNeg) {
		                                y.isNeg = !y.isNeg;
		                                result = biAdd(x, y);
		                                y.isNeg = !y.isNeg;
	                                } else {
		                                result = new BigInt();
		                                var n, c;
		                                c = 0;
		                                for (var i = 0; i < x.digits.length; ++i) {
			                                n = x.digits[i] - y.digits[i] + c;
			                                result.digits[i] = n & 0xffff;
			                                if (result.digits[i] < 0) result.digits[i] += biRadix;
			                                c = 0 - Number(n < 0);
		                                }
		                                if (c == -1) {
			                                c = 0;
			                                for (var i = 0; i < x.digits.length; ++i) {
				                                n = 0 - result.digits[i] + c;
				                                result.digits[i] = n & 0xffff;
				                                if (result.digits[i] < 0) result.digits[i] += biRadix;
				                                c = 0 - Number(n < 0);
			                                }
			                                result.isNeg = !x.isNeg;
		                                } else {
			                                result.isNeg = x.isNeg;
		                                }
	                                }
	                                return result;
                                }
                                function biHighIndex(x)
                                {
	                                var result = x.digits.length - 1;
	                                while (result > 0 && x.digits[result] == 0) --result;
	                                return result;
                                }
                                function biNumBits(x)
                                {
	                                var n = biHighIndex(x);
	                                var d = x.digits[n];
	                                var m = (n + 1) * bitsPerDigit;
	                                var result;
	                                for (result = m; result > m - bitsPerDigit; --result) {
		                                if ((d & 0x8000) != 0) break;
		                                d <<= 1;
	                                }
	                                return result;
                                }
                                function biMultiply(x, y)
                                {
	                                var result = new BigInt();
	                                var c;
	                                var n = biHighIndex(x);
	                                var t = biHighIndex(y);
	                                var u, uv, k;
	                                for (var i = 0; i <= t; ++i) {
		                                c = 0;
		                                k = i;
		                                for (j = 0; j <= n; ++j, ++k) {
			                                uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
			                                result.digits[k] = uv & maxDigitVal;
			                                c = uv >>> biRadixBits;
		                                }
		                                result.digits[i + n + 1] = c;
	                                }
	                                result.isNeg = x.isNeg != y.isNeg;
	                                return result;
                                }
                                function biMultiplyDigit(x, y)
                                {
	                                var n, c, uv;
	                                result = new BigInt();
	                                n = biHighIndex(x);
	                                c = 0;
	                                for (var j = 0; j <= n; ++j) {
		                                uv = result.digits[j] + x.digits[j] * y + c;
		                                result.digits[j] = uv & maxDigitVal;
		                                c = uv >>> biRadixBits;
	                                }
	                                result.digits[1 + n] = c;
	                                return result;
                                }
                                function arrayCopy(src, srcStart, dest, destStart, n)
                                {
	                                var m = Math.min(srcStart + n, src.length);
	                                for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
		                                dest[j] = src[i];
	                                }
                                }
                                var highBitMasks = new Array(0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800,
                                                             0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0,
                                                             0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF);
                                function biShiftLeft(x, n)
                                {
	                                var digitCount = Math.floor(n / bitsPerDigit);
	                                var result = new BigInt();
	                                arrayCopy(x.digits, 0, result.digits, digitCount,
	                                          result.digits.length - digitCount);
	                                var bits = n % bitsPerDigit;
	                                var rightBits = bitsPerDigit - bits;
	                                for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
		                                result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) |
		                                                   ((result.digits[i1] & highBitMasks[bits]) >>>
		                                                    (rightBits));
	                                }
	                                result.digits[0] = ((result.digits[i] << bits) & maxDigitVal);
	                                result.isNeg = x.isNeg;
	                                return result;
                                }
                                var lowBitMasks = new Array(0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
                                                            0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
                                                            0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF);
                                function biShiftRight(x, n)
                                {
	                                var digitCount = Math.floor(n / bitsPerDigit);
	                                var result = new BigInt();
	                                arrayCopy(x.digits, digitCount, result.digits, 0,
	                                          x.digits.length - digitCount);
	                                var bits = n % bitsPerDigit;
	                                var leftBits = bitsPerDigit - bits;
	                                for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
		                                result.digits[i] = (result.digits[i] >>> bits) |
		                                                   ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
	                                }
	                                result.digits[result.digits.length - 1] >>>= bits;
	                                result.isNeg = x.isNeg;
	                                return result;
                                }
                                function biMultiplyByRadixPower(x, n)
                                {
	                                var result = new BigInt();
	                                arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
	                                return result;
                                }
                                function biDivideByRadixPower(x, n)
                                {
	                                var result = new BigInt();
	                                arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
	                                return result;
                                }
                                function biModuloByRadixPower(x, n)
                                {
	                                var result = new BigInt();
	                                arrayCopy(x.digits, 0, result.digits, 0, n);
	                                return result;
                                }
                                function biCompare(x, y)
                                {
	                                if (x.isNeg != y.isNeg) {
		                                return 1 - 2 * Number(x.isNeg);
	                                }
	                                for (var i = x.digits.length - 1; i >= 0; --i) {
		                                if (x.digits[i] != y.digits[i]) {
			                                if (x.isNeg) {
				                                return 1 - 2 * Number(x.digits[i] > y.digits[i]);
			                                } else {
				                                return 1 - 2 * Number(x.digits[i] < y.digits[i]);
			                                }
		                                }
	                                }
	                                return 0;
                                }
                                function biDivideModulo(x, y)
                                {
	                                var nb = biNumBits(x);
	                                var tb = biNumBits(y);
	                                var origYIsNeg = y.isNeg;
	                                var q, r;
	                                if (nb < tb) {
		                                if (x.isNeg) {
			                                q = biCopy(bigOne);
			                                q.isNeg = !y.isNeg;
			                                x.isNeg = false;
			                                y.isNeg = false;
			                                r = biSubtract(y, x);
			                                x.isNeg = true;
			                                y.isNeg = origYIsNeg;
		                                } else {
			                                q = new BigInt();
			                                r = biCopy(x);
		                                }
		                                return new Array(q, r);
	                                }
	                                q = new BigInt();
	                                r = x;
	                                var t = Math.ceil(tb / bitsPerDigit) - 1;
	                                var lambda = 0;
	                                while (y.digits[t] < biHalfRadix) {
		                                y = biShiftLeft(y, 1);
		                                ++lambda;
		                                ++tb;
		                                t = Math.ceil(tb / bitsPerDigit) - 1;
	                                }
	                                r = biShiftLeft(r, lambda);
	                                nb += lambda;
	                                var n = Math.ceil(nb / bitsPerDigit) - 1;
	                                var b = biMultiplyByRadixPower(y, n - t);
	                                while (biCompare(r, b) != -1) {
		                                ++q.digits[n - t];
		                                r = biSubtract(r, b);
	                                }
	                                for (var i = n; i > t; --i) {
                                    var ri = (i >= r.digits.length) ? 0 : r.digits[i];
                                    var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
                                    var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
                                    var yt = (t >= y.digits.length) ? 0 : y.digits[t];
                                    var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
		                                if (ri == yt) {
			                                q.digits[i - t - 1] = maxDigitVal;
		                                } else {
			                                q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
		                                }
		                                var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
		                                var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
		                                while (c1 > c2) {
			                                --q.digits[i - t - 1];
			                                c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
			                                c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2);
		                                }
		                                b = biMultiplyByRadixPower(y, i - t - 1);
		                                r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
		                                if (r.isNeg) {
			                                r = biAdd(r, b);
			                                --q.digits[i - t - 1];
		                                }
	                                }
	                                r = biShiftRight(r, lambda);
	                                q.isNeg = x.isNeg != origYIsNeg;
	                                if (x.isNeg) {
		                                if (origYIsNeg) {
			                                q = biAdd(q, bigOne);
		                                } else {
			                                q = biSubtract(q, bigOne);
		                                }
		                                y = biShiftRight(y, lambda);
		                                r = biSubtract(y, r);
	                                }
	                                if (r.digits[0] == 0 && biHighIndex(r) == 0) r.isNeg = false;
	                                return new Array(q, r);
                                }
                                function biDivide(x, y)
                                {
	                                return biDivideModulo(x, y)[0];
                                }
                                function biModulo(x, y)
                                {
	                                return biDivideModulo(x, y)[1];
                                }
                                function biMultiplyMod(x, y, m)
                                {
	                                return biModulo(biMultiply(x, y), m);
                                }
                                function biPow(x, y)
                                {
	                                var result = bigOne;
	                                var a = x;
	                                while (true) {
		                                if ((y & 1) != 0) result = biMultiply(result, a);
		                                y >>= 1;
		                                if (y == 0) break;
		                                a = biMultiply(a, a);
	                                }
	                                return result;
                                }
                                function biPowMod(x, y, m)
                                {
	                                var result = bigOne;
	                                var a = x;
	                                var k = y;
	                                while (true) {
		                                if ((k.digits[0] & 1) != 0) result = biMultiplyMod(result, a, m);
		                                k = biShiftRight(k, 1);
		                                if (k.digits[0] == 0 && biHighIndex(k) == 0) break;
		                                a = biMultiplyMod(a, a, m);
	                                }
	                                return result;
                                };";
        #endregion BigInt.js

        #region Barrett.js
        private static string JSBarrett = @"function BarrettMu(m)
                                        {
	                                        this.modulus = biCopy(m);
	                                        this.k = biHighIndex(this.modulus) + 1;
	                                        var b2k = new BigInt();
	                                        b2k.digits[2 * this.k] = 1;
	                                        this.mu = biDivide(b2k, this.modulus);
	                                        this.bkplus1 = new BigInt();
	                                        this.bkplus1.digits[this.k + 1] = 1;
	                                        this.modulo = BarrettMu_modulo;
	                                        this.multiplyMod = BarrettMu_multiplyMod;
	                                        this.powMod = BarrettMu_powMod;
                                        }
                                        function BarrettMu_modulo(x)
                                        {
	                                        var q1 = biDivideByRadixPower(x, this.k - 1);
	                                        var q2 = biMultiply(q1, this.mu);
	                                        var q3 = biDivideByRadixPower(q2, this.k + 1);
	                                        var r1 = biModuloByRadixPower(x, this.k + 1);
	                                        var r2term = biMultiply(q3, this.modulus);
	                                        var r2 = biModuloByRadixPower(r2term, this.k + 1);
	                                        var r = biSubtract(r1, r2);
	                                        if (r.isNeg) {
		                                        r = biAdd(r, this.bkplus1);
	                                        }
	                                        var rgtem = biCompare(r, this.modulus) >= 0;
	                                        while (rgtem) {
		                                        r = biSubtract(r, this.modulus);
		                                        rgtem = biCompare(r, this.modulus) >= 0;
	                                        }
	                                        return r;
                                        }
                                        function BarrettMu_multiplyMod(x, y)
                                        {
	                                        var xy = biMultiply(x, y);
	                                        return this.modulo(xy);
                                        }
                                        function BarrettMu_powMod(x, y)
                                        {
	                                        var result = new BigInt();
	                                        result.digits[0] = 1;
	                                        var a = x;
	                                        var k = y;
	                                        while (true) {
		                                        if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
		                                        k = biShiftRight(k, 1);
		                                        if (k.digits[0] == 0 && biHighIndex(k) == 0) break;
		                                        a = this.multiplyMod(a, a);
	                                        }
	                                        return result;
                                        };";
        #endregion Barrett.js

        #region RSA.js
        private static string JSRSA = @"function RSAKeyPair(encryptionExponent, decryptionExponent, modulus)
                                    {
	                                    this.e = biFromHex(encryptionExponent);
	                                    this.d = biFromHex(decryptionExponent);
	                                    this.m = biFromHex(modulus);
	                                    this.chunkSize = 2 * biHighIndex(this.m);
	                                    this.radix = 16;
	                                    this.barrett = new BarrettMu(this.m);
                                    }
                                    function twoDigit(n)
                                    {
	                                    return (n < 10 ? ""0"" : """") + String(n);
                                    }
                                    function RSAencrypted(key, s)
                                    {
	                                    var a = new Array();
	                                    var sl = s.length;
	                                    var i = 0;
	                                    while (i < sl) {
		                                    a[i] = s.charCodeAt(i);
		                                    i++;
	                                    }
	                                    while (a.length % key.chunkSize != 0) {
		                                    a[i++] = 0;
	                                    }
	                                    var al = a.length;
	                                    var result = """";
	                                    var j, k, block;
	                                    for (i = 0; i < al; i += key.chunkSize) {
		                                    block = new BigInt();
		                                    j = 0;
		                                    for (k = i; k < i + key.chunkSize; ++j) {
			                                    block.digits[j] = a[k++];
			                                    block.digits[j] += a[k++] << 8;
		                                    }
		                                    var crypt = key.barrett.powMod(block, key.e);
		                                    var text = key.radix == 16 ? biToHex(crypt) : biToString(crypt, key.radix);
		                                    result += text + "" "";
	                                    }
	                                    return result.substring(0, result.length - 1);
                                    }
                                    function RSAdecrypted(key, s)
                                    {
	                                    var blocks = s.split("" "");
	                                    var result = """";
	                                    var i, j, block;
	                                    for (i = 0; i < blocks.length; ++i) {
		                                    var bi;
		                                    if (key.radix == 16) {
			                                    bi = biFromHex(blocks[i]);
		                                    }
		                                    else {
			                                    bi = biFromString(blocks[i], key.radix);
		                                    }
		                                    block = key.barrett.powMod(bi, key.d);
		                                    for (j = 0; j <= biHighIndex(block); ++j) {
			                                    result += String.fromCharCode(block.digits[j] & 255,
			                                                                  block.digits[j] >> 8);
		                                    }
	                                    }
	                                    if (result.charCodeAt(result.length - 1) == 0) {
		                                    result = result.substring(0, result.length - 1);
	                                    }
	                                    return result;
                                    };";
        #endregion RSA.js

        #region xxtea.js
        private static string JSxxtea = @"function Xxtea(privateKey)
                                    {
                                        this._keyString = privateKey;
                                    }
                                    Xxtea.prototype._long2str = function(v, w)
                                    {
                                        var vl = v.length;
                                        var n = (vl - 1) << 2;
                                        if (w) {
                                            var m = v[vl - 1];
                                            if ((m < n - 3) || (m > n)) return null;
                                            n = m;
                                        }
                                        for (var i = 0; i < vl; i++) {
                                            v[i] = String.fromCharCode(v[i] & 0xff,
                                                                       v[i] >>> 8 & 0xff,
                                                                       v[i] >>> 16 & 0xff,
                                                                       v[i] >>> 24 & 0xff);
                                        }
                                        if (w) {
                                            return v.join('').substring(0, n);
                                        }
                                        else {
                                            return v.join('');
                                        }
                                    }
                                    Xxtea.prototype._str2long = function(s, w)
                                    {
                                        var len = s.length;
                                        var v = [];
                                        for (var i = 0; i < len; i += 4) {
                                            v[i >> 2] = s.charCodeAt(i)
                                                      | s.charCodeAt(i + 1) << 8
                                                      | s.charCodeAt(i + 2) << 16
                                                      | s.charCodeAt(i + 3) << 24;
                                        }
                                        if (w) {
                                            v[v.length] = len;
                                        }
                                        return v;
                                    }
                                    Xxtea.prototype.xxtea_encrypt = function(str)
                                    {
                                        if (str == """") {
                                            return """";
                                        }
                                        str = Base64.encode64(UtfParser.utf16to8(str));
                                        var v = this._str2long(str, true);
                                        var k = this._str2long(this._keyString, false);
                                        if (k.length < 4) {
                                            k.length = 4;
                                        }
                                        var n = v.length - 1;
                                        var z = v[n], y = v[0], delta = 0x9E3779B9;
                                        var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = 0;
                                        while (0 < q--) {
                                            sum = sum + delta & 0xffffffff;
                                            e = sum >>> 2 & 3;
                                            for (p = 0; p < n; p++) {
                                                y = v[p + 1];
                                                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                                                z = v[p] = v[p] + mx & 0xffffffff;
                                            }
                                            y = v[0];
                                            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                                            z = v[n] = v[n] + mx & 0xffffffff;
                                        }
                                         return Base64.encode64(this._long2str(v, false));
                                    }
                                    Xxtea.prototype.xxtea_decrypt = function(str)
                                    {
                                        if (str == """") {
                                            return """";
                                        }
                                        str = Base64.decode64(str);
                                        var v = this._str2long(str, false);
                                        var k = this._str2long(this._keyString, false);
                                        if (k.length < 4) {
                                            k.length = 4;
                                        }
                                        var n = v.length - 1;
                                        var z = v[n - 1], y = v[0], delta = 0x9E3779B9;
                                        var mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 0xffffffff;
                                        while (sum != 0) {
                                            e = sum >>> 2 & 3;
                                            for (p = n; p > 0; p--) {
                                                z = v[p - 1];
                                                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                                                y = v[p] = v[p] - mx & 0xffffffff;
                                            }
                                            z = v[n];
                                            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                                            y = v[0] = v[0] - mx & 0xffffffff;
                                            sum = sum - delta & 0xffffffff;
                                        }
                                        return UtfParser.utf8to16(Base64.decode64(this._long2str(v, true)));
                                    }
                                    function UtfParser()
                                    {
                                    }
                                    UtfParser.utf16to8 = function (str)
                                    {
                                        var out, i, len, c;
                                        out = """";
                                        len = str.length;
                                        for(i = 0; i < len; i++)
                                        {
	                                        c = str.charCodeAt(i);
	                                        if ((c >= 0x0001) && (c <= 0x007F))
	                                        {
	                                            out += str.charAt(i);
	                                        }
	                                        else if (c > 0x07FF)
	                                        {
	                                            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	                                            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
	                                            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	                                        }
	                                        else {
	                                            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
	                                            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
	                                        }
                                        }
                                        return out;
                                    }
                                    UtfParser.utf8to16 = function (str)
                                    {
                                        str = str.toString();
                                        var out, i, len, c;
                                        var char2, char3;
                                        out = """";
                                        len = str.length;
                                        i = 0;
                                        while(i < len) {
	                                        c = str.charCodeAt(i++);
	                                        switch(c >> 4)
	                                        {
	                                          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	                                            out += str.charAt(i-1);
	                                            break;
	                                          case 12: case 13:
	                                            char2 = str.charCodeAt(i++);
	                                            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	                                            break;
	                                          case 14:
	                                            char2 = str.charCodeAt(i++);
	                                            char3 = str.charCodeAt(i++);
	                                            out += String.fromCharCode(((c & 0x0F) << 12) |
					                                           ((char2 & 0x3F) << 6) |
					                                           ((char3 & 0x3F) << 0));
	                                            break;
	                                        }
                                        }
                                        return out;
                                    }
                                    function Base64()
                                    {
                                    }
                                    Base64._keyStr = ""ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="";
                                    Base64.encode64 = function(input)
                                    {
                                        var output = """";
                                        var chr1, chr2, chr3 = """";
                                        var enc1, enc2, enc3, enc4 = """";
                                        var i = 0;
                                        do
                                        {
                                            chr1 = input.charCodeAt(i++);
                                            chr2 = input.charCodeAt(i++);
                                            chr3 = input.charCodeAt(i++);
                                            enc1 = chr1 >> 2;
                                            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                                            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                                            enc4 = chr3 & 63;
                                            if (isNaN(chr2)) {
                                               enc3 = enc4 = 64;
                                            } else if (isNaN(chr3)) {
                                               enc4 = 64;
                                            }
                                            output = output +
                                               Base64._keyStr.charAt(enc1) +
                                               Base64._keyStr.charAt(enc2) +
                                               Base64._keyStr.charAt(enc3) +
                                               Base64._keyStr.charAt(enc4);
                                            chr1 = chr2 = chr3 = """";
                                            enc1 = enc2 = enc3 = enc4 = """";
                                        } while (i < input.length);
                                        return output;
                                    }
                                    Base64.decode64 = function(input)
                                    {
                                        var output = """";
                                        var chr1, chr2, chr3 = """";
                                        var enc1, enc2, enc3, enc4 = """";
                                        var i = 0;
                                        var base64test = /[^A-Za-z0-9\+\/\=\n]/g;
                                        if (base64test.exec(input))
                                        {
                                            alert(""There were invalid base64 characters in the input text.\n"" +
                                                  ""Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"" +
                                                  ""Expect errors in decoding."");
                                        }
                                        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, """");
                                        do
                                        {
                                            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                                            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                                            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                                            enc4 = Base64._keyStr.indexOf(input.charAt(i++));
                                            chr1 = (enc1 << 2) | (enc2 >> 4);
                                            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                                            chr3 = ((enc3 & 3) << 6) | enc4;
                                            output = output + String.fromCharCode(chr1);
                                            if (enc3 != 64) {
                                               output = output + String.fromCharCode(chr2);
                                            }
                                            if (enc4 != 64) {
                                               output = output + String.fromCharCode(chr3);
                                            }
                                            chr1 = chr2 = chr3 = """";
                                            enc1 = enc2 = enc3 = enc4 = """";
                                        } while (i < input.length);
                                        return output;
                                    }

                                    function XxteaEncode(key,datastring){
                                        var xt = new Xxtea(key);
                                        return xt.xxtea_encrypt(datastring);
                                    }

                                    function XxteaDecode(key,codestring){
                                        var xt = new Xxtea(key);
                                        return xt.xxtea_decrypt(codestring);
                                    };";
        #endregion xxtea.js

        #endregion 函数JS定义

        #region 内部公共函数
        private static string bytesToStringList(byte[] bytes)
        {
            string temp = "";
            for (int i = 0; i < bytes.Length; i++)
            {
                temp += bytes[i].ToString() + ",";
            }

            return temp;
        }

        private static byte[] stringListToBytes(string str)
        {
            string[] temp = str.Split(',');
            byte[] ret = new byte[temp.Length];
            for (int i = 0; i < temp.Length; i++)
            {
                ret[i] = (byte)int.Parse(temp[i]);
            }
            return ret;
        }
        #endregion 内部公共函数

        #region 常用工具函数

        #region stringToBytes
        /// <summary>
        /// 将字符串转换为byte数组
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>byte数组</returns>
        public static byte[] stringToBytes(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);
            return stringListToBytes((string)script.Eval("Crypto.charenc.Binary.stringToBytes('" + str.Replace("'", "\\'") + "').toString();"));
        }
        #endregion stringToBytes

        #region bytesToString
        /// <summary>
        /// 将byte数组转换为字符串
        /// </summary>
        /// <param name="bytes">要转换的byte数组</param>
        /// <returns>字符串</returns>
        public static string bytesToString(byte[] bytes)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);

            //将数组转换为js格式并执行
            return (string)script.Eval("Crypto.charenc.Binary.bytesToString([" + bytesToStringList(bytes) + "]);");
        }
        #endregion bytesToString

        #region utf8StringToBytes
        /// <summary>
        /// 将字符串使用UTF8编码的方式转换为byte数组
        /// </summary>
        /// <param name="str">要转换的字符串</param>
        /// <returns>byte数组</returns>
        public static byte[] utf8StringToBytes(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);
            return stringListToBytes((string)script.Eval("Crypto.charenc.UTF8.stringToBytes('" + str.Replace("'", "\\'") + "').toString();"));
        }
        #endregion utf8StringToBytes

        #region utf8BytesToString
        /// <summary>
        /// 将utf8编码的byte数组转换为字符串
        /// </summary>
        /// <param name="bytes">要转换的byte数组</param>
        /// <returns>字符串</returns>
        public static string utf8BytesToString(byte[] bytes)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);

            //将数组转换为js格式并执行
            return (string)script.Eval("Crypto.charenc.UTF8.bytesToString([" + bytesToStringList(bytes) + "]);");
        }
        #endregion utf8BytesToString

        #region bytesToHex
        /// <summary>
        /// 将byte数组转换为hex字符串
        /// </summary>
        /// <param name="bytes">要转换的byte数组</param>
        /// <returns>hex字符串</returns>
        public static string bytesToHex(byte[] bytes)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);

            //将数组转换为js格式并执行
            return (string)script.Eval("Crypto.util.bytesToHex([" + bytesToStringList(bytes) + "]);");
        }
        #endregion bytesToHex

        #region hexToBytes
        /// <summary>
        /// 将Hex字符串转换为byte数组
        /// </summary>
        /// <param name="str">要转换的hex字符串</param>
        /// <returns>byte数组</returns>
        public static byte[] hexToBytes(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);
            return stringListToBytes((string)script.Eval("Crypto.util.hexToBytes('" + str + "').toString();"));
        }
        #endregion hexToBytes

        #region bytesToBase64
        /// <summary>
        /// 将byte数组转换为Base64字符串
        /// </summary>
        /// <param name="bytes">要转换的byte数组</param>
        /// <returns>Base64字符串</returns>
        public static string bytesToBase64(byte[] bytes)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);

            //将数组转换为js格式并执行
            return (string)script.Eval("Crypto.util.bytesToBase64([" + bytesToStringList(bytes) + "]);");
        }
        #endregion bytesToBase64

        #region base64ToBytes
        /// <summary>
        /// 将Base64字符串转换为byte数组
        /// </summary>
        /// <param name="str">要转换的Base64字符串</param>
        /// <returns>byte数组</returns>
        public static byte[] base64ToBytes(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);
            return stringListToBytes((string)script.Eval("Crypto.util.base64ToBytes('" + str + "').toString();"));
        }
        #endregion base64ToBytes

        #region stringToHex
        /// <summary>
        /// 将字符串转换为hex串，不支持中文
        /// </summary>
        /// <param name="str">字符串</param>
        /// <returns>转换的hex串</returns>
        public static string stringToHex(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(@"var stringToHex = function(s){
                            var r='';
                            var hexes=new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
                            for(var i=0;i<(s.length);i++){r+=hexes[s.charCodeAt(i)>>4]+hexes[s.charCodeAt(i)&0xf];}
                            return r;
                        };");
            object result = script.Eval("stringToHex('" + str.Replace("'", "\\'") + "');");
            return (string)result;
        }
        #endregion stringToHex

        #region hexToString
        /// <summary>
        /// 将hex串转换为字符串，不支持中文
        /// </summary>
        /// <param name="hexStr">hex串</param>
        /// <returns>还原的字符串</returns>
        public static string hexToString(string hexStr)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(@"var hexToString = function(s){ 
                            var r=''; 
                            for(var i=0;i<s.length;i+=2){
                                var sxx=parseInt(s.substring(i,i+2),16);
                                r+=String.fromCharCode(sxx);
                            }
                            return r;
                        };");
            object result = script.Eval("hexToString('" + hexStr + "');");
            return (string)result;
        }
        #endregion hexToString

        #region utf8StringToHex
        /// <summary>
        /// 将字符串转换为hex串，使用uft8编码
        /// </summary>
        /// <param name="str">字符串</param>
        /// <returns>转换的hex串</returns>
        public static string utf8StringToHex(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);
            object result = script.Eval("Crypto.util.utf8StringToHex('" + str.Replace("'", "\\'") + "');");
            return (string)result;
        }
        #endregion utf8StringToHex

        #region hexToUtf8String
        /// <summary>
        /// 将hex串转换为字符串，使用uft8编码
        /// </summary>
        /// <param name="hexStr">hex串</param>
        /// <returns>还原的字符串</returns>
        public static string hexToUtf8String(string hexStr)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto);
            object result = script.Eval("Crypto.util.hexToUtf8String('" + hexStr + "');");
            return (string)result;
        }
        #endregion hexToUtf8String

        #endregion 常用工具函数

        #region MD5
        /// <summary>
        /// MD5加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <returns>MD5值</returns>
        public static string MD5(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto+JSmd5);
            return (string)script.Eval("Crypto.MD5('" + str.Replace("'", "\\'") + "');");
        }
        #endregion MD5

        #region SHA1
        /// <summary>
        /// SHA1加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <returns>SHA1值</returns>
        public static string SHA1(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSsha1);
            return (string)script.Eval("Crypto.SHA1('" + str.Replace("'", "\\'") + "');");
        }
        #endregion SHA1

        #region SHA256
        /// <summary>
        /// SHA256加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <returns>SHA256值</returns>
        public static string SHA256(string str)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSsha256);
            return (string)script.Eval("Crypto.SHA256('" + str.Replace("'", "\\'") + "');");
        }
        #endregion SHA1

        #region AES
        /// <summary>
        /// AES加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>密文</returns>
        public static string AESEncrypt(string str,string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSofb + JSpbkdf2 + JShmac + JSsha1 + JSaes);
            return (string)script.Eval("Crypto.AES.encrypt('" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "');");
        }

        /// <summary>
        /// AES解密
        /// </summary>
        /// <param name="encryptStr">密文</param>
        /// <param name="key">密钥</param>
        /// <returns>解密后的字符串</returns>
        public static string AESDecrypt(string encryptStr, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSofb + JSpbkdf2 + JShmac + JSsha1 + JSaes);
            return (string)script.Eval("Crypto.AES.decrypt('" + encryptStr + "','" + key.Replace("'", "\\'") + "');");
        }
        #endregion AES

        #region Rabbit
        /// <summary>
        /// Rabbit加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>密文</returns>
        public static string RabbitEncrypt(string str, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSpbkdf2 + JShmac + JSsha1 + JSrabbit);
            return (string)script.Eval("Crypto.Rabbit.encrypt('" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "');");
        }

        /// <summary>
        /// Rabbit解密
        /// </summary>
        /// <param name="encryptStr">密文</param>
        /// <param name="key">密钥</param>
        /// <returns>解密后的字符串</returns>
        public static string RabbitDecrypt(string encryptStr, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSpbkdf2 + JShmac + JSsha1 + JSrabbit);
            return (string)script.Eval("Crypto.Rabbit.decrypt('" + encryptStr + "','" + key.Replace("'", "\\'") + "');");
        }
        #endregion Rabbit

        #region MARC4
        /// <summary>
        /// MARC4加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>密文</returns>
        public static string MARC4Encrypt(string str, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSpbkdf2 + JShmac + JSsha1 + JSmarc4);
            return (string)script.Eval("Crypto.MARC4.encrypt('" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "');");
        }

        /// <summary>
        /// MARC4解密
        /// </summary>
        /// <param name="encryptStr">密文</param>
        /// <param name="key">密钥</param>
        /// <returns>解密后的字符串</returns>
        public static string MARC4Decrypt(string encryptStr, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JSpbkdf2 + JShmac + JSsha1 + JSmarc4);
            return (string)script.Eval("Crypto.MARC4.decrypt('" + encryptStr + "','" + key.Replace("'", "\\'") + "');");
        }
        #endregion MARC4

        #region HMAC
        /// <summary>
        /// HMAC-MD5加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>加密值</returns>
        public static string HMAC_MD5(string str,string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JShmac + JSmd5);
            return (string)script.Eval("Crypto.HMAC(Crypto.MD5, '" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "');");
        }

        /// <summary>
        /// HMAC-SHA1加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>加密值</returns>
        public static string HMAC_SHA1(string str, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JShmac + JSsha1);
            return (string)script.Eval("Crypto.HMAC(Crypto.SHA1, '" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "');");
        }

        /// <summary>
        /// HMAC-SHA256加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>加密值</returns>
        public static string HMAC_SHA256(string str, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JScrypto + JShmac + JSsha256);
            return (string)script.Eval("Crypto.HMAC(Crypto.SHA256, '" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "');");
        }

        #endregion HMAC

        #region DES
        /// <summary>
        /// DES加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>密文</returns>
        public static string DESEncrypt(string str, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JSdes);
            return (string)script.Eval("DES(1,'" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "',0);");
        }

        /// <summary>
        /// DES加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <param name="hexEncode">密文是否使用hex编码</param>
        /// <returns>密文</returns>
        public static string DESEncrypt(string str, string key,bool hexEncode)
        {
            if (hexEncode)
            {
                ScriptControlClass script;
                script = new ScriptControlClass();
                script.Language = "JScript";
                script.Reset();
                script.AddCode(JScrypto+JSdes);
                return (string)script.Eval("Crypto.util.utf8StringToHex(DES(1,'" + str.Replace("'", "\\'") + "','" + key.Replace("'", "\\'") + "',0));");
            }
            else
            {
                return DESEncrypt(str, key);
            }
        }

        /// <summary>
        /// DES解密
        /// </summary>
        /// <param name="encryptStr">密文</param>
        /// <param name="key">密钥</param>
        /// <returns>解密后的字符串</returns>
        public static string DESDecrypt(string encryptStr, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JSdes);
            return (string)script.Eval("DES(0,'" + encryptStr + "','" + key.Replace("'", "\\'") + "',0);");
        }

        /// <summary>
        /// DES解密
        /// </summary>
        /// <param name="encryptStr">密文</param>
        /// <param name="key">密钥</param>
        /// <param name="hexEncode">密文是否使用hex编码</param>
        /// <returns>解密后的字符串</returns>
        public static string DESDecrypt(string encryptStr, string key, bool hexEncode)
        {
            if (hexEncode)
            {
                ScriptControlClass script;
                script = new ScriptControlClass();
                script.Language = "JScript";
                script.Reset();
                script.AddCode(JScrypto + JSdes);
                return (string)script.Eval("DES(0,Crypto.util.hexToUtf8String('" + encryptStr + "'),'" + key.Replace("'", "\\'") + "',0);");
            }
            else
            {
                return DESDecrypt(encryptStr, key);
            }
        }
        #endregion DES

        #region RSA
        public static string RSAEncrypt(string str, string publicKey, string modulus, string maxDigits)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JSBigInt+JSBarrett+JSRSA);
            string js = "setMaxDigits(" + maxDigits + ");var key = new RSAKeyPair('"+publicKey+"','','"+modulus+"');RSAencrypted(key,'"+str.Replace("'","\\'")+"');";
            return (string)script.Eval(js);
        }


        public static string RSADecrypt(string encryptStr, string privateKey, string modulus, string maxDigits)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JSBigInt + JSBarrett + JSRSA);
            string js = "setMaxDigits(" + maxDigits + ");var key = new RSAKeyPair('','" + privateKey + "','" + modulus + "');RSAdecrypted(key,'" + encryptStr + "');";
            return (string)script.Eval(js);
        }
        #endregion RSA

        #region Xxtea
        /// <summary>
        /// Xxtea加密
        /// </summary>
        /// <param name="str">要加密的字符串</param>
        /// <param name="key">密钥</param>
        /// <returns>密文</returns>
        public static string XxteaEncrypt(string str, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JSxxtea);
            return (string)script.Eval("XxteaEncode('" + key.Replace("'", "\\'") + "','" + str.Replace("'", "\\'") + "');");
        }

        /// <summary>
        /// Xxtea解密
        /// </summary>
        /// <param name="encryptStr">密文</param>
        /// <param name="key">密钥</param>
        /// <returns>解密后的字符串</returns>
        public static string XxteaDecrypt(string encryptStr, string key)
        {
            ScriptControlClass script;
            script = new ScriptControlClass();
            script.Language = "JScript";
            script.Reset();
            script.AddCode(JSxxtea);
            return (string)script.Eval("XxteaDecode('" + key.Replace("'", "\\'") + "','" + encryptStr + "');");
        }
        #endregion Xxtea

    }
}
