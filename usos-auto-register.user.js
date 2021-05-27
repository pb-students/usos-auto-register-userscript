// ==UserScript==
// @name        USOS Auto Register
// @version     1.1.1
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

;(() => {
  const form = document.querySelector('.greenforms.ajaxForm')

  if (!form) {
    return
  }

  const register = () => {
    fetch(form.action, {
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
      toastr.error(err.message, 'Nay :<', { timeOut: 3500 })
      setTimeout(register, 35000)
    })
  }

  // NOTE: Yup, they did it. With jQuery.
  jQuery(document).ready(() => {
    jQuery('.countdown').on('countdowncomplete', register)
  })

  // Add auto register button
  for (const x of form.querySelectorAll('.submit')) {
    const k = document.createElement('button')
    k.className = 'submit semitransparent'
    k.innerText = 'REJESTRUJ AUTOMATYCZNIE'
    k.addEventListener('click', register)
    x.parentElement.appendChild(k)
  }
})()

