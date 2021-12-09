// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: yin-yang;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code-branch;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code-branch;
// 
// 「小件件」
// 开发环境，用于小组件调用
// https://x.im3x.cn
// https://github.com/im3x/Scriptables
// 

// 组件基础类
const RUNTIME_VERSION = 20201209

class Base {
  constructor(arg = "") {
    this.arg = arg
    this._actions = {}
    this.init()
  }

  init(widgetFamily = config.widgetFamily) {
    // 组件大小：small,medium,large
    this.widgetFamily = widgetFamily
    // 系统设置的key，这里分为三个类型：
    // 1. 全局
    // 2. 不同尺寸的小组件
    // 3. 不同尺寸+小组件自定义的参数
    // 当没有key2时，获取key1，没有key1获取全局key的设置
    // this.SETTING_KEY = this.md5(Script.name()+'@'+this.widgetFamily+"@"+this.arg)
    // this.SETTING_KEY1 = this.md5(Script.name()+'@'+this.widgetFamily)
    this.SETTING_KEY = this.md5(Script.name())
    // 文件管理器
    // 提示：缓存数据不要用这个操作，这个是操作源码目录的，缓存建议存放在local temp目录中
    this.FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']()
    // 本地，用于存储图片等
    this.FILE_MGR_LOCAL = FileManager.local()
    this.BACKGROUND_KEY_SMALL = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY}_small.jpg`)
    this.BACKGROUND_KEY_MEDIUM = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY}_medium.jpg`)
    this.BACKGROUND_KEY_LARGE = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY}_large.jpg`)
    // // 插件设置
    this.settings = this.getSettings()
  }

  /**
   * 注册点击操作菜单
   * @param {string} name 操作函数名
   * @param {func} func 点击后执行的函数
   */
  registerAction(name, func) {
    this._actions[name] = func.bind(this)
  }

  /**
   * 生成操作回调URL，点击后执行本脚本，并触发相应操作
   * @param {string} name 操作的名称
   * @param {string} data 传递的数据
   */
  actionUrl(name = '', data = '') {
    let u = URLScheme.forRunningScript()
    let q = `act=${encodeURIComponent(name)}&data=${encodeURIComponent(data)}&__arg=${encodeURIComponent(this.arg)}&__size=${this.widgetFamily}`
    let result = ''
    if (u.includes('run?')) {
      result = `${u}&${q}`
    } else {
      result = `${u}?${q}`
    }
    return result
  }

  /**
   * base64 编码字符串
   * @param {string} str 要编码的字符串
   */
  base64Encode(str) {
    const data = Data.fromString(str)
    return data.toBase64String()
  }

  /**
   * base64解码数据 返回字符串
   * @param {string} b64 base64编码的数据
   */
  base64Decode(b64) {
    const data = Data.fromBase64String(b64)
    return data.toRawString()
  }

  /**
   * md5 加密字符串
   * @param {string} str 要加密成md5的数据
   */
  md5(str) {
    function d(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r } function f(n, t, r, e, o, u) { return d((c = d(d(t, n), d(e, u))) << (f = o) | c >>> 32 - f, r); var c, f } function l(n, t, r, e, o, u, c) { return f(t & r | ~t & e, n, t, o, u, c) } function v(n, t, r, e, o, u, c) { return f(t & e | r & ~e, n, t, o, u, c) } function g(n, t, r, e, o, u, c) { return f(t ^ r ^ e, n, t, o, u, c) } function m(n, t, r, e, o, u, c) { return f(r ^ (t | ~e), n, t, o, u, c) } function i(n, t) { var r, e, o, u; n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t; for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16)c = l(r = c, e = f, o = i, u = a, n[h], 7, -680876936), a = l(a, c, f, i, n[h + 1], 12, -389564586), i = l(i, a, c, f, n[h + 2], 17, 606105819), f = l(f, i, a, c, n[h + 3], 22, -1044525330), c = l(c, f, i, a, n[h + 4], 7, -176418897), a = l(a, c, f, i, n[h + 5], 12, 1200080426), i = l(i, a, c, f, n[h + 6], 17, -1473231341), f = l(f, i, a, c, n[h + 7], 22, -45705983), c = l(c, f, i, a, n[h + 8], 7, 1770035416), a = l(a, c, f, i, n[h + 9], 12, -1958414417), i = l(i, a, c, f, n[h + 10], 17, -42063), f = l(f, i, a, c, n[h + 11], 22, -1990404162), c = l(c, f, i, a, n[h + 12], 7, 1804603682), a = l(a, c, f, i, n[h + 13], 12, -40341101), i = l(i, a, c, f, n[h + 14], 17, -1502002290), c = v(c, f = l(f, i, a, c, n[h + 15], 22, 1236535329), i, a, n[h + 1], 5, -165796510), a = v(a, c, f, i, n[h + 6], 9, -1069501632), i = v(i, a, c, f, n[h + 11], 14, 643717713), f = v(f, i, a, c, n[h], 20, -373897302), c = v(c, f, i, a, n[h + 5], 5, -701558691), a = v(a, c, f, i, n[h + 10], 9, 38016083), i = v(i, a, c, f, n[h + 15], 14, -660478335), f = v(f, i, a, c, n[h + 4], 20, -405537848), c = v(c, f, i, a, n[h + 9], 5, 568446438), a = v(a, c, f, i, n[h + 14], 9, -1019803690), i = v(i, a, c, f, n[h + 3], 14, -187363961), f = v(f, i, a, c, n[h + 8], 20, 1163531501), c = v(c, f, i, a, n[h + 13], 5, -1444681467), a = v(a, c, f, i, n[h + 2], 9, -51403784), i = v(i, a, c, f, n[h + 7], 14, 1735328473), c = g(c, f = v(f, i, a, c, n[h + 12], 20, -1926607734), i, a, n[h + 5], 4, -378558), a = g(a, c, f, i, n[h + 8], 11, -2022574463), i = g(i, a, c, f, n[h + 11], 16, 1839030562), f = g(f, i, a, c, n[h + 14], 23, -35309556), c = g(c, f, i, a, n[h + 1], 4, -1530992060), a = g(a, c, f, i, n[h + 4], 11, 1272893353), i = g(i, a, c, f, n[h + 7], 16, -155497632), f = g(f, i, a, c, n[h + 10], 23, -1094730640), c = g(c, f, i, a, n[h + 13], 4, 681279174), a = g(a, c, f, i, n[h], 11, -358537222), i = g(i, a, c, f, n[h + 3], 16, -722521979), f = g(f, i, a, c, n[h + 6], 23, 76029189), c = g(c, f, i, a, n[h + 9], 4, -640364487), a = g(a, c, f, i, n[h + 12], 11, -421815835), i = g(i, a, c, f, n[h + 15], 16, 530742520), c = m(c, f = g(f, i, a, c, n[h + 2], 23, -995338651), i, a, n[h], 6, -198630844), a = m(a, c, f, i, n[h + 7], 10, 1126891415), i = m(i, a, c, f, n[h + 14], 15, -1416354905), f = m(f, i, a, c, n[h + 5], 21, -57434055), c = m(c, f, i, a, n[h + 12], 6, 1700485571), a = m(a, c, f, i, n[h + 3], 10, -1894986606), i = m(i, a, c, f, n[h + 10], 15, -1051523), f = m(f, i, a, c, n[h + 1], 21, -2054922799), c = m(c, f, i, a, n[h + 8], 6, 1873313359), a = m(a, c, f, i, n[h + 15], 10, -30611744), i = m(i, a, c, f, n[h + 6], 15, -1560198380), f = m(f, i, a, c, n[h + 13], 21, 1309151649), c = m(c, f, i, a, n[h + 4], 6, -145523070), a = m(a, c, f, i, n[h + 11], 10, -1120210379), i = m(i, a, c, f, n[h + 2], 15, 718787259), f = m(f, i, a, c, n[h + 9], 21, -343485551), c = d(c, r), f = d(f, e), i = d(i, o), a = d(a, u); return [c, f, i, a] } function a(n) { for (var t = "", r = 32 * n.length, e = 0; e < r; e += 8)t += String.fromCharCode(n[e >> 5] >>> e % 32 & 255); return t } function h(n) { var t = []; for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1)t[e] = 0; for (var r = 8 * n.length, e = 0; e < r; e += 8)t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32; return t } function e(n) { for (var t, r = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1)t = n.charCodeAt(o), e += r.charAt(t >>> 4 & 15) + r.charAt(15 & t); return e } function r(n) { return unescape(encodeURIComponent(n)) } function o(n) { return a(i(h(t = r(n)), 8 * t.length)); var t } function u(n, t) { return function (n, t) { var r, e, o = h(n), u = [], c = []; for (u[15] = c[15] = void 0, 16 < o.length && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1)u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r]; return e = i(u.concat(h(t)), 512 + 8 * t.length), a(i(c.concat(e), 640)) }(r(n), r(t)) } function t(n, t, r) { return t ? r ? u(t, n) : e(u(t, n)) : r ? o(n) : e(o(n)) }
    return t(str)
  }


  /**
   * HTTP 请求接口
   * @param {string} url 请求的url
   * @param {bool} json 返回数据是否为 json，默认 true
   * @param {bool} useCache 是否采用离线缓存（请求失败后获取上一次结果），
   * @return {string | json | null}
   */
  async httpGet(url, headers = null, json = true, useCache = false) {
    let data = null
    const cacheKey = this.md5(url)
    if (useCache && Keychain.contains(cacheKey)) {
      let cache = Keychain.get(cacheKey)
      return json ? JSON.parse(cache) : cache
    }
    else {
      try {
        let req = new Request(url)
        if (headers != null && headers != undefined) {
          req.headers = headers
        }
        data = await (json ? req.loadJSON() : req.loadString())
        Keychain.set(cacheKey, json ? JSON.stringify(data) : data)
        return data
      } catch (e) {
        console.log(e)
        if (!data && Keychain.contains(cacheKey)) {
          // 判断是否有缓存
          let cache = Keychain.get(cacheKey)
          return json ? JSON.parse(cache) : cache
        }
      }
    }
  }

  async httpPost(url, headers, body, json = true, useCache = false) {
    // 根据URL进行md5生成cacheKey
    let cacheKey = this.md5(url)
    if (useCache && Keychain.contains(cacheKey)) {
      let cache = Keychain.get(cacheKey)
      return json ? JSON.parse(cache) : cache
    } else {
      let data = null
      try {
        let req = new Request(url)
        req.method = 'POST'
        if (headers != null && headers != undefined) {
          req.headers = headers
        }
        if (body != null && body != undefined) {
          req.body = body
        }
        data = await (json ? req.loadJSON() : req.loadString())
        Keychain.set(cacheKey, json ? JSON.stringify(data) : data)
        return data
      } catch (e) {
        console.log(e)
        if (Keychain.contains(cacheKey)) {
          let cache = Keychain.get(cacheKey)
          return json ? JSON.parse(cache) : cache
        }
      }
    }
  }

  /**
   * 获取远程图片内容
   * @param {string} url 图片地址
   * @param {bool} useCache 是否使用缓存（请求失败时获取本地缓存）
   */
  async getImageByUrl(url, headers = null, useCache = true) {
    const cacheKey = this.md5(url)
    const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey)
    // 判断是否有缓存
    if (useCache && FileManager.local().fileExists(cacheFile)) {
      return Image.fromFile(cacheFile)
    }
    try {
      const req = new Request(url)
      if (headers != null && headers != undefined) {
        req.headers = headers
      }
      const img = await req.loadImage()
      // 存储到缓存
      FileManager.local().writeImage(cacheFile, img)
      return img
    } catch (e) {
      console.log(e)
      if (FileManager.local().fileExists(cacheFile)) {
        return Image.fromFile(cacheFile)
      }
    }
  }

  /**
   * 渲染标题内容
   * @param {object} widget 组件对象
   * @param {string} icon 图标地址
   * @param {string} title 标题内容
   * @param {bool|color} color 字体的颜色（自定义背景时使用，默认系统）
   */
  async renderHeader(widget, icon, title, color = false) {
    widget.addSpacer(10)
    let header = widget.addStack()
    header.centerAlignContent()
    let _icon = header.addImage(await this.getImageByUrl(icon))
    _icon.imageSize = new Size(14, 14)
    _icon.cornerRadius = 4
    header.addSpacer(10)
    let _title = header.addText(title)
    if (color) _title.textColor = color
    _title.textOpacity = 0.7
    _title.font = Font.boldSystemFont(12)
    widget.addSpacer(10)
    return widget
  }

  /**
   * 获取截图中的组件剪裁图
   * 可用作透明背景
   * 返回图片image对象
   * 代码改自：https://gist.github.com/mzeryck/3a97ccd1e059b3afa3c6666d27a496c9
   * @param {string} title 开始处理前提示用户截图的信息，可选（适合用在组件自定义透明背景时提示）
   */
  async getWidgetScreenShot(title = null) {
    // Generate an alert with the provided array of options.
    async function generateAlert(message, options) {

      let alert = new Alert()
      alert.message = message

      for (const option of options) {
        alert.addAction(option)
      }

      let response = await alert.presentAlert()
      return response
    }

    // Crop an image into the specified rect.
    function cropImage(img, rect) {

      let draw = new DrawContext()
      draw.size = new Size(rect.width, rect.height)

      draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y))
      return draw.getImage()
    }

    async function blurImage(img, style) {
      const blur = 150
      const js = `
