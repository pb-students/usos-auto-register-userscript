// ==UserScript==
// @name     Disable Tab Change Detection
// @version  1.3.2
// @run-at   document-start
// @namespace https://wvffle.net/
// @include  /^https?:\/\/cez(2|e)?\.wi\.pb\.edu\.pl\/.*$/
// @include  /^https?:\/\/(moodle|ekursy)?\.put\.poznan\.pl\/.*$/
// @include  /^https?:\/\/moodle\.mimuw\.edu\.pl\/.*$/
// @grant    none
// ==/UserScript==

const events = {
  mouse: {
    mouseenter: false,
    mouseleave: false,
    mouseover: false,
    mousemove: false,
    wheel: true,
    mousedown: true,
    mouseup: true
  },
  visibility: {
    visibilitychange: false,
    blur: false,
    focus: false
  }
}

const expands = {
  visibilitychange: ['visibilitychange', 'msvisibilitychange', 'webkitvisibilitychange']
}

const reducer = (acc, [key, value]) => {
  if (typeof value === 'boolean') {
    if (!value) {
      if (key in expands) {
        acc.add(...expands[key])
      }

      acc.add(key)
    }
    
    return acc
  }

  return Object.entries(value).reduce(reducer, acc)
}

const eventsSet = Object.entries(events).reduce(reducer, new Set())

for (const target of [window, document]) {
  for (const event of eventsSet) {
    target.addEventListener(event, e => e.stopImmediatePropagation(), true)
  }
}

for (const prop of ['visibilityState', 'msvisibilitychange', 'webkitvisibilitychange']) {
  Object.defineProperty(document, prop, {
    get (target) {
      return 'visible'
    }
  })
}

for (const prop of ['hidden', 'msHidden', 'webkitHidden']) {
  Object.defineProperty(document, prop, {
    get () {
      return false
    }
  })
}

const start = +new Date
let call = start

window.requestAnimationFrame = window.msRequestAnimationFrame = window.mozRequestAnimationFrame = window.webkitRequestAnimationFrame = cb => {
  const now = +new Date
  const timeout = Math.min(call - now + 100 / 6)
  call = now + timeout

  return setTimeout(() => cb(now - start), timeout)
}

window.cancelAnimationFrame = window.mozCancelAnimationFrame = window.webkitCancelAnimationFrame = window.cancelRequestAnimationFrame = 
window.msCancelRequestAnimationFrame = window.mozCancelRequestAnimationFrame = window.webkitCancelRequestAnimationFrame = i => {
  return clearTimeout(i)
}
