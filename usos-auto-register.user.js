const form = document.querySelector('.greenforms.ajaxForm')
const register = () => {
    fetch(form.action, {
        method : "POST",
        body: new FormData(form),
    }).then(async response => {
		const json = await response.json()
		if (json.type === '!') throw new Error(json.pl)
		alert("Pomyslnie zarejestrowano!")
    }).catch(err => {
		console.error(err)
		setTimeout(register, 35000)
	})
}

for (const x of form.querySelectorAll('.submit')) {
  const k = document.createElement('button')
  k.className = 'submit semitransparent'
  k.innerText = 'REJESTRUJ AUTOMATYCZNIE'
  k.addEventListener('click', register)
  x.parentElement.appendChild(k)
}
