import { isString } from 'core-util-is';

const gravatar = {
  cdn: 'https://gravatar.cat.net/avatar/',
  ds: ['mm', 'identicon', 'monsterid', 'wavatar', 'retro', ''],
  params: '?s=40',
  hide: !1
};
const GUEST_INFO = ['nick', 'mail', 'link'];
export function parseOptions(opts = {}) {
  if (isString(opts.el)) {
    opts.el = document.querySelector(opts.el);
  }

  if (!opts.el) {
    throw Error(`The target element was not found.`);
  }

  opts.guest_info = opts.guest_info || GUEST_INFO;
  opts.guest_info = opts.guest_info.filter(info => GUEST_INFO.indexOf(info) > -1);

  opts.app_id = opts.app_id || opts.appId;
  opts.app_key = opts.app_key || opts.appKey;
  opts.gravatar = {
    cdn: gravatar.cdn,
    params: '?d=' + (gravatar.ds.indexOf(opts.avatar) > -1 ? opts.avatar : 'mm'),
    hide: opts.avatar === 'hide'
  };

  opts.url = (opts.path || location.pathname).replace(/index\.(html|htm)/, '');

  // opts.anonymous 
  opts.login = opts.login || function () { };
  return opts;
};



export const getLink = (target) => {
  return target.link || (target.mail && `mailto:${target.mail}`) || 'javascript:void(0);';
}

const check = {
  mail(m) {
    return {
      k: /[\w-\.]+@([\w-]+\.)+[a-z]{2,3}/.test(m),
      v: m
    };
  },
  link(l) {
    l = l.length > 0 && (/^(http|https)/.test(l) ? l : `http://${l}`);
    return {
      k: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/.test(l),
      v: l
    };
  }
}

const HtmlUtil = {

  // /**
  //  *
  //  * 将str中的链接转换成a标签形式
  //  * @param {String} str
  //  * @returns
  //  */
  // transUrl(str) {
  //     let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  //     return str.replace(reg, '<a target="_blank" href="$1$2">$1$2</a>');
  // },
  /**
   * HTML转码
   * @param {String} str
   * @return {String} result
   */
  encode(str) {
    return !!str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;") : '';
  },
  /**
   * HTML解码
   * @param {String} str
   * @return {String} result
   */
  decode(str) {
    return !!str ? str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#39;/g, "\'").replace(/&quot;/g, "\"") : '';
  }
};

const padWithZeros = (vNumber, width) => {
  var numAsString = vNumber.toString();
  while (numAsString.length < width) {
    numAsString = '0' + numAsString;
  }
  return numAsString;
}

const dateFormat = (date) => {
  var vDay = padWithZeros(date.getDate(), 2);
  var vMonth = padWithZeros(date.getMonth() + 1, 2);
  var vYear = padWithZeros(date.getFullYear(), 2);
  // var vHour = padWithZeros(date.getHours(), 2);
  // var vMinute = padWithZeros(date.getMinutes(), 2);
  // var vSecond = padWithZeros(date.getSeconds(), 2);
  return `${vYear}-${vMonth}-${vDay}`;
}

export const timeAgo = (date) => {
  try {
    var oldTime = date.getTime();
    var currTime = new Date().getTime();
    var diffValue = currTime - oldTime;

    var days = Math.floor(diffValue / (24 * 3600 * 1000));
    if (days === 0) {
      //计算相差小时数
      var leave1 = diffValue % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      if (hours === 0) {
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        if (minutes === 0) {
          //计算相差秒数
          var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
          var seconds = Math.round(leave3 / 1000);
          return seconds + ' 秒前';
        }
        return minutes + ' 分钟前';
      }
      return hours + ' 小时前';
    }
    if (days < 0) return '刚刚';

    if (days < 8) {
      return days + ' 天前';
    } else {
      return dateFormat(date)
    }
  } catch (error) {
    console.log(error)
  }


}
