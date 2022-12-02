
export function ready () {
  return new Promise((resolve) => {
    if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', (event) => resolve(event));
    }
  });
}

export function degToRad (angle) {
  return angle * Math.PI / 180;
}

export function radToDeg (angle) {
  return angle * 180 / Math.PI;
}

export function modulo (m, n) {
  return ((m % n) + n) % n;
}

export function clamp (n, min, max) {
  return Math.min(Math.max(min, n), max);
}

export function map (val, oldMin, oldMax, newMin, newMax) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

export function getAutoHeight (element) {
  const $element = document.querySelector(element);
  const heightBackup = $element.style.height;
  const displayBackup = $element.style.display;
  $element.style.height = 'auto';
  $element.style.display = 'block';
  const autoHeight = $element.getBoundingClientRect().height;
  $element.style.height = heightBackup;
  $element.style.display = displayBackup;

  return autoHeight;
}

export function getScrollAmount () {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function randomInt (min, max) {
  const minRounded = Math.ceil(min);
  const maxRounded = Math.floor(max);
  return Math.floor(Math.random() * (maxRounded - minRounded)) + minRounded;
}

export function randomInArray (array) {
  return array[randomInt(0, array.length)];
}

export function /**
 * Return a random int bteween min and max that is a multiple of the base
 * @param {*} min
 * @param {*} max
 * @param {*} base
 */

randomIntMultiple (min, max, base) {
  const random = randomInt(min / base, max / base);
  return random * base;
}

let breakpointsValue;

export function initBreakpointsFromCSS () {
  if (!breakpointsValue) {
    breakpointsValue = {};
    const cssBreakpoints = window.getComputedStyle(document.body).getPropertyValue('--breakpoints');
    cssBreakpoints.split(',').forEach((cssBreakpoint) => {
      if (cssBreakpoint.length > 0) {
        if (cssBreakpoint[0] === ' ') {
          cssBreakpoint = cssBreakpoint.substr(1);
        }
        const breakpointInfos = cssBreakpoint.split(' ');
        breakpointsValue[breakpointInfos[0]] = parseInt(breakpointInfos[1], 10);
      }
    });
  }
}

export function breakpoints () {
  initBreakpointsFromCSS();

  return breakpointsValue;
}

export function isWindowLarger (breakpoint) {
  const breakpointValue = breakpoints()[breakpoint];

  if (!breakpointValue) {
    console.error('No corresponding breakpoint', breakpoint);
    return false;
  }

  return window.innerWidth >= breakpointValue;
}

export function isWindowSmaller (breakpoint) {
  if (!process.client) {
    return false;
  }

  const breakpointValue = breakpoints()[breakpoint];

  if (!breakpointValue) {
    console.error('No corresponding breakpoint', breakpoint);
    return false;
  }

  return window.innerWidth < breakpointValue;
}

export function getCurrentBreakpoint () {
  const currentBreakpoints = breakpoints();
  let currentBreakpoint;

  Object.keys(currentBreakpoints).forEach((breakpoint) => {
    if (window.innerWidth > currentBreakpoints[breakpoint]) {
      currentBreakpoint = breakpoint;
    }
  });

  return currentBreakpoint;
}

export function onImageLoad (image, callback = () => {}) {
  if (image.complete) {
    callback();
  } else {
    image.onload = () => {
      callback();
      image.onload = undefined;
    };
  }
}

export function onImagesLoad (images, callback = () => {}) {
  const total = images.length;
  let count = 0;
  images.forEach((image) => {
    onImageLoad(image, () => {
      count += 1;
      if (count === total) {
        callback();
      }
    });
  });
}

let isTouch = false;

export function isTouchDevice () {
  if (!process.client) {
    return false;
  }

  if (isTouch) {
    return isTouch;
  }

  if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
    isTouch = true;
    return isTouch;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = (query) => window.matchMedia(query).matches;
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  isTouch = mq(query);
  return isTouch;
}

export function initViewportHeightForMobile () {
  const smallFullVh = window.innerHeight;
  const smallVh = smallFullVh * 0.01;
  document.documentElement.style.setProperty('--small-vh', `${smallVh}px`);
  document.documentElement.style.setProperty('--small-full-vh', `${smallFullVh}px`);

  const callback = () => {
    const fullVh = window.innerHeight;
    const vh = fullVh * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--full-vh', `${fullVh}px`);
  };

  callback();

  window.addEventListener('resize', callback);
  window.addEventListener('orientationchange', callback);
}

export function isMobile () {
  return isTouchDevice() || isWindowSmaller('md');
}

export function isSafari () {
  if (!process.client) {
    return false;
  }
  return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
};

export function getSafariVersion () {
  if (isSafari()) {
    const ua = window.navigator.userAgent;
    const res = ua.match(/(Version\/)([\d]{2}.[\d]{1,})( Safari)/i);
    if (res && res.length) {
      return parseFloat(res[2]);
    } else { return 0; }
  }
}

export function lerp (v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

export function durationToString (seconds) {
  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const secondsRest = roundedSeconds % 60;

  return `${padNumber(minutes)}:${padNumber(secondsRest)}`;
}

export function scoreToString (score) {
  const paddedScore = padNumber(score, 6);

  return paddedScore.replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, '\u00A0');
}

export function padNumber (number, nbLeadingZeros = 2) {
  return String(number).padStart(nbLeadingZeros, '0');
}

export async function aesGcmEncrypt (plaintext, keyValue) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // get 96-bit random iv
  const ivStr = Array.from(iv).map((b) => String.fromCharCode(b)).join(''); // iv as utf-8 string

  const alg = { name: 'AES-GCM', iv };
  const keyBuffer = Buffer.from(keyValue, 'base64');

  const key = await crypto.subtle.importKey('raw', keyBuffer, alg, false, ['encrypt']);

  const ptUint8 = new TextEncoder().encode(plaintext); // encode plaintext as UTF-8
  const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8); // encrypt plaintext using key

  const ctArray = Array.from(new Uint8Array(ctBuffer)); // ciphertext as byte array
  const ctStr = ctArray.map((byte) => String.fromCharCode(byte)).join(''); // ciphertext as string

  return btoa(ivStr + ctStr); // iv+ciphertext base64-encoded
}

