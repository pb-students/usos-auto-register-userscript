// ==UserScript==
// @name         fow
// @namespace    https://wvffle.net/
// @version      1.0.0
// @description  Funkwhale over WebRTC
// @author       Kasper Seweryn (wvffle)
// @match        https://funkwhale.juniorjpdj.pl/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/reconnecting-websocket/1.0.0/reconnecting-websocket.js
// ==/UserScript==

// NOTE: Check out https://github.com/wvffle/dotfiles/blob/master/.local/bin/funkwhale-like-status.py

const PROTOCOL = 'ws'
const HOST = 'localhost'
const PORT = 9912

const socket = new window.ReconnectingWebSocket(`${PROTOCOL}://${HOST}:${PORT}`, null, { reconnectInterval: 2000 })
socket.addEventListener('message', ({ data }) => {
    if (data === '1') {
        const fav = document.querySelector('.controls-row .controls.desktop-and-up.fluid.align-right > .favorite-icon')
        fav.click()
    }
})



const sleep = (t = 0) => new Promise(r => setTimeout(r, t))

let lastState = null
const setState = async state => {
    socket.send(lastState = +state)
}

socket.addEventListener('open', () => {
    if (lastState !== null) socket.send(lastState)
})

const init = async () => {
    let controls = document.querySelector('.controls-row')
    if (!controls) {
        await sleep(50)
        return init()
    }

    const favObserver = new MutationObserver(mutations => {
        const fav = document.querySelector('.controls-row .controls.desktop-and-up.fluid.align-right > .favorite-icon')
        setState(fav.classList.contains('pink'))
    })

    const controlsObserver = new MutationObserver(mutations => {
        const favContainer = document.querySelector('.controls.desktop-and-up.fluid.align-right')
        if (favContainer && mutations.some(m => [...m.addedNodes].includes(favContainer))) {
            const fav = favContainer.querySelector('.favorite-icon')
            favObserver.observe(fav, { attributes: true })
            setState(fav.classList.contains('pink'))
        }
    })
    controlsObserver.observe(controls, { childList: true })
}

init()
