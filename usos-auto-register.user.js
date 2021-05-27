// ==UserScript==
// @name        USOS Auto Register
// @version     1.1.5
// @author      Kasper Seweryn
// @namespace   https://wvffle.net/
// @supportURL  https://github.com/pb-students/userscripts
// @downloadURL https://raw.githubusercontent.com/pb-students/userscripts/main/usos-auto-register.user.js
// @updateURL   https://raw.githubusercontent.com/pb-students/userscripts/main/usos-auto-register.user.js
// @include     /https?:\/\/usosweb\.pb\.edu\.pl\/kontroler\.php.*/
// @require     https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @grant       GM_addElement
// ==/UserScript==

GM_addElement('link', {
  rel: 'stylesheet',
  href: 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css'
})

toastr.options.progressBar = true
toastr.options.timeOut = 35000

;(() => {
  const form = document.querySelector('.greenforms.ajaxForm')
  if (!form) {
    return
  }

  const register = (retry) => {
    return fetch(form.action, {
      method : "POST",
      body: new FormData(form),
    }).then(async response => {
      const json = await response.json()
      if (json.type === '!') {
        throw new Error(json.pl)
      }

      toastr.success('Udalo sie zapisac.', 'Yay!', { timeOut: 0 })
    }).catch(err => {
      console.error(err)
      toastr.error(err.message, 'Nay :<')

      if (retry) {
        setTimeout(() => register(true), 35000)
      }

      throw err
    })
  }

  // Add auto register button
  for (const el of form.querySelectorAll('.submit')) {
    const btn = GM_addElement(el.parentElement, 'button', {
      class: 'submit semitransparent',
      textContent: 'REJESTRUJ AUTOMATYCZNIE',
    })

    btn.addEventListener('click', event => {
      const { milliseconds } = luxon.DateTime.fromSQL(document.querySelector('.countdown').dataset.date)
        .setZone('Europe/Warsaw', { keepLocalTime: true })
        .diffNow()
        .toObject()
      
      setTimeout(() => {
        register(false).catch(() => {
          setTimeout(() => register(true), 1000)
        })
        
        toastr.info('Automatyczna rejestracja', 'Wybila godzina prawdy.')
      }, milliseconds)
      
      toastr.info('Nie zamykaj tej karty.', 'Zaczekaj na godzine prawdy.', { timeOut: milliseconds })

      event.preventDefault()
      return false
    })
  }
})()