export async function getIpInfos () {
  return await fetch(`${location.protocol}//api.ipstack.com/check?access_key=${process.env.ipstack.access_key}`, {
    method: 'GET',
  })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(response.error);
      }

      return response.json();
    })
    .then((json) => {
      if (json.success === false) {
        throw new Error(json.error);
      }

      return json;
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

export function generateId () {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export function createPromise () {
  let promiseResolve, promiseReject;

  const promise = new Promise((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  promise.resolve = promiseResolve;
  promise.reject = promiseReject;

  return promise;
}

export function calculateReadingTime (text, lang) {
  // Calculation based on nb words
  // let wpm;
  // switch (speed) {
  //   case 'normal':
  //     wpm = 170;
  //     break;
  //   case 'slow':
  //     wpm = 150;
  //     break;
  //   default:
  //     break;
  // }

  // const nbWords = text.trim().split(/\s+/).length;
  // const durationWord = (nbWords * 60) / wpm;
  // const timeWord = Math.ceil(durationWord * 1000);

  // Calculation based on nb chars
  const charsPerMinutesByLang = {
    'zh-tw': 500,
    'zh-cn': 500,
    jp: 600,
  };
  const charsPerMinute = charsPerMinutesByLang[lang] ? charsPerMinutesByLang[lang] : 800;

  const nbChars = text.length;
  const durationChars = (nbChars * 60) / charsPerMinute;
  const timeChars = Math.ceil(durationChars * 1000);

  return timeChars;
}

const TAU = Math.PI * 2;

const modAngle = (angle) => ((angle % TAU) + TAU) % TAU;

export function lerpAngle (a, b, v) {
  let diff = modAngle(b - a);
  if (diff > Math.PI) { diff = -modAngle(a - b); };
  return a + diff * v;
}

export function createTextCanvas (string, parameters = {}) {
  const scale = 2;
  const lines = string.split('\n');
  const lineHeight = (parameters.lineHeight || 56);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // Prepare the font to be able to measure
  const fontSize = scale * (parameters.fontSize || 56);
  const font = parameters.font || 'monospace';
  ctx.font = `${fontSize}px ${font}`;
  ctx.scale(scale, scale);

  const metrics = lines.map((line) => { return ctx.measureText(line.trim()); });

  const width = metrics.sort((a, b) => {
    if (a.width < b.width) {
      return 1;
    } else {
      return -1;
    }
  })[0].width;

  const height = (lines.length * lineHeight) + (parameters.strokeWidth ? parameters.strokeWidth : 1.5) + 1;

  // Resize canvas to match text size
  canvas.width = width;
  canvas.height = scale * height;

  // Re-apply font since canvas is resized.
  ctx.font = `${fontSize}px ${font}`;
  ctx.textAlign = parameters.align || 'center';
  ctx.textBaseline = parameters.baseline || 'top';

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (parameters.gradient) {
    const x = 0.5 * ctx.canvas.width;
    const gradient = ctx.createLinearGradient(x, 0, x, ctx.canvas.height);
    parameters.gradient.forEach((gradientEntry) => {
      gradient.addColorStop(gradientEntry.position, gradientEntry.color);
    });
    ctx.fillStyle = gradient;
    ctx.strokeStyle = gradient;
  } else {
    ctx.fillStyle = parameters.color || 'black';
    ctx.strokeStyle = parameters.color || 'black';
  }

  let x = 0;

  if (ctx.textAlign === 'center') {
    x = width / 2;
  } else if (ctx.textAlign === 'right') {
    x = width;
  }

  const y = 0;
  for (let i = 0; i < lines.length; i++) {
    if (parameters.stroke) {
      ctx.lineWidth = (parameters.strokeWidth ? parameters.strokeWidth : 1.5) * scale;
      ctx.strokeText(lines[i].trim(), x, y + i * scale * lineHeight);
    } else {
      ctx.fillText(lines[i].trim(), x, y + i * scale * lineHeight);
    }
  }

  return canvas;
}

export function isTodayBetweenDates (start, end) {
  const today = new Date();

  return start < today && today < end;
}