var mul_table=[512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];var shg_table=[9,11,12,13,13,14,14,15,15,15,15,16,16,16,16,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24];function stackBlurCanvasRGB(id,top_x,top_y,width,height,radius){if(isNaN(radius)||radius<1)return;radius|=0;var canvas=document.getElementById(id);var context=canvas.getContext("2d");var imageData;try{try{imageData=context.getImageData(top_x,top_y,width,height)}catch(e){try{netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");imageData=context.getImageData(top_x,top_y,width,height)}catch(e){alert("Cannot access local image");throw new Error("unable to access local image data: "+e);return}}}catch(e){alert("Cannot access image");throw new Error("unable to access image data: "+e);}var pixels=imageData.data;var x,y,i,p,yp,yi,yw,r_sum,g_sum,b_sum,r_out_sum,g_out_sum,b_out_sum,r_in_sum,g_in_sum,b_in_sum,pr,pg,pb,rbs;var div=radius+radius+1;var w4=width<<2;var widthMinus1=width-1;var heightMinus1=height-1;var radiusPlus1=radius+1;var sumFactor=radiusPlus1*(radiusPlus1+1)/2;var stackStart=new BlurStack();var stack=stackStart;for(i=1;i<div;i++){stack=stack.next=new BlurStack();if(i==radiusPlus1)var stackEnd=stack}stack.next=stackStart;var stackIn=null;var stackOut=null;yw=yi=0;var mul_sum=mul_table[radius];var shg_sum=shg_table[radius];for(y=0;y<height;y++){r_in_sum=g_in_sum=b_in_sum=r_sum=g_sum=b_sum=0;r_out_sum=radiusPlus1*(pr=pixels[yi]);g_out_sum=radiusPlus1*(pg=pixels[yi+1]);b_out_sum=radiusPlus1*(pb=pixels[yi+2]);r_sum+=sumFactor*pr;g_sum+=sumFactor*pg;b_sum+=sumFactor*pb;stack=stackStart;for(i=0;i<radiusPlus1;i++){stack.r=pr;stack.g=pg;stack.b=pb;stack=stack.next}for(i=1;i<radiusPlus1;i++){p=yi+((widthMinus1<i?widthMinus1:i)<<2);r_sum+=(stack.r=(pr=pixels[p]))*(rbs=radiusPlus1-i);g_sum+=(stack.g=(pg=pixels[p+1]))*rbs;b_sum+=(stack.b=(pb=pixels[p+2]))*rbs;r_in_sum+=pr;g_in_sum+=pg;b_in_sum+=pb;stack=stack.next}stackIn=stackStart;stackOut=stackEnd;for(x=0;x<width;x++){pixels[yi]=(r_sum*mul_sum)>>shg_sum;pixels[yi+1]=(g_sum*mul_sum)>>shg_sum;pixels[yi+2]=(b_sum*mul_sum)>>shg_sum;r_sum-=r_out_sum;g_sum-=g_out_sum;b_sum-=b_out_sum;r_out_sum-=stackIn.r;g_out_sum-=stackIn.g;b_out_sum-=stackIn.b;p=(yw+((p=x+radius+1)<widthMinus1?p:widthMinus1))<<2;r_in_sum+=(stackIn.r=pixels[p]);g_in_sum+=(stackIn.g=pixels[p+1]);b_in_sum+=(stackIn.b=pixels[p+2]);r_sum+=r_in_sum;g_sum+=g_in_sum;b_sum+=b_in_sum;stackIn=stackIn.next;r_out_sum+=(pr=stackOut.r);g_out_sum+=(pg=stackOut.g);b_out_sum+=(pb=stackOut.b);r_in_sum-=pr;g_in_sum-=pg;b_in_sum-=pb;stackOut=stackOut.next;yi+=4}yw+=width}for(x=0;x<width;x++){g_in_sum=b_in_sum=r_in_sum=g_sum=b_sum=r_sum=0;yi=x<<2;r_out_sum=radiusPlus1*(pr=pixels[yi]);g_out_sum=radiusPlus1*(pg=pixels[yi+1]);b_out_sum=radiusPlus1*(pb=pixels[yi+2]);r_sum+=sumFactor*pr;g_sum+=sumFactor*pg;b_sum+=sumFactor*pb;stack=stackStart;for(i=0;i<radiusPlus1;i++){stack.r=pr;stack.g=pg;stack.b=pb;stack=stack.next}yp=width;for(i=1;i<=radius;i++){yi=(yp+x)<<2;r_sum+=(stack.r=(pr=pixels[yi]))*(rbs=radiusPlus1-i);g_sum+=(stack.g=(pg=pixels[yi+1]))*rbs;b_sum+=(stack.b=(pb=pixels[yi+2]))*rbs;r_in_sum+=pr;g_in_sum+=pg;b_in_sum+=pb;stack=stack.next;if(i<heightMinus1){yp+=width}}yi=x;stackIn=stackStart;stackOut=stackEnd;for(y=0;y<height;y++){p=yi<<2;pixels[p]=(r_sum*mul_sum)>>shg_sum;pixels[p+1]=(g_sum*mul_sum)>>shg_sum;pixels[p+2]=(b_sum*mul_sum)>>shg_sum;r_sum-=r_out_sum;g_sum-=g_out_sum;b_sum-=b_out_sum;r_out_sum-=stackIn.r;g_out_sum-=stackIn.g;b_out_sum-=stackIn.b;p=(x+(((p=y+radiusPlus1)<heightMinus1?p:heightMinus1)*width))<<2;r_sum+=(r_in_sum+=(stackIn.r=pixels[p]));g_sum+=(g_in_sum+=(stackIn.g=pixels[p+1]));b_sum+=(b_in_sum+=(stackIn.b=pixels[p+2]));stackIn=stackIn.next;r_out_sum+=(pr=stackOut.r);g_out_sum+=(pg=stackOut.g);b_out_sum+=(pb=stackOut.b);r_in_sum-=pr;g_in_sum-=pg;b_in_sum-=pb;stackOut=stackOut.next;yi+=width}}context.putImageData(imageData,top_x,top_y)}function BlurStack(){this.r=0;this.g=0;this.b=0;this.a=0;this.next=null}
      // https://gist.github.com/mjackson/5311256
    
      function rgbToHsl(r, g, b){
          r /= 255, g /= 255, b /= 255;
          var max = Math.max(r, g, b), min = Math.min(r, g, b);
          var h, s, l = (max + min) / 2;
    
          if(max == min){
              h = s = 0; // achromatic
          }else{
              var d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              switch(max){
                  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                  case g: h = (b - r) / d + 2; break;
                  case b: h = (r - g) / d + 4; break;
              }
              h /= 6;
          }
    
          return [h, s, l];
      }
    
      function hslToRgb(h, s, l){
          var r, g, b;
    
          if(s == 0){
              r = g = b = l; // achromatic
          }else{
              var hue2rgb = function hue2rgb(p, q, t){
                  if(t < 0) t += 1;
                  if(t > 1) t -= 1;
                  if(t < 1/6) return p + (q - p) * 6 * t;
                  if(t < 1/2) return q;
                  if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                  return p;
              }
    
              var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
              var p = 2 * l - q;
              r = hue2rgb(p, q, h + 1/3);
              g = hue2rgb(p, q, h);
              b = hue2rgb(p, q, h - 1/3);
          }
    
          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }
      
      function lightBlur(hsl) {
      
        // Adjust the luminance.
        let lumCalc = 0.35 + (0.3 / hsl[2]);
        if (lumCalc < 1) { lumCalc = 1; }
        else if (lumCalc > 3.3) { lumCalc = 3.3; }
        const l = hsl[2] * lumCalc;
        
        // Adjust the saturation. 
        const colorful = 2 * hsl[1] * l;
        const s = hsl[1] * colorful * 1.5;
        
        return [hsl[0],s,l];
        
      }
      
      function darkBlur(hsl) {
    
        // Adjust the saturation. 
        const colorful = 2 * hsl[1] * hsl[2];
        const s = hsl[1] * (1 - hsl[2]) * 3;
        
        return [hsl[0],s,hsl[2]];
        
      }
    
      // Set up the canvas.
      const img = document.getElementById("blurImg");
      const canvas = document.getElementById("mainCanvas");
    
      const w = img.naturalWidth;
      const h = img.naturalHeight;
    
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      canvas.width = w;
      canvas.height = h;
    
      const context = canvas.getContext("2d");
      context.clearRect( 0, 0, w, h );
      context.drawImage( img, 0, 0 );
      
      // Get the image data from the context.
      var imageData = context.getImageData(0,0,w,h);
      var pix = imageData.data;
      
      var isDark = "${style}" == "dark";
      var imageFunc = isDark ? darkBlur : lightBlur;
    
      for (let i=0; i < pix.length; i+=4) {
    
        // Convert to HSL.
        let hsl = rgbToHsl(pix[i],pix[i+1],pix[i+2]);
        
        // Apply the image function.
        hsl = imageFunc(hsl);
      
        // Convert back to RGB.
        const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
      
        // Put the values back into the data.
        pix[i] = rgb[0];
        pix[i+1] = rgb[1];
        pix[i+2] = rgb[2];
    
      }
    
      // Draw over the old image.
      context.putImageData(imageData,0,0);
    
      // Blur the image.
      stackBlurCanvasRGB("mainCanvas", 0, 0, w, h, ${blur});
      
      // Perform the additional processing for dark images.
      if (isDark) {
      
        // Draw the hard light box over it.
        context.globalCompositeOperation = "hard-light";
        context.fillStyle = "rgba(55,55,55,0.2)";
        context.fillRect(0, 0, w, h);
    
        // Draw the soft light box over it.
        context.globalCompositeOperation = "soft-light";
        context.fillStyle = "rgba(55,55,55,1)";
        context.fillRect(0, 0, w, h);
    
        // Draw the regular box over it.
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(55,55,55,0.4)";
        context.fillRect(0, 0, w, h);
      
      // Otherwise process light images.
      } else {
        context.fillStyle = "rgba(255,255,255,0.4)";
        context.fillRect(0, 0, w, h);
      }
    
      // Return a base64 representation.
      canvas.toDataURL(); 
      `

      // Convert the images and create the HTML.
      let blurImgData = Data.fromPNG(img).toBase64String()
      let html = `
      <img id="blurImg" src="data:image/png;base64,${blurImgData}" />
      <canvas id="mainCanvas" />
      `

      // Make the web view and get its return value.
      let view = new WebView()
      await view.loadHTML(html)
      let returnValue = await view.evaluateJavaScript(js)

      // Remove the data type from the string and convert to data.
      let imageDataString = returnValue.slice(22)
      let imageData = Data.fromBase64String(imageDataString)

      // Convert to image and crop before returning.
      let imageFromData = Image.fromData(imageData)
      // return cropImage(imageFromData)
      return imageFromData
    }


    // Pixel sizes and positions for widgets on all supported phones.
    function phoneSizes() {
      let phones = {
        // 12 Pro Max
        "2778": {
          small: 510,
          medium: 1092,
          large: 1146,
          left: 96,
          right: 678,
          top: 246,
          middle: 882,
          bottom: 1518
        },

        // 12 and 12 Pro
        "2532": {
          small: 474,
          medium: 1014,
          large: 1062,
          left: 78,
          right: 618,
          top: 231,
          middle: 819,
          bottom: 1407
        },

        // 11 Pro Max, XS Max
        "2688": {
          small: 507,
          medium: 1080,
          large: 1137,
          left: 81,
          right: 654,
          top: 228,
          middle: 858,
          bottom: 1488
        },

        // 11, XR
        "1792": {
          small: 338,
          medium: 720,
          large: 758,
          left: 54,
          right: 436,
          top: 160,
          middle: 580,
          bottom: 1000
        },


        // 11 Pro, XS, X
        "2436": {
          small: 465,
          medium: 987,
          large: 1035,
          left: 69,
          right: 591,
          top: 213,
          middle: 783,
          bottom: 1353
        },

        // Plus phones
        "2208": {
          small: 471,
          medium: 1044,
          large: 1071,
          left: 99,
          right: 672,
          top: 114,
          middle: 696,
          bottom: 1278
        },

        // SE2 and 6/6S/7/8
        "1334": {
          small: 296,
          medium: 642,
          large: 648,
          left: 54,
          right: 400,
          top: 60,
          middle: 412,
          bottom: 764
        },


        // SE1
        "1136": {
          small: 282,
          medium: 584,
          large: 622,
          left: 30,
          right: 332,
          top: 59,
          middle: 399,
          bottom: 399
        },

        // 11 and XR in Display Zoom mode
        "1624": {
          small: 310,
          medium: 658,
          large: 690,
          left: 46,
          right: 394,
          top: 142,
          middle: 522,
          bottom: 902
        },

        // Plus in Display Zoom mode
        "2001": {
          small: 444,
          medium: 963,
          large: 972,
          left: 81,
          right: 600,
          top: 90,
          middle: 618,
          bottom: 1146
        }
      }
      return phones
    }

    var message
    message = title || "开始之前，请先前往桌面,截取空白界面的截图。然后回来继续"
    let exitOptions = ["我已截图", "前去截图 >"]
    let shouldExit = await generateAlert(message, exitOptions)
    if (shouldExit) return

    // Get screenshot and determine phone size.
    let img = await Photos.fromLibrary()
    let height = img.size.height
    let phone = phoneSizes()[height]
    if (!phone) {
      message = "好像您选择的照片不是正确的截图，或者您的机型我们暂时不支持。点击确定前往社区讨论"
      let _id = await generateAlert(message, ["帮助", "取消"])
      if (_id === 0) Safari.openInApp('https://support.qq.com/products/287371', false)
      return
    }

    // Prompt for widget size and position.
    message = "截图中要设置透明背景组件的尺寸类型是？"
    let sizes = ["小尺寸", "中尺寸", "大尺寸"]
    let size = await generateAlert(message, sizes)
    let widgetSize = sizes[size]

    message = "要设置透明背景的小组件在哪个位置？"
    message += (height == 1136 ? " （备注：当前设备只支持两行小组件，所以下边选项中的「中间」和「底部」的选项是一致的）" : "")

    // Determine image crop based on phone size.
    let crop = { w: "", h: "", x: "", y: "" }
    if (widgetSize == "小尺寸") {
      crop.w = phone.small
      crop.h = phone.small
      let positions = ["左上角", "右上角", "中间左", "中间右", "左下角", "右下角"]
      let _posotions = ["Top left", "Top right", "Middle left", "Middle right", "Bottom left", "Bottom right"]
      let position = await generateAlert(message, positions)

      // Convert the two words into two keys for the phone size dictionary.
      let keys = _posotions[position].toLowerCase().split(' ')
      crop.y = phone[keys[0]]
      crop.x = phone[keys[1]]

    } else if (widgetSize == "中尺寸") {
      crop.w = phone.medium
      crop.h = phone.small

      // Medium and large widgets have a fixed x-value.
      crop.x = phone.left
      let positions = ["顶部", "中间", "底部"]
      let _positions = ["Top", "Middle", "Bottom"]
      let position = await generateAlert(message, positions)
      let key = _positions[position].toLowerCase()
      crop.y = phone[key]

    } else if (widgetSize == "大尺寸") {
      crop.w = phone.medium
      crop.h = phone.large
      crop.x = phone.left
      let positions = ["顶部", "底部"]
      let position = await generateAlert(message, positions)

      // Large widgets at the bottom have the "middle" y-value.
      crop.y = position ? phone.middle : phone.top
    }

    // 透明/模糊选项
    message = "需要给背景图片加什么显示效果？"
    let blurOptions = ["透明", "白色 模糊", "黑色 模糊"]
    let blurred = await generateAlert(message, blurOptions)

    // Crop image and finalize the widget.
    if (blurred) {
      const style = (blurred === 1) ? 'light' : 'dark'
      img = await blurImage(img, style)
    }
    let imgCrop = cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h))


    return { img: imgCrop, size: widgetSize }

  }

  /**
   * 弹出一个通知
   * @param {string} title 通知标题
   * @param {string} body 通知内容
   * @param {string} url 点击后打开的URL
   */
  async notify(title, body, url, opts = {}) {
    let n = new Notification()
    n = Object.assign(n, opts);
    n.title = title
    n.body = body
    if (url) n.openURL = url
    return await n.schedule()
  }


  /**
   * 给图片加一层半透明遮罩
   * @param {Image} img 要处理的图片
   * @param {string} color 遮罩背景颜色
   * @param {float} opacity 透明度
   */
  async shadowImage(img, color = '#000000', opacity = 0.7) {
    let ctx = new DrawContext()
    // 获取图片的尺寸
    ctx.size = img.size

    ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
    ctx.setFillColor(new Color(color, opacity))
    ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))

    let res = await ctx.getImage()
    return res
  }

  /**
   * 获取当前插件的设置
   * @param {boolean} json 是否为json格式
   */
  getSettings(json = true) {
    let res = json ? {} : ""
    let cache = ""
    // if (global && Keychain.contains(this.SETTING_KEY2)) {
    //   cache = Keychain.get(this.SETTING_KEY2)
    // } else if (Keychain.contains(this.SETTING_KEY)) {
    //   cache = Keychain.get(this.SETTING_KEY)
    // } else if (Keychain.contains(this.SETTING_KEY1)) {
    //   cache = Keychain.get(this.SETTING_KEY1)
    // } else if (Keychain.contains(this.SETTING_KEY2)){
    if (Keychain.contains(this.SETTING_KEY)) {
      cache = Keychain.get(this.SETTING_KEY)
    }
    if (json) {
      try {
        res = JSON.parse(cache)
      } catch (e) { }
    } else {
      res = cache
    }

    return res
  }

  /**
   * 存储当前设置
   * @param {bool} notify 是否通知提示
   */
  saveSettings(notify = true) {
    let res = (typeof this.settings === "object") ? JSON.stringify(this.settings) : String(this.settings)
    Keychain.set(this.SETTING_KEY, res)
    if (notify) this.notify("设置成功", "桌面组件稍后将自动刷新")
  }

  /**
   * 获取当前插件是否有自定义背景图片
   * @reutrn img | false
   */
  getBackgroundImage(size) {
    // 如果有KEY则优先加载，key>key1>key2
    // key2是全局
    let result = null
    if (size == 'small' && this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY_SMALL)) {
      result = Image.fromFile(this.BACKGROUND_KEY_SMALL)
    } else if (size == 'medium' && this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY_MEDIUM)) {
      result = Image.fromFile(this.BACKGROUND_KEY_MEDIUM)
    } else if (size == 'large' && this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY_LARGE)){
      result = Image.fromFile(this.BACKGROUND_KEY_LARGE)
    }
    return result
  }

  /**
   * 设置当前组件的背景图片
   * @param {image} imgInfo 
   */
  setBackgroundImage(imgInfo, notify = true) {
    if (!imgInfo) {
      if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY_SMALL)) {
        this.FILE_MGR_LOCAL.remove(this.BACKGROUND_KEY_SMALL)
      }
      if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY_MEDIUM)) {
        this.FILE_MGR_LOCAL.remove(this.BACKGROUND_KEY_MEDIUM)
      }
      if (this.FILE_MGR_LOCAL.fileExists(this.BACKGROUND_KEY_LARGE)) {
        this.FILE_MGR_LOCAL.remove(this.BACKGROUND_KEY_LARGE)
      }
      if (notify) this.notify("移除成功", "小组件背景图片已移除，稍后刷新生效")
    } else {
      // 设置背景
      // 全部设置一遍，
      if (imgInfo.size == "小尺寸") {
        this.FILE_MGR_LOCAL.writeImage(this.BACKGROUND_KEY_SMALL, imgInfo.img)
      } else if (imgInfo.size == "中尺寸") {
        this.FILE_MGR_LOCAL.writeImage(this.BACKGROUND_KEY_MEDIUM, imgInfo.img)
      } else {
        this.FILE_MGR_LOCAL.writeImage(this.BACKGROUND_KEY_LARGE, imgInfo.img)
      }
      if (notify) this.notify("设置成功", "小组件背景图片已设置！稍后刷新生效")
    }
  }
  /**
     * 获取SFSymbol
     * @param {string}} name 名
     * @param {number} size 尺寸
     */
  getSFSymbol(name, size = null) {
    const sf = SFSymbol.named(name)
    if (sf != null) {
      if (size != undefined && size != null) {
        sf.applyFont(Font.systemFont(size))
      }
      return sf.image
    } else {
      return undefined
    }
  }
}
// @base.end
// 运行环境
// @running.start
const Running = async (Widget, default_args = "") => {
  let M = null
  // 判断hash是否和当前设备匹配
  if (config.runsInWidget) {
    M = new Widget(args.widgetParameter || '')
    const W = await M.render()
    Script.setWidget(W)
    Script.complete()
  } else {
    let { act, data, __arg, __size } = args.queryParameters
    M = new Widget(__arg || default_args || '')
    if (__size) M.init(__size)
    if (!act || !M['_actions']) {
      // 弹出选择菜单
      const actions = M['_actions']
      const _actions = []
      const alert = new Alert()
      alert.title = M.name
      alert.message = M.desc

      for (let _ in actions) {
        alert.addAction(_)
        _actions.push(actions[_])
      }
      alert.addCancelAction("取消操作")
      const idx = await alert.presentSheet()
      if (_actions[idx]) {
        const func = _actions[idx]
        await func()
      }
      return
    }
    let _tmp = act.split('-').map(_ => _[0].toUpperCase() + _.substr(1)).join('')
    let _act = `action${_tmp}`
    if (M[_act] && typeof M[_act] === 'function') {
      const func = M[_act].bind(M)
      await func(data)
    }
  }
}



let DEPENDENCIES = [
    'jsencrypt.js' //本地化加密
];


let BMW_SERVER_HOST = 'https://myprofile.bmw.com.cn';
let JS_CDN_SERVER = 'https://cdn.jsdelivr.net/gh/opp100/bmw-scriptable-widgets/lib';

let DEFAULT_BG_COLOR_LIGHT = '#cc3399';
let DEFAULT_BG_COLOR_DARK = '#0099ff';
let DEFAULT_COLOR_FONT = '#FFFFFF';
let DEFAULT_LOGO_LIGHT = 'https://z3.ax1x.com/2021/11/16/IRfMQO.png';
let DEFAULT_FG_COLOR = '#111111';
let DEFAULT_FG_COLOR_OPTICAL = '0.15';
let MAPAPIKEY = '1b96b24cade3b58737ef6b5e142cb8c3';
let WEATHERKEY = '6LBqE0F459FuHgIq'
// header is might be used for preventing the bmw block the external api?
let BMW_HEADERS = {
    'user-agent': 'Dart/2.10 (dart:io)',
    'x-user-agent': 'ios(15.0.2);bmw;1.6.6(10038)'
};

// setup local storage keys
let MY_BMW_REFRESH_TOKEN = 'MY_BMW_REFRESH_TOKEN';
let MY_BMW_TOKEN = 'MY_BMW_TOKEN';
let MY_BMW_TOKEN_UPDATE_LAST_AT = 'MY_BMW_TOKEN_UPDATE_LAST_AT';
let MY_BMW_LAST_CHECK_IN_AT = 'MY_BMW_LAST_CHECK_IN_AT';
let APP_USE_AGREEMENT = 'APP_USE_AGREEMENT';
let MY_BMW_VEHICLE_UPDATE_LAST_AT = 'MY_BMW_VEHICLE_UPDATE_LAST_AT';
let MY_BMW_VEHICLE_DATA = 'MY_BMW_VEHICLE_DATA';
let REMAIL_OIL_KM = 90;

let BACK_COLOR = new Color('#ffffff', 0.1);
let LOGO_SIZE = 18;

let CORRER_RADIUS = 10;
let FONNT_SIZE = 14
let DISTANCE = 1000
class Widget extends Base {

    //#region 组件

    //#region 组件加载
    async render() {
        // check all dependencies
        await this.getDependencies();

        await this.renderError('载入中...');
        if (this.userConfigData.username == '') {
            console.error('尚未配置用户');
            return await this.renderError('请先配置用户');
        }
        let screenSize = Device.screenSize();
        let data = await this.getData();

        if (data == null) {
            console.log('获取车辆信息失败，请检查授权')
        }
        else {
            try {
                data.size = this.DeviceSize[`${screenSize.width}x${screenSize.height}`] || this.DeviceSize['375x812'];
                console.log(screenSize)
            } catch (e) {
                console.warn('Display Error: ' + e.message);
                await this.renderError('显示错误：' + e.message);
            }
            let w = new ListWidget();
            let img
            switch (this.widgetFamily) {
                case 'large':
                    w = await this.renderLarge(data);
                    img = this.getBackgroundImage('large');
                    break;
                case 'medium':
                    w = await this.renderMedium(data);
                    img = this.getBackgroundImage('medium');
                    break;
                default:
                    w = await this.renderSmall(data);
                    img = this.getBackgroundImage('small');
                    break;
            }
            if (img) {
                w.backgroundImage = img
            }
            else if (this.userConfigData.bgImageMid) {
                let bgImageUrl = this.userConfigData.bgImageMid;
                const image = await this.getImageByUrl(bgImageUrl)
                w.backgroundImage = image
            }
            else {
                w.backgroundGradient = this.getBackgroundColor()
            }
            return w;
        }
    }
    //#endregion

    //#region  小组件
    async renderSmall(data) {
        let w = new ListWidget();
        const padding = 8
        const { width, height } = data.size['small'];
        const box = w.addStack()
        box.size = new Size(width, height)
        box.setPadding(padding, padding, padding, padding)
        box.layoutVertically()
        const fontColor = this.getFontColor()
        const headBox = box.addStack()
        headBox.layoutHorizontally()

        const {
            rangeValue,
            rangeUnits,
        } = data.status.fuelIndicators[0]

        //油位
        const rangeBox = headBox.addStack()
        rangeBox.bottomAlignContent()
        rangeBox.setPadding(0, 2, 0, 0)
        //百分比
        let fuelPercentage = this.getOilPercent(data)
        const oilPercentTxt = rangeBox.addText(`${fuelPercentage}`)
        oilPercentTxt.font = this.provideFont('bold', 24)
        oilPercentTxt.textColor = fontColor
        oilPercentTxt.minimumScaleFactor = 0.8
        oilPercentTxt.lineLimit = 1
        this.addFontShadow(oilPercentTxt)
        //%
        const percentageBox = rangeBox.addStack();
        percentageBox.setPadding(0, 0, 3, 0)
        const percentageText = percentageBox.addText(' %  /  ')
        percentageText.font = this.provideFont('regular', 13)
        percentageText.textColor = fontColor
        percentageText.lineLimit = 1
        this.addFontShadow(percentageText)
        //续航里程
        const rangeValueText = rangeBox.addText(rangeValue)
        rangeValueText.font = this.provideFont('bold', 24)
        rangeValueText.textColor = fontColor
        rangeValueText.minimumScaleFactor = 0.8
        rangeValueText.lineLimit = 1
        this.addFontShadow(rangeValueText)
        //km
        const rangeUnitsBox = rangeBox.addStack();
        rangeUnitsBox.setPadding(0, 0, 3, 0)
        const rangeUnitsText = rangeUnitsBox.addText(' ' + rangeUnits)
        rangeUnitsText.font = this.provideFont('regular', 13)
        rangeUnitsText.textColor = fontColor
        rangeUnitsText.lineLimit = 1
        this.addFontShadow(rangeUnitsText)

        //车型图片  
        box.addSpacer(2)
        let imageCar = await this.getCarCanvasImage(data, width - padding * 2, (height - padding * 2) * 0.6);
        box.addImage(imageCar)

        //车型名称
        box.addSpacer(2)
        let carName = `${data.brand} ${data.bodyType} ${data.model}`
        if (this.userConfigData.custom_name.length > 0) {
            carName = this.userConfigData.custom_name
        }
        const carNameBox = box.addStack()
        carNameBox.addSpacer(null)
        const carNameText = carNameBox.addText(carName)
        carNameBox.addSpacer(null)
        carNameText.font = this.provideFont('black', 20)
        carNameText.textColor = fontColor
        carNameText.minimumScaleFactor = 0.5
        carNameText.lineLimit = 1
        this.addFontShadow(carNameText)
        w.url = 'de.bmw.connected.mobile20.cn.Share-Ext.Destination://'
        return w;
    }
    //#endregion

    //#region  中组件-信息
    async renderMedium(data) {
        const padding = 8
        let w = new ListWidget()
        const { width, height } = data.size['medium'];
        w.setPadding(padding, padding, padding, padding)
        let fontColor = this.getFontColor()
        let mainBox = w.addStack()
        switch (this.settings['TypeConfig']) {
            case 1:
                mainBox = await this.getMapBox(mainBox, data, width, height, padding, fontColor)
                break
            default:
                mainBox = await this.getCarInfo(mainBox, data, width, height, padding, fontColor)
        }
        return w;
    }

    async getCarInfo(box, data, width, height, padding, fontColor, isLarge = false) {
        const {
            rangeValue,
            rangeUnits,
        } = data.status.fuelIndicators[0]
        box.layoutHorizontally()
        const boxWidth = width / 2 - padding * 1.5
        const boxHeight = height - padding * 2
        console.log(boxWidth + ',' + boxHeight)
        const leftBox = box.addStack()
        leftBox.size = new Size(boxWidth, boxHeight)
        leftBox.layoutVertically()
        box.addSpacer(padding)
        const rightBox = box.addStack()
        rightBox.size = new Size(boxWidth, boxHeight)
        rightBox.layoutVertically()

        leftBox.setPadding(6,6,2,2)
        leftBox.cornerRadius = CORRER_RADIUS
        leftBox.backgroundColor = new Color('#ffffff', 0.0);
        leftBox.layoutVertically()
        //logo
        const headBox = leftBox.addStack()
        headBox.layoutHorizontally()
        headBox.centerAlignContent()
        const logoBox = headBox.addStack()
        logoBox.size = new Size(LOGO_SIZE * 2.5, LOGO_SIZE)
        let logoImage = logoBox.addImage(await this.getAppLogo())
        if (!this.userConfigData.custom_logo_image) {
            logoImage.tintColor = this.getFontColor()
        }
        logoBox.centerAlignContent()
        logoBox.addSpacer(null)
        headBox.addSpacer(null)

        //更新时间
        const updateTxt1 = headBox.addText(this.formatDate(data))
        updateTxt1.font = this.provideFont('medium', FONNT_SIZE)
        updateTxt1.textColor = fontColor
        this.addFontShadow(updateTxt1)
        const updateTxt2 = headBox.addText(' 更新')
        headBox.addSpacer(4)
        updateTxt2.font = this.provideFont('medium', FONNT_SIZE - 2)
        updateTxt2.textColor = fontColor
        this.addFontShadow(updateTxt2)
        //车型图片  
        if (isLarge) {
            leftBox.addSpacer(null)
        }
        else {
            leftBox.addSpacer(4)
        }
        //let imageCar = await this.getVehicleImage(data);
        let imageCar = await this.getCarCanvasImage(data, boxWidth - padding, boxHeight * 0.62);
        let carImageBox = leftBox.addStack()
        carImageBox.size = new Size(boxWidth - padding, 0)
        let carImage = carImageBox.addImage(imageCar)
        if (isLarge) {
            leftBox.addSpacer(null)
        }
        else {
            leftBox.addSpacer(4)
        }
        //车型名称
        let carName = `${data.brand} ${data.bodyType} ${data.model}`
        if (this.userConfigData.custom_name.length > 0) {
            carName = this.userConfigData.custom_name
        }
        const carNameBox = leftBox.addStack()
        carNameBox.addSpacer(null)
        const carNameText = carNameBox.addText(carName)
        carNameBox.addSpacer(null)
        carNameText.font = this.provideFont('bold', 22)
        carNameText.textColor = fontColor
        carNameText.minimumScaleFactor = 0.5
        carNameText.lineLimit = 1
        this.addFontShadow(carNameText)
        //右边
        const carInfoBox = rightBox.addStack()
        carInfoBox.setPadding(6,6, 0, 6)
        carInfoBox.cornerRadius = CORRER_RADIUS
        carInfoBox.backgroundColor = BACK_COLOR
        carInfoBox.layoutVertically()
        //剩余燃油
        const oilBox = carInfoBox.addStack()
        oilBox.layoutVertically()
        const oilInfoBox = oilBox.addStack()
        oilInfoBox.centerAlignContent()
        const oilIconBox = oilInfoBox.addStack()
        oilIconBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        oilIconBox.setPadding(1,1,1,1)
        const oilIcon = oilIconBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPHyLt.png'))
        oilInfoBox.addSpacer(2)
        let fuelPercentage = this.getOilPercent(data)
        const oilPercentTxt = oilInfoBox.addText(`${fuelPercentage}%`)
        oilPercentTxt.font = this.provideFont('medium', FONNT_SIZE)
        this.addFontShadow(oilPercentTxt)
        oilInfoBox.addSpacer(null)
        if (rangeValue <= REMAIL_OIL_KM) {
            oilIcon.tintColor = new Color('#ff0000', 1)
            oilPercentTxt.textColor = new Color('#ff0000', 1)
        }
        else {
            oilIcon.tintColor = fontColor
            oilPercentTxt.textColor = fontColor
        }

        //车门信息
        const doorIcon = await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPb71H.png')
        const doorBox = oilInfoBox.addStack()
        doorBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        if (!data.properties.areDoorsClosed) {
            doorBox.addImage(doorIcon).tintColor = Color.red()
        }
        //车窗信息
        oilInfoBox.addSpacer(null)
        const windowIcon = await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPbT9e.png')
        const windowBox = oilInfoBox.addStack()
        windowBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        if (!data.properties.areWindowsClosed) {
            windowBox.addImage(windowIcon).tintColor = Color.red()
        }
        //锁车信息
        oilInfoBox.addSpacer(null)
        const clockBox = oilInfoBox.addStack()
        clockBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        let clockImage;
        if (data.properties.areDoorsLocked) {
            clockImage = clockBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/21/IjAhwT.png'))
            clockImage.tintColor = fontColor
        }
        else {
            clockImage = clockBox.addImage(await this.getImageByUrl('https://s1.ax1x.com/2021/12/09/o4aHqU.png'))
            clockImage.tintColor = Color.red()
        }

        //进度条
        oilBox.addSpacer(8)
        const processBarBox = oilBox.addStack()
        const allLength = boxWidth - 12
        processBarBox.size = new Size(allLength, 10)
        const remainOilProcessBox = processBarBox.addStack()
        remainOilProcessBox.backgroundColor = fontColor
        remainOilProcessBox.size = new Size(allLength * (fuelPercentage / 100), 10)
        processBarBox.addSpacer(allLength * (1 - fuelPercentage / 100))
        remainOilProcessBox.cornerRadius = 4
        processBarBox.backgroundColor = new Color('#111111', 0.2)
        processBarBox.cornerRadius = 4
        carInfoBox.addSpacer(null)

        //剩余里程
        const rangeBox = carInfoBox.addStack()
        rangeBox.layoutHorizontally()
        rangeBox.bottomAlignContent()
        const rangeIconBox = rangeBox.addStack();
        rangeIconBox.centerAlignContent()
        rangeIconBox.size = new Size(22, 27)
        rangeIconBox.setPadding(0, 0, 5, 0)
        const rangeIcon = rangeIconBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/02/IPbt6s.png'))
        rangeIcon.size = new Size(LOGO_SIZE, LOGO_SIZE)
        rangeIcon.tintColor = fontColor
        rangeBox.addSpacer(null)
        const rangeValueBox = rangeBox.addStack();
        const rangeValueTxt = rangeValueBox.addText(rangeValue)
        rangeValueTxt.font = this.provideFont('black', 50)
        rangeValueTxt.textColor = fontColor
        rangeValueTxt.minimumScaleFactor = 0.7
        this.addFontShadow(rangeValueTxt)
        rangeBox.addSpacer(4)
        const rangeUnitsBox = rangeBox.addStack();
        rangeUnitsBox.setPadding(0, 0, 5, 0)
        const rangeUnitsTxt = rangeUnitsBox.addText(rangeUnits)
        rangeUnitsTxt.font = this.provideFont('bold', FONNT_SIZE)
        rangeUnitsTxt.textColor = fontColor
        rangeUnitsTxt.minimumScaleFactor = 0.8
        this.addFontShadow(rangeUnitsTxt)
        rangeBox.addSpacer(null)
        rightBox.addSpacer(padding)

        //总里程
        const otherInfoBox = rightBox.addStack()
        otherInfoBox.setPadding(padding, padding / 2, padding, padding / 2)
        otherInfoBox.cornerRadius = CORRER_RADIUS
        otherInfoBox.backgroundColor = BACK_COLOR
        otherInfoBox.addSpacer(null)
        const allMileageTxt = otherInfoBox.addText(`总里程：${data.status.currentMileage.mileage} ${data.status.currentMileage.units}`)
        allMileageTxt.font = this.provideFont('medium', FONNT_SIZE)
        allMileageTxt.textColor = fontColor
        this.addFontShadow(allMileageTxt)
        otherInfoBox.addSpacer(null)
        allMileageTxt.minimumScaleFactor = 0.8
        allMileageTxt.lineLimit = 1
        //跳转my bmw
        box.url = 'de.bmw.connected.mobile20.cn.Share-Ext.Destination://'
        return box;
    }
    //#endregion

    //#region 中组件-地图
    async getMapBox(box, data, width, height, padding, fontColor) {
        box.layoutHorizontally()
        const boxWidth = width / 2 - padding * 1.5
        const boxHeight = height - padding * 2
        const leftBox = box.addStack()
        box.addSpacer(padding)
        //左边窗口
        leftBox.size = new Size(boxWidth, boxHeight)
        //右边窗口
        const rightBox = box.addStack()
        rightBox.size = new Size(boxWidth, boxHeight)
        rightBox.f
        rightBox.layoutVertically()
        let {
            longitude,
            latitude
        } = data.properties.vehicleLocation.coordinates

        //加载地图
        let mapImage = await this.loadMapView(`${longitude},${latitude}`, boxWidth, boxHeight);
        mapImage.opacity = 0.5
        leftBox.cornerRadius = CORRER_RADIUS
        leftBox.backgroundColor = BACK_COLOR
        leftBox.backgroundImage = mapImage
        leftBox.url = 'caiyunappfree://'
        let weatherData = null;
        //获取天气
        if (WEATHERKEY) {

            const mapBackgroundColor = new Color('#FAF7F0', 0.8)
            const mapFontColor = new Color('#ABAAA9', 1)
            weatherData = await this.getWeather(longitude, latitude)
            let mapBox = leftBox.addStack()
            mapBox.layoutVertically()

            //添加天气信息
            const leftHeadBox = mapBox.addStack();
            const weatherBox = leftHeadBox.addStack();
            weatherBox.layoutVertically()
            weatherBox.setPadding(0, 4, 0, 4)
            weatherBox.size = new Size(40, 0)
            //天气图标      
            const weatherIncoBox = weatherBox.addStack()
            weatherIncoBox.setPadding(4, 5, 0, 5)
            const weatherInco = weatherIncoBox.addImage(await this.getSFSymbol(this.WeatherIcos[weatherData.weatherIco]))
            weatherBox.addSpacer(2)
            //最低温，最高温
            const temperatureBox = weatherBox.addStack()
            temperatureBox.backgroundColor = mapBackgroundColor
            temperatureBox.cornerRadius = 5
            const temperatureText = temperatureBox.addText(`${weatherData.minTemperature}~${weatherData.maxTemperature}`)
            //const temperatureText = temperatureBox.addText(`-88~-88`)
            temperatureText.font = this.provideFont('regular', 12)
            temperatureText.textColor = mapFontColor
            temperatureText.minimumScaleFactor = 0.5
            temperatureText.lineLimit = 1
            //预警或者天气描述
            mapBox.addSpacer(null)
            const bottomBox = mapBox.addStack();
            bottomBox.backgroundColor = mapBackgroundColor
            bottomBox.setPadding(3, 2, 0, 2)
            bottomBox.size = new Size(boxWidth, 16)
            let alertIfno = weatherData.weatherDesc
            if (weatherData.alertWeatherTitle) {
                alertIfno = weatherData.alertWeatherTitle
            }
            const alertIfnoText = bottomBox.addText(alertIfno)
            alertIfnoText.font = this.provideFont('bold', 12)
            alertIfnoText.textColor = mapFontColor
            alertIfnoText.minimumScaleFactor = 0.6
        }

        //车辆位置
        const addressInfoBox = rightBox.addStack()
        addressInfoBox.layoutVertically()
        addressInfoBox.setPadding(6,6,6,6)
        addressInfoBox.backgroundColor = BACK_COLOR
        addressInfoBox.cornerRadius = CORRER_RADIUS
        addressInfoBox.url = this.buildMapURL(longitude, latitude, data.properties.vehicleLocation.address.formatted)
        //图标
        const locationBox = addressInfoBox.addStack()
        locationBox.size = new Size(boxWidth - 12, LOGO_SIZE)
        const locationIconBox = locationBox.addStack()
        const locationIcon = locationIconBox.addImage(await this.getImageByUrl('https://z3.ax1x.com/2021/11/21/IjA8Fe.png'))
        locationIconBox.addSpacer(6)
        locationIcon.tintColor = fontColor
        locationIcon.size = new Size(LOGO_SIZE, LOGO_SIZE)
        const locationText = locationBox.addText(`定位`)
        locationText.font = this.provideFont('heavy', FONNT_SIZE)
        locationText.textColor = fontColor
        this.addFontShadow(locationText)
        locationBox.addSpacer(null)
        locationBox.centerAlignContent()
        if (weatherData) {
            const temperatureText = locationBox.addText(`${weatherData.temperature}℃`)
            temperatureText.font = this.provideFont('medium', 12)
            temperatureText.textColor = fontColor
            this.addFontShadow(temperatureText)
        }
        //位置文本
        addressInfoBox.addSpacer(6)
        let addressStr = data.properties.vehicleLocation.address.formatted.replace(/.+?(省|市|自治区|自治州)/g, '')
        const addressBoxTxt = addressInfoBox.addText(addressStr)
        addressBoxTxt.font = this.provideFont('medium', 12)
        addressBoxTxt.textColor = fontColor
        addressBoxTxt.lineLimit = 2
        this.addFontShadow(addressBoxTxt)

        //导航计算
        let plate = data.licensePlate
        let distance = 0
        let duration = 0
        let text = '回家'
        let url = ''

        let distanceHome = 0
        let durationHome = 0
        let distanceCompany = 0
        let durationCompany = 0
        const lonHmoe = this.addressConfigData.home.split(',')[0]
        const latHome = this.addressConfigData.home.split(',')[1]
        const lonCompany = this.addressConfigData.company.split(',')[0]
        const latCompany = this.addressConfigData.company.split(',')[1]

        //获取路径规划数据
        if (this.addressConfigData.home) {
            let pathData = await this.getPath(longitude, latitude, lonHmoe, latHome, plate)
            distanceHome = pathData.route.paths[0].distance
            durationHome = pathData.route.paths[0].cost.duration
        }
        if (this.addressConfigData.company) {
            let pathData = await this.getPath(longitude, latitude, lonCompany, latCompany, plate)
            distanceCompany = pathData.route.paths[0].distance
            durationCompany = pathData.route.paths[0].cost.duration
        }
        if (distanceHome < DISTANCE) {
            //在家一公里附近
            if (distanceCompany > DISTANCE) {
                text = '去公司'
                url = this.buildMapURL(lonCompany, latCompany, text)
                if (this.addressConfigData.companywaypoints) {
                    console.log('在家一公里附近,距离公司超过一公里，有配置去公司的途经点')
                    let pathData = await this.getPath(longitude, latitude, lonCompany, latCompany, plate, this.addressConfigData.companywaypoints)
                    distance = pathData.route.paths[0].distance
                    duration = pathData.route.paths[0].cost.duration
                }
                else {
                    console.log('在家一公里附近,距离公司超过一公里，未配置去公司的途经点')
                    distance = distanceCompany
                    duration = durationCompany
                }
            } else {
                console.log('在家一公里附近, 回家不经过途经点')
                text = '回家'
                url = this.buildMapURL(lonHmoe, latHome, text)
                distance = distanceHome
                duration = durationHome
            }
        }
        else {
            url = this.buildMapURL(lonHmoe, latHome, text)
            text = '回家'
            if (distanceCompany < DISTANCE && this.addressConfigData.homewaypoints) {
                console.log('离开家一公里,与公司距离小于一公里，有配置回家的途经点')
                let pathData = await this.getPath(longitude, latitude, lonHmoe, latHome, plate, this.addressConfigData.homewaypoints)
                distance = pathData.route.paths[0].distance
                duration = pathData.route.paths[0].cost.duration
            }
            else {
                console.log('离开家一公里,与公司距离大于一公里，回家且不经过途经点')
                distance = distanceHome
                duration = durationHome
            }
        }

        //填充导航数据
        rightBox.addSpacer(padding)
        const pathBox = rightBox.addStack()
        pathBox.url = url;
        pathBox.Size = new Size(0, boxHeight / 2 - padding / 2)
        pathBox.layoutVertically()
        pathBox.setPadding(6,6,6,6)
        pathBox.backgroundColor = BACK_COLOR
        pathBox.cornerRadius = CORRER_RADIUS

        const titleBox = pathBox.addStack()
        titleBox.layoutHorizontally()
        titleBox.size = new Size(boxWidth - 12, LOGO_SIZE)
        //图标
        const iconBox = titleBox.addStack()
        iconBox.size = new Size(LOGO_SIZE, LOGO_SIZE)
        const carIcon = iconBox.addImage(await this.getImageByUrl(`https://z3.ax1x.com/2021/11/21/IjAkoF.png`))
        carIcon.tintColor = fontColor

        //地址
        titleBox.addSpacer(6)
        const textText = titleBox.addText(text)
        textText.font = this.provideFont('heavy', FONNT_SIZE)
        textText.textColor = fontColor
        this.addFontShadow(textText)
        titleBox.addSpacer(null)
        //预计用时
        const durationBox = titleBox.addStack()
        let min = parseInt((duration / 60).toString())
        let timeStr
        if (min >= 60) {
            const hour = parseInt((min / 60).toString())
            min = min % 60
            timeStr = `${hour}h`
            if (min > 0) {
                timeStr += ` ${min}min`
            }
        }
        else {
            timeStr = `${parseInt((duration / 60).toString())} min`
        }
        const durationText = durationBox.addText(timeStr)
        durationText.font = this.provideFont('medium', 12)
        durationText.textColor = fontColor
        durationText.minimumScaleFactor = 0.8
        this.addFontShadow(durationText)
        titleBox.centerAlignContent()
        //下部内容
        const bottomBox = pathBox.addStack();
        bottomBox.layoutHorizontally()
        const messageBox = bottomBox.addStack();
        messageBox.layoutVertically()


        //距离
        messageBox.addSpacer(null)
        const distanceBox = messageBox.addStack()
        distanceBox.addSpacer(2)
        const distanceIconBox = distanceBox.addStack()
        distanceIconBox.size = new Size(FONNT_SIZE, FONNT_SIZE)
        distanceIconBox.setPadding(0, 0, 1, 0)
        const distanceImage = distanceIconBox.addImage(await this.getImageByUrl(`https://z3.ax1x.com/2021/11/21/IjesH0.png`))
        distanceImage.tintColor = fontColor
        distanceBox.addSpacer(padding / 2 + 2)
        const distanceText1 = distanceBox.addText(`路线距离`)
        distanceText1.font = this.provideFont('medium', 12)
        distanceText1.textColor = fontColor
        this.addFontShadow(distanceText1)
        distanceBox.addSpacer(null)
        const distanceText2 = distanceBox.addText(`${(distance / 1000).toFixed(1)} km`)
        distanceText2.font = this.provideFont('medium', 12)
        distanceText2.textColor = fontColor
        this.addFontShadow(distanceText2)
        //更新时间
        messageBox.addSpacer(2)
        const updateBox = messageBox.addStack()
        updateBox.addSpacer(2)
        const updateIconBox = updateBox.addStack()
        updateIconBox.size = new Size(FONNT_SIZE, FONNT_SIZE)
        updateIconBox.setPadding(1, 0, 0, 0)
        const updateImage = updateIconBox.addImage(await this.getImageByUrl(`https://z3.ax1x.com/2021/11/27/omF4Bt.png`))
        updateImage.tintColor = fontColor
        updateBox.addSpacer(padding / 2 + 2)
        const updateText1 = updateBox.addText(`更新时间`)
        updateText1.font = this.provideFont('medium', 12)
        updateText1.textColor = fontColor
        this.addFontShadow(updateText1)
        updateBox.addSpacer(null)
        const updateText2 = updateBox.addText(this.formatDate())
        updateText2.font = this.provideFont('medium', 12)
        updateText2.textColor = fontColor
        this.addFontShadow(updateText2)
        return box
    }
    //#endregion

    //#region  大组件

    async renderLarge(data) {
        let w = new ListWidget()
        const padding = 8
        const { width, height } = data.size['large'];
        let fontColor = this.getFontColor()
        //上部
        let topBox = w.addStack()
        topBox.setPadding(padding * 2, padding, padding, padding)
        topBox = await this.getCarInfo(topBox, data, width, height / 2 - padding * 1.5, padding, fontColor, true);
        //下部
        let bottomBox = w.addStack()
        bottomBox.setPadding(padding, padding, padding * 2, padding)
        bottomBox = await this.getMapBox(bottomBox, data, width, height / 2 - padding * 1.5, padding, fontColor)
        return w;
    }
    //#endregion

    //#endregion



    WeatherIcos = {
        CLEAR_DAY: 'sun.max.fill', // 晴（白天） CLEAR_DAY 
        CLEAR_NIGHT: 'moon.stars.fill', // 晴（夜间） CLEAR_NIGHT 
        PARTLY_CLOUDY_DAY: 'cloud.sun.fill', // 多云（白天）  PARTLY_CLOUDY_DAY 
        PARTLY_CLOUDY_NIGHT: 'cloud.moon.fill', // 多云（夜间）  PARTLY_CLOUDY_NIGHT 
        CLOUDY: 'cloud.fill', // 阴（白天）  CLOUDY 
        CLOUDY_NIGHT: 'cloud.fill', // 阴（夜间）  CLOUDY 
        LIGHT_HAZE: 'sun.haze.fill', // 轻度雾霾   LIGHT_HAZE 
        LIGHT_HAZE_NIGHT: 'sun.haze.fill', // 轻度雾霾   LIGHT_HAZE 
        MODERATE_HAZE: 'sun.haze.fill', // 中度雾霾  MODERATE_HAZE 
        MODERATE_HAZE_NIGHT: 'sun.haze.fill', // 中度雾霾  MODERATE_HAZE 
        HEAVY_HAZE: 'sun.haze.fill', // 重度雾霾   HEAVY_HAZE 
        HEAVY_HAZE_NIGHT: 'sun.haze.fill', // 重度雾霾   HEAVY_HAZE 
        LIGHT_RAIN: 'cloud.drizzle.fill', // 小雨 LIGHT_RAIN 
        MODERATE_RAIN: 'cloud.drizzle.fill', // 中雨 MODERATE_RAIN 
        HEAVY_RAIN: 'cloud.rain.fill', // 大雨  HEAVY_RAIN 
        STORM_RAIN: 'cloud.heavyrain.fill', // 暴雨 STORM_RAIN 
        FOG: 'cloud.fog.fill', // 雾 FOG 
        LIGHT_SNOW: 'cloud.snow.fill', // 小雪  LIGHT_SNOW 
        MODERATE_SNOW: 'cloud.snow.fill', // 中雪 MODERATE_SNOW 
        HEAVY_SNOW: 'cloud.snow.fill', // 大雪  HEAVY_SNOW 
        STORM_SNOW: 'cloud.snow.fill', // 暴雪 STORM_SNOW 
        DUST: 'sun.dust.fill', // 浮尘  DUST 
        SAND: 'smoke.fill', // 沙尘  SAND 
        WIND: 'wind', // 大风  WIND 
    }


    DeviceSize = {
        '428x926': {
            small: { width: 176, height: 176 },
            medium: { width: 374, height: 176 },
            large: { width: 374, height: 391 }
        },
        '390x844': {
            small: { width: 161, height: 161 },
            medium: { width: 342, height: 161 },
            large: { width: 342, height: 359 }
        },
        '414x896': {
            small: { width: 169, height: 169 },
            medium: { width: 360, height: 169 },
            large: { width: 360, height: 376 }
        },
        '375x812': {
            small: { width: 155, height: 155 },
            medium: { width: 329, height: 155 },
            large: { width: 329, height: 345 }
        },
        '414x736': {
            small: { width: 159, height: 159 },
            medium: { width: 348, height: 159 },
            large: { width: 348, height: 357 }
        },
        '375x667': {
            small: { width: 148, height: 148 },
            medium: { width: 322, height: 148 },
            large: { width: 322, height: 324 }
        },
        '320x568': {
            small: { width: 141, height: 141 },
            medium: { width: 291, height: 141 },
            large: { width: 291, height: 299 }
        }
    };

    userConfigData = {
        custom_name: '',
        custom_vehicle_image: null,
        custom_logo_image: null,
        vin: '',
        oilTotal: '',
        bgImageMid: '',
    };

    addressConfigData = {
        home: '',
        homewaypoints: '',
        company: '',
        companywaypoints: '',
        apiKey: '',
        caiyunKey: ''
    };

    appColorData = {
        light: {
            startColor: DEFAULT_BG_COLOR_LIGHT,
            endColor: DEFAULT_BG_COLOR_DARK,
            fontColor: DEFAULT_COLOR_FONT,
            fgColor: DEFAULT_FG_COLOR,
            fgOptical: DEFAULT_FG_COLOR_OPTICAL
        },
        dark: {
            startColor: DEFAULT_BG_COLOR_LIGHT,
            endColor: DEFAULT_BG_COLOR_DARK,
            fontColor: DEFAULT_COLOR_FONT,
            fgColor: DEFAULT_FG_COLOR,
            fgOptical: DEFAULT_FG_COLOR_OPTICAL
        }
    };


    constructor(arg) {
        super(arg);
        this.name = 'My BMW';
        this.desc = '宝马互联App小组件';

        // load settings
        this.userConfigData = { ...this.userConfigData, ...this.settings['UserConfig'] };
        this.addressConfigData = { ...this.addressConfigData, ...this.settings['addressConfig'] };
        if (this.addressConfigData.apiKey) {
            MAPAPIKEY = this.addressConfigData.apiKey
        }
        if (this.addressConfigData.caiyunKey) {
            WEATHERKEY = this.addressConfigData.caiyunKey
        }
        let colorSettings = this.settings['AppColorConfig'];
        if (typeof colorSettings == 'string') {
            try {
                colorSettings = JSON.parse(colorSettings);
            } catch (e) {
                colorSettings = {};
            }
        }
        this.appColorData = { ...this.appColorData, ...colorSettings };
        if (this.appColorData.light.fgColor && this.appColorData.light.fgOptical) {
            BACK_COLOR = new Color(this.appColorData.light.fgColor, parseFloat(this.appColorData.light.fgOptical))
        }
        if (config.runsInApp) {
            this.registerAction('帐号设置', this.setWidgetConfig);
            this.registerAction('中组件样式', this.typeSetPickUp);
            this.registerAction('自定义组件', this.userConfigInput);
            this.registerAction('自定义背景', this.colorSetPickUp);
            this.registerAction('自定义导航', this.setAddress);
            this.registerAction('获取当前定位', this.getLocationInfo);
        }
    }

    async getLocationInfo() {
        const location = await this.getLocation()
        const geocode = await Location.reverseGeocode(location.latitude, location.longitude)
        console.log(geocode)
        const geo = geocode[0]
        let address = geo.locality + geo.subLocality
        if (geo.thoroughfare) {
            // 街道
            address += geo.thoroughfare
        }
        const userCustomConfigAlert = new Alert();
        userCustomConfigAlert.title = '当前经纬度';
        userCustomConfigAlert.message = `${location.longitude.toFixed(6)},${location.latitude.toFixed(6)}\n${address}\n（仅供参考）`
        userCustomConfigAlert.addAction('确定');
        let result = await userCustomConfigAlert.presentAlert();
        if (result == -1) {
            return;
        }
    }

    async getLocation() {
        try {
            const location = await Location.current()
            //调用高德坐标转换，将gps坐标转为火星坐标
            let url = `https://restapi.amap.com/v3/assistant/coordinate/convert?key=${MAPAPIKEY}&coordsys=gps&locations=${location.longitude.toFixed(6)},${location.latitude.toFixed(6)}`
            const data = await this.httpGet(url)
            if (data.info == 'ok') {
                console.log('定位数据请求成功')
                let locations = data.locations.split(',')
                let message = {}
                message.longitude = parseFloat(locations[0])
                message.latitude = parseFloat(locations[1])
                return message;
            }
        } catch (e) {
            console.log('获取坐标转换信息失败')
            console.error(e.message);
        }
    }

    // 透明背景
    async clearBackground() {
        const img = await this.getWidgetScreenShot()
        if (!img) return
        this.setBackgroundImage(img)
    }

    // 移除透明背景
    async removeClearBackground() {
        this.setBackgroundImage(null)
    }

    async setWidgetConfig() {
        await this.getDependencies();
        const confirmationAlert = new Alert();
        Keychain.set(APP_USE_AGREEMENT, 'true');
        await this.userLoginCredentials();
        //await this.colorSetPickUp();
    }

    async userLoginCredentials() {
        const userLoginAlert = new Alert();
        userLoginAlert.title = '配置BMW登录';
        userLoginAlert.message = '配置My BMW账号密码';

        userLoginAlert.addTextField('账号(您的电话)', this.userConfigData['username']);
        userLoginAlert.addSecureTextField('密码(不要有特殊字符)', this.userConfigData['password']);

        userLoginAlert.addAction('确定');
        userLoginAlert.addCancelAction('取消');

        const id = await userLoginAlert.presentAlert();

        if (id == -1) {
            return;
        }

        this.userConfigData['username'] = this.formatUserMobile(userLoginAlert.textFieldValue(0));
        this.userConfigData['password'] = userLoginAlert.textFieldValue(1);

        // try login first
        let loginResult = await this.myBMWLogin();

        if (!loginResult) {
            const messageAlert = new Alert();
            messageAlert.title = '登录失败';
            messageAlert.message = '请检查您的账号密码';
            messageAlert.addCancelAction('取消');
            await messageAlert.presentAlert();

            return this.userLoginCredentials();
        }

        // write to local
        this.settings['UserConfig'] = this.userConfigData;
        this.saveSettings();
    }

    formatUserMobile(mobileStr) {
        // remove all non numerical char
        mobileStr = mobileStr.replace(/\D/g, '');

        if (mobileStr.startsWith('86')) {
            return mobileStr;
        }

        if (mobileStr.length == 11) {
            return '86' + mobileStr;
        }

        return mobileStr;
    }

    addFontShadow(text) {
        text.shadowColor = new Color('#333333', 0.5)
        text.shadowRadius = 0.5
        text.shadowOffset = new Point(1, 1)
    }

    async getDependencies() {
        const fileManager = FileManager['local']();
        let folder = fileManager.documentsDirectory();

        let libFolder = fileManager.joinPath(folder, 'lib');
        try {
            if (!fileManager.isDirectory(libFolder)) {
                fileManager.createDirectory(libFolder);
            }
        } catch (e) {
            console.error(e.message);
        }

        return await Promise.all(
            DEPENDENCIES.map(async (js) => {
                try {
                    let jsName = js.replace('.js', '');
                    let jsFolder = fileManager.joinPath(libFolder, jsName);

                    // download the file to lib folder
                    let filePath = fileManager.joinPath(jsFolder, 'index.js');
                    let fileExists = fileManager.fileExists(filePath);

                    if (!fileExists) {
                        fileManager.createDirectory(jsFolder);
                        const req = new Request(`${JS_CDN_SERVER}/${encodeURIComponent(js)}`);
                        const res = await req.load();
                        try {
                            fileManager.write(filePath, res);
                            console.warn(js + ' downloaded');
                        } catch (e) {
                            console.error(e.message);
                        }
                    }
                    fileExists = fileManager.fileExists(filePath);
                    if (!fileExists) {
                        this.notify('下载依赖文件失败', '请重新尝试配置');
                    }
                    return console.warn('Dependency found: ' + filePath);
                } catch (e) {
                    console.error(e.message);
                }
            })
        );
    }


    async userConfigInput() {
        const userCustomConfigAlert = new Alert();
        userCustomConfigAlert.title = '自定义小组件';
        userCustomConfigAlert.message = '以下可以不用填写，留空信息会从系统自动获取';

        // refer to default config
        let configSet = {
            custom_name: '自定义车名（可为空）',
            custom_vehicle_image: '车辆图片URL（可为空）',
            custom_logo_image: 'LOGO URL(可为空）',
            vin: '车架号(多辆BMW时填写)',
            oilTotal: '邮箱容积（可为空）',
            bgImageMid: '背景图（可为空）',
        };

        for (const key in configSet) {
            if (!configSet[key] || !this.userConfigData.hasOwnProperty(key)) {
                continue;
            }

            if (key == 'password') {
                userCustomConfigAlert.addSecureTextField(configSet[key], this.userConfigData[key]);
                continue;
            }
            userCustomConfigAlert.addTextField(configSet[key], this.userConfigData[key]);
        }

        userCustomConfigAlert.addCancelAction('取消');
        userCustomConfigAlert.addAction('确定');

        let result = await userCustomConfigAlert.presentAlert();

        if (result == -1) {
            return;
        }

        // start to get data
        for (const key in configSet) {
            if (!configSet[key] || !this.userConfigData.hasOwnProperty(key)) {
                continue;
            }

            let index = Object.keys(configSet).indexOf(key);
            this.userConfigData[key] = userCustomConfigAlert.textFieldValue(index);
        }

        // write to local
        this.settings['UserConfig'] = this.userConfigData;
        this.saveSettings();
    }

    async colorSetPickUp() {
        const colorSetPickup = new Alert();

        colorSetPickup.title = '选取背景颜色';
        colorSetPickup.message = `请根据个人喜好选择或者自定义`;

        let systemColorSet = {
            白色: {
                light: {
                    startColor: '#c7c7c7',
                    endColor: '#fff',
                    fontColor: '#1d1d1d',
                    fgColor: '#000000',
                    fgOptical: '0.2'
                },
                dark: {
                    startColor: '#232323',
                    endColor: '#5b5d61',
                    fontColor: '#fff',
                    fgColor: '#000000',
                    fgOptical: '0.2'
                }
            },
            黑色: {
                light: {
                    startColor: '#5e627d',
                    endColor: '#fff',
                    fontColor: '#1d1d1d',
                    fgColor: '#ffffff',
                    fgOptical: '0.2'
                },
                dark: {
                    startColor: '#2d2f40',
                    endColor: '#666878',
                    fontColor: '#fff',
                    fgColor: '#ffffff',
                    fgOptical: '0.2'
                }
            }
        };

        for (const key in systemColorSet) {
            colorSetPickup.addAction(key);
        }
        colorSetPickup.addAction('自定义');
        colorSetPickup.addAction('透明背景')

        colorSetPickup.addAction('移除背景')
        colorSetPickup.addCancelAction('取消')
        const userSelection = await colorSetPickup.presentAlert();

        if (userSelection == 2) {
            this.settings['AppColorConfig'] = await this.colorConfigInput();
        }
        else if (userSelection == 3) {
            this.clearBackground()
        }
        else if (userSelection == 4) {
            this.removeClearBackground()
        }
        else {
            for (const key in systemColorSet) {
                if (!systemColorSet[key]) {
                    continue;
                }
                let index = Object.keys(systemColorSet).indexOf(key);
                if (index == userSelection) {
                    this.settings['AppColorConfig'] = systemColorSet[key];
                }
            }
        }
        // write to local
        this.saveSettings();
    }

    async typeSetPickUp() {
        const typeSetPickUp = new Alert();
        typeSetPickUp.title = '选取中组件样式';
        typeSetPickUp.message = `挑选中组件样式，也可复制出一份代码，将两种样式同时添加到桌面。\n小技巧：两个中组件在桌面还可以叠放显示哦|`;
        typeSetPickUp.addAction('车型信息&续航里程');
        typeSetPickUp.addAction('车辆定位&天气导航');
        typeSetPickUp.addCancelAction('取消');
        const userSelection = await typeSetPickUp.presentAlert();
        this.settings['TypeConfig'] = userSelection
        this.saveSettings();
    }

    async colorConfigInput() {
        const bgColorAlert = new Alert();
        bgColorAlert.title = '配置颜色';
        bgColorAlert.message = '请输入16进制RBG颜色代码, 留空小组件将自动从系统获取';
        bgColorAlert.addTextField('背景颜色1（如#FFFFFF）', this.appColorData['light']['startColor']);
        bgColorAlert.addTextField('背景颜色2（如#FFFFFF）', this.appColorData['light']['endColor']);
        bgColorAlert.addTextField('字体颜色（如#000000）', this.appColorData['light']['fontColor']);
        bgColorAlert.addTextField('遮罩颜色（如#000000）', this.appColorData['light']['fgColor']);
        bgColorAlert.addTextField('遮罩透明度（如0.1）', this.appColorData['light']['fgOptical']);
        bgColorAlert.addAction('确定');
        bgColorAlert.addCancelAction('取消');
        const id = await bgColorAlert.presentAlert();
        if (id == -1) {
            return this.appColorData;
        }

        let appColorConfig = {
            startColor: bgColorAlert.textFieldValue(0),
            endColor: bgColorAlert.textFieldValue(1),
            fontColor: bgColorAlert.textFieldValue(2),
            fgColor: bgColorAlert.textFieldValue(3),
            fgOptical: bgColorAlert.textFieldValue(4),
        };
        return { light: appColorConfig, dark: appColorConfig };
    }

    async setAddress() {
        const userCustomConfigAlert = new Alert();
        userCustomConfigAlert.title = '自定义导航';
        userCustomConfigAlert.message = '经纬度格式\n111.123456,22.123456\n中间使用英文逗号分隔\n填写个人秘钥，可以防止接口配额超限问题。';

        // refer to default config
        let addressConfigSet = {
            home: '住宅的经纬度',
            homewaypoints: '回家途经点（可为空）',
            company: '公司的经纬度（可为空）',
            companywaypoints: '去公司途经点（可为空）',
            apiKey: '高德Web服务API秘钥（可为空）',
            caiyunKey: '彩云天气API秘钥（可为空）'
        };
        for (const key in addressConfigSet) {
            if (!addressConfigSet[key] || !this.addressConfigData.hasOwnProperty(key)) {
                continue;
            }
            userCustomConfigAlert.addTextField(addressConfigSet[key], this.addressConfigData[key]);
        }
        userCustomConfigAlert.addCancelAction('取消');
        userCustomConfigAlert.addAction('确定');
        let result = await userCustomConfigAlert.presentAlert();
        if (result == -1) {
            return;
        }

        // start to get data
        for (const key in addressConfigSet) {
            if (!addressConfigSet[key] || !this.addressConfigData.hasOwnProperty(key)) {
                continue;
            }

            let index = Object.keys(addressConfigSet).indexOf(key);
            this.addressConfigData[key] = userCustomConfigAlert.textFieldValue(index);
        }

        // write to local
        this.settings['addressConfig'] = this.addressConfigData;
        this.saveSettings();
    }

    async getAppLogo() {
        let logoURL = DEFAULT_LOGO_LIGHT;

        if (this.userConfigData.custom_logo_image) {
            logoURL = this.userConfigData.custom_logo_image;
        }
        let image = await this.getImageByUrl(logoURL)
        return image
    }

    async renderError(errMsg) {
        let w = new ListWidget();
        w.backgroundGradient = this.getBackgroundColor();

        const padding = 16;
        w.setPadding(padding, padding, padding, padding);
        w.addStack().addText(errMsg);
        return w;
    }

    getFontColor() {
        if (this.validColorString(this.appColorData.light.fontColor)) {
            return Color.dynamic(
                new Color(this.appColorData['light']['fontColor'], 1),
                new Color(this.appColorData['dark']['fontColor'], 1)
            );
        }
        return Color.dynamic(new Color('#2B2B2B', 1), Color.white());
    }

    getBackgroundColor() {
        const bgColor = new LinearGradient();
        let startColor = Color.dynamic(new Color(DEFAULT_BG_COLOR_LIGHT, 1), new Color(DEFAULT_BG_COLOR_DARK, 1));
        let endColor = Color.dynamic(new Color(DEFAULT_BG_COLOR_LIGHT, 1), new Color(DEFAULT_BG_COLOR_DARK, 1));
        try {
            // if user override
            if (
                this.appColorData.light.startColor != DEFAULT_BG_COLOR_LIGHT ||
                this.appColorData.light.endColor != DEFAULT_BG_COLOR_LIGHT
            ) {
                if (
                    this.validColorString(this.appColorData['light'].startColor) &&
                    this.validColorString(this.appColorData['light'].endColor)
                ) {
                    startColor = Color.dynamic(
                        new Color(this.appColorData['light']['startColor'], 1),
                        new Color(this.appColorData['dark']['startColor'], 1)
                    );

                    endColor = Color.dynamic(
                        new Color(this.appColorData['light']['endColor'], 1),
                        new Color(this.appColorData['dark']['endColor'], 1)
                    );
                }
            }
        } catch (e) {
            console.error(e.message);
        }

        bgColor.colors = [startColor, endColor];

        bgColor.locations = [0.0, 1.0];
        bgColor.startPoint = new Point(1, 0.5)
        bgColor.endPoint = new Point(0, 0)
        return bgColor;
    }

    validColorString(colorStr) {
        return colorStr && colorStr.search('#') == 0 && (colorStr.length == 4 || colorStr.length == 7); // TODO: change to regex
    }

    provideFont(fontName, fontSize) {
        const fontGenerator = {
            'ultralight': function () {
                return Font.ultraLightSystemFont(fontSize)
            },
            'light': function () { return Font.lightSystemFont(fontSize) },
            'regular': function () { return Font.regularSystemFont(fontSize) },
            'medium': function () { return Font.mediumSystemFont(fontSize) },
            'semibold': function () { return Font.semiboldSystemFont(fontSize) },
            'bold': function () { return Font.boldSystemFont(fontSize) },
            'heavy': function () { return Font.heavySystemFont(fontSize) },
            'black': function () { return Font.blackSystemFont(fontSize) },
            'italic': function () { return Font.italicSystemFont(fontSize) },
        }
        const systemFont = fontGenerator[fontName]
        if (systemFont) { return systemFont() }
        return new Font(fontName, fontSize)
    }

    getOilPercent(data) {
        if (data.status.fuelIndicators.length === 1 && data.status.fuelIndicators[0].showsBar) {
            return data.status.fuelIndicators[0].mainBarValue
        } else {
            let current = data.status.fuelIndicators[0].levelValue
            let all = this.userConfigData.oilTotal === '' ? 65 : parseInt(this.userConfigData.oilTotal)
            if (this.userConfigData.oilTotal === '') {
                console.log('非id7车辆需要设置油箱容积，默认容积65L')
            }
            return parseInt(current * 100 / all)
        }
    }

    getControlMessages(data) {
        try {
            let checkControlMessages = data.status.checkControlMessages.filter((checkControlMessage) => {
                return checkControlMessage['criticalness'] != 'nonCritical';
            });
            if (data.status.issues) {
                for (const key in data.status.issues) {
                    if (!data.status.issues[key]) {
                        continue;
                    }
                    if (data.status.issues[key]['title']) {
                        checkControlMessages.push(data.status.issues[key]);
                    }
                }
            }
            return checkControlMessages;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async getCarCanvasImage(data, canvasWidth, canvasHeight) {

        let canvas = new DrawContext();
        canvas.size = new Size(canvasWidth, canvasHeight);
        canvas.opaque = false;
        canvas.setFont(this.provideFont('bold', Math.round(canvasHeight / 4.5)));
        canvas.setTextColor(this.getFontColor());
        canvas.respectScreenScale = true;

        try {
            let checkControlMessages = this.getControlMessages(data);
            if (checkControlMessages && checkControlMessages.length == 0) {
                canvas.drawTextInRect(
                    'ALL',
                    new Rect(
                        canvasWidth * 0.05, //
                        0,
                        Math.round(canvasWidth * 0.5),
                        Math.round(canvasWidth * 0.5)
                    )
                );
                canvas.drawTextInRect(
                    'GOOD',
                    new Rect(
                        canvasWidth * 0.05,
                        Math.round(canvasHeight / 4.5),
                        Math.round(canvasWidth * 0.5),
                        Math.round(canvasWidth * 0.5)
                    )
                );
            } else {
                let messageFontSize = Math.round(canvasHeight / 8);
                let messageOffset = 0
                let exclamation = SFSymbol.named('exclamationmark.circle').image;
                exclamation.tintColor = new Color("#ff0000", 1)
                canvas.drawImageInRect(
                    exclamation,
                    new Rect(3, messageOffset, Math.round(messageFontSize * 1.2), Math.round(messageFontSize * 1.2))
                );
                canvas.setFont(this.provideFont("bold", messageFontSize));
                canvas.setTextColor(new Color("#ff0000", 1));
                for (const checkControlMessage of checkControlMessages) {
                    canvas.drawTextInRect(
                        checkControlMessage.title,
                        new Rect(
                            Math.round(messageFontSize * 1.8),
                            messageOffset,
                            Math.round(canvasWidth * 0.5),
                            Math.round(canvasWidth * 0.5)
                        )
                    );
                    messageOffset = messageOffset + messageFontSize;
                }
            }
        } catch (e) {
            console.warn(e.message);
        }
        let carImage = await this.getVehicleImage(data);
        let imageSize = this.getImageSize(
            carImage.size.width,
            carImage.size.height,
            canvasWidth,
            canvasHeight
        );

        console.warn('rate ' + imageSize.width / imageSize.height);
        console.warn('imageSize ' + JSON.stringify(imageSize));
        canvas.drawImageInRect(
            carImage,
            new Rect(
                (canvasWidth - imageSize.width) / 2,
                canvasHeight - imageSize.height,
                imageSize.width,
                imageSize.height
            )
        );
        return canvas.getImage();
    }

    getImageSize(imageWidth, imageHeight, canvasWidth, canvasHeight, resizeRate = 0.99) {
        let a = canvasWidth;
        let b = canvasWidth / imageWidth * imageHeight;
        console.log('imageWidth:' + a + ',imageHeight:' + b)
        console.log('canvasWidth:' + canvasWidth + ',canvasHeight:' + canvasHeight)
        if (resizeRate >= 1) {
            resizeRate = 0.99;
        }
        while (true) {
            if (a >= canvasWidth || b >= canvasHeight) {
                console.warn(`resizeRate:${resizeRate}`);
                a = resizeRate * a;
                b = resizeRate * b;
            }
            else {
                break;
            }
        }
        return { width: a, height: b };
    }


    //地图
    async loadMapView(latLng, width, height) {
        try {
            width = parseInt(width * 1.25);
            height = parseInt(height * 1.25);
            let url = `https://restapi.amap.com/v3/staticmap?location=${latLng}&scale=2&zoom=14&size=${width}*${height}&traffic=1&markers=large,0x0099FF,:${latLng}&key=${MAPAPIKEY}`;
            const img = await this.getImageByUrl(url, false)
            return img;
        } catch (e) {
            console.log('load map failed');
            console.error(e.message);
            let ctx = new DrawContext();
            ctx.size = new Size(width, height);
            ctx.fillRect(new Rect(0, 0, width, height));
            ctx.drawTextInRect(e.message || '获取地图失败', new Rect(20, 20, width, height));
            return await ctx.getImage();
        }
    }

    getFuelIndicators(fuelIndicators) {
        let _fuelObj = {
            levelValue: null,
            levelUnits: null,
            rangeValue: null,
            rangeUnits: null,
            chargingType: null
        };
        try {
            for (const fuelIndicator of fuelIndicators) {
                for (const key in _fuelObj) {
                    if (fuelIndicator[key] && !_fuelObj[key]) {
                        _fuelObj[key] = fuelIndicator[key];
                    }
                }
            }

            for (const key in _fuelObj) {
                if (!_fuelObj[key]) {
                    _fuelObj[key] = '';
                }
            }
        } catch (e) { }

        return _fuelObj;
    }

    buildMapURL(lon, lat, name) {
        return `iosamap://path?sourceApplication=applicationName&poiname=${encodeURI(name)}&dlat=${lat}&dlon=${lon}&dev=0&t=0`
    }

    formatDate(data = null) {
        let lastUpdated = new Date();
        if (data != null) {
            lastUpdated = new Date(data.status.lastUpdatedAt);
        }
        let formatter = 'HH:mm';
        let dateFormatter = new DateFormatter();
        dateFormatter.dateFormat = formatter;

        let dateStr = dateFormatter.string(lastUpdated);
        return `${dateStr}`;
    }

    async getData() {
        let accessToken = await this.getAccessToken();
        if (!accessToken || accessToken == '') {
            return null;
        }

        try {
            await this.checkInDaily(accessToken);
        } catch (e) {
            console.error(e.message);
        }
        return await this.getVehicleDetails(accessToken);
    }

    async getPublicKey() {
        let req = BMW_SERVER_HOST + '/eadrax-coas/v1/cop/publickey'
        const res = await this.httpGet(req)
        if (res.code == 200 && res.data.value) {
            console.log('Getting public key success');
            return res.data.value;
        } else {
            console.log('Getting public key failed');
            return '';
        }
    }

    async getAccessToken() {
        let accessToken = '';
        if (Keychain.contains(MY_BMW_TOKEN_UPDATE_LAST_AT)) {
            let lastUpdate = parseInt(Keychain.get(MY_BMW_TOKEN_UPDATE_LAST_AT));
            if (lastUpdate > new Date().valueOf() - 1000 * 60 * 50) {
                if (Keychain.contains(MY_BMW_TOKEN)) {
                    accessToken = Keychain.get(MY_BMW_TOKEN);
                }
            } else {
                if (Keychain.contains(MY_BMW_REFRESH_TOKEN)) {
                    let refreshToken = Keychain.get(MY_BMW_REFRESH_TOKEN);
                    // get refresh token
                    accessToken = await this.refreshToken(refreshToken);
                }
            }
        }

        if (accessToken && accessToken != '') {
            return accessToken;
        }

        console.log('No token found, get again');
        const res = await this.myBMWLogin();

        if (res) {
            const { access_token, refresh_token } = res;

            accessToken = access_token;
            try {
                Keychain.set(MY_BMW_TOKEN_UPDATE_LAST_AT, String(new Date().valueOf()));
                Keychain.set(MY_BMW_TOKEN, accessToken);
                Keychain.set(MY_BMW_REFRESH_TOKEN, refresh_token);
            } catch (e) {
                console.error(e.message);
            }
        } else {
            accessToken = '';
        }

        return accessToken;
    }

    async myBMWLogin() {
        console.log('Start to get token');
        const _password = await this.getEncryptedPassword();
        let req = BMW_SERVER_HOST + '/eadrax-coas/v1/login/pwd';
        let body = JSON.stringify({
            mobile: this.userConfigData.username,
            password: _password
        });
        let headers = BMW_HEADERS;
        console.log('trying to login');
        const res = await this.httpPost(req, headers, body)
        if (res.code == 200) {
            return res.data;
        } else {
            console.log('Get token error');
            return null;
        }
    }

    async getEncryptedPassword() {
        let publicKey = await this.getPublicKey();

        try {
            // 感谢沙包大佬提供思路
            let JSEncrypt = importModule(`lib/jsencrypt`);

            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);

            return encrypt.encrypt(this.userConfigData.password);
        } catch (e) {
            console.error(' error ' + e.message);
            return null;
        }
    }

    async refreshToken(refresh_token) {
        let req = BMW_SERVER_HOST + '/eadrax-coas/v1/oauth/token'
        let headers = {
            ...BMW_HEADERS,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        let body = `grant_type=refresh_token&refresh_token=${refresh_token}`;
        const res = await this.httpPost(req, headers, body)
        if (res.access_token !== undefined) {
            const { access_token, refresh_token } = res;
            Keychain.set(MY_BMW_TOKEN, access_token);
            Keychain.set(MY_BMW_REFRESH_TOKEN, refresh_token);
            Keychain.set(MY_BMW_TOKEN_UPDATE_LAST_AT, String(new Date().valueOf()));
            return access_token;
        } else {
            return '';
        }
    }

    async getVehicleDetails(access_token) {
        let vin = this.userConfigData.vin || '';

        let lastUpdateKey = vin + MY_BMW_VEHICLE_UPDATE_LAST_AT;
        let localVehicleDataKey = vin + MY_BMW_VEHICLE_DATA;

        // skip update prevent access to bmw too much
        let cachedVehicleData
        try {
            if (Keychain.contains(lastUpdateKey) && Keychain.contains(localVehicleDataKey)) {
                let lastUpdate = parseInt(Keychain.get(lastUpdateKey));

                cachedVehicleData = JSON.parse(Keychain.get(localVehicleDataKey));

                // load data every 5 mins
                if (lastUpdate > new Date().valueOf() - 1000 * 60 * 1 && cachedVehicleData && cachedVehicleData.vin) {
                    console.log('Get vehicle data from cache');

                    return cachedVehicleData;
                }
            }
        } catch (e) {
            console.warn('Load vehicle from cache failed');
        }

        console.log('Start to get vehicle details online');
        let req = BMW_SERVER_HOST + `/eadrax-vcs/v1/vehicles?appDateTime=${new Date().valueOf()}`;

        let headers = {
            ...BMW_HEADERS,
            authorization: 'Bearer ' + access_token,
            'content-type': 'application/json; charset=utf-8'
        };

        const vehicles = await this.httpGet(req, headers)

        if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
            let vehicleData = null;

            console.log('Get vehicle details success');
            if (vin && vin.length > 0) {
                // if more than one vehicle
                let vehicleFound = vehicles.find((vehicle) => {
                    return vehicle.vin && vehicle.vin.toUpperCase() == vin.toUpperCase();
                });

                if (vehicleFound) {
                    console.log('VIN matched and found: ' + vin);

                    vehicleData = vehicleFound;
                }
            }

            vehicleData = vehicleData || vehicles[0];

            Keychain.set(lastUpdateKey, String(new Date().valueOf()));
            Keychain.set(localVehicleDataKey, JSON.stringify(vehicleData));

            return vehicleData;
        }

        console.error('Load vehicle failed');
        return cachedVehicleData;
    }

    async checkInDaily(access_token) {
        let dateFormatter = new DateFormatter();
        const lastCheckIn = Keychain.contains(MY_BMW_LAST_CHECK_IN_AT) ? Keychain.get(MY_BMW_LAST_CHECK_IN_AT) : null;

        dateFormatter.dateFormat = 'yyyy-MM-dd';
        let today = dateFormatter.string(new Date());

        if (Keychain.contains(MY_BMW_LAST_CHECK_IN_AT)) {
            console.log('last checked in at: ' + lastCheckIn);

            if (lastCheckIn == today) {
                console.log('User has checked in today');

                return;
            }
        }

        console.log('Start check in');
        let req = BMW_SERVER_HOST + '/cis/eadrax-community/private-api/v1/mine/check-in';
        let headers = {
            ...BMW_HEADERS,
            authorization: 'Bearer ' + access_token,
            'content-type': 'application/json; charset=utf-8'
        };


        let body = JSON.stringify({ signDate: null });

        const res = await this.httpPost(req, headers, body)

        if (Number(res.code) >= 200 && Number(res.code) <= 300) {
            Keychain.set(MY_BMW_LAST_CHECK_IN_AT, today);
        }

        let msg = `${res.message || ''}`;

        if (res.code != 200) {
            msg += `: ${res.businessCode || ''}, 上次签到: ${lastCheckIn || 'None'}.`;
        }

        this.notify('My BMW签到', msg);
    }

    async getBmwOfficialImage(url, useCache = true) {
        const cacheKey = this.md5(url);
        const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey);

        if (useCache && FileManager.local().fileExists(cacheFile)) {
            return Image.fromFile(cacheFile);
        }

        try {
            let access_token = '';
            if (Keychain.contains(MY_BMW_TOKEN)) {
                access_token = Keychain.get(MY_BMW_TOKEN);
            } else {
                throw new Error('没有token');
            }

            let headers = {
                ...BMW_HEADERS,
                authorization: 'Bearer ' + access_token
            };

            const img = await this.getImageByUrl(url, headers)

            // 存储到缓存
            FileManager.local().writeImage(cacheFile, img);
            return img;
        } catch (e) {
            let ctx = new DrawContext();
            ctx.size = new Size(100, 100);
            ctx.setFillColor(new Color('#eee', 1));
            ctx.drawTextInRect(e.message || '获取车辆图片失败', new Rect(20, 20, 100, 100));
            ctx.fillRect(new Rect(0, 0, 100, 100));
            return await ctx.getImage();
        }
    }

    async getVehicleImage(data) {
        let imageCar = '';
        let carImageUrl =
            BMW_SERVER_HOST + `/eadrax-ics/v3/presentation/vehicles/${data.vin}/images?carView=VehicleStatus`;
        if (this.userConfigData.custom_vehicle_image) {
            imageCar = await this.getImageByUrl(this.userConfigData.custom_vehicle_image);
        } else {
            imageCar = await this.getBmwOfficialImage(carImageUrl);
        }
        return imageCar;
    }

    async getPath(slon, slat, dlon, dlat, plate, waypoints = '') {
        try {
            let url = `https://restapi.amap.com/v5/direction/driving?origin=${slon},${slat}&destination=${dlon},${dlat}&plate=${encodeURI(plate)}&key=${MAPAPIKEY}&show_fields=cost`
            if (waypoints != '') {
                url += `&waypoints=${waypoints}`
            }
            console.log(url)
            const res = await this.httpGet(url)
            return res;
        } catch (e) {
            console.log('获取导航信息失败')
            console.error(e.message);
        }
    }

    async getWeather(lon, lat) {
        try {
            let url = `https://api.caiyunapp.com/v2.5/${WEATHERKEY}/${lon},${lat}/weather.json?alert=true`
            console.log(url)
            const weatherJsonData = await this.httpGet(url)
            if (weatherJsonData.status == 'ok') {
                log('天气数据请求成功')
                let weatherInfo = {}
                // 天气突发预警
                let alertWeather = weatherJsonData.result.alert.content
                if (alertWeather.length > 0) {
                    const alertWeatherTitle = alertWeather[0].title
                    log(`突发的天气预警==>${alertWeatherTitle}`)
                    weatherInfo.alertWeatherTitle = alertWeatherTitle
                }
                // 温度范围
                const temperatureData = weatherJsonData.result.daily.temperature[0]
                // 最低温度
                const minTemperature = temperatureData.min
                // 最高温度
                const maxTemperature = temperatureData.max
                weatherInfo.minTemperature = Math.round(minTemperature)
                weatherInfo.maxTemperature = Math.round(maxTemperature)
                // 实时温度
                const temperature = weatherJsonData.result.realtime.temperature
                weatherInfo.temperature = Math.floor(temperature)
                //天气预告
                const weatherDesc = weatherJsonData.result.forecast_keypoint
                weatherInfo.weatherDesc = weatherDesc.replace('。还在加班么？', '，')
                // 天气状况 weatherIcos[weatherIco]
                let weather = weatherJsonData.result.realtime.skycon
                // 小时
                const hour = new Date().getHours()
                let night = hour < 6 || hour >= 18
                let nightCloudy = night && weather == 'CLOUDY'
                let nightLightHaze = night && weather == 'LIGHT_HAZE'
                let nightModerateHaze = night && weather == 'MODERATE_HAZE'
                let nightHeavyHaze = night && weather == 'HEAVY_HAZE'
                if (nightCloudy) {
                    weather = 'CLOUDY_NIGHT'
                }
                if (nightLightHaze) {
                    weather = 'LIGHT_HAZE_NIGHT'
                }
                if (nightModerateHaze) {
                    weather = 'MODERATE_HAZE_NIGHT'
                }
                if (nightHeavyHaze) {
                    weather = 'HEAVY_HAZE_NIGHT'
                }
                weatherInfo.weatherIco = weather
                // 降水率
                weatherInfo.probability = Math.floor(weatherJsonData.result.minutely.probability[0] * 100)
                return weatherInfo;
            }
        } catch (e) {
            console.log('获取彩云天气信息失败')
            console.error(e.message);
        }
    }
}

await Running(Widget)