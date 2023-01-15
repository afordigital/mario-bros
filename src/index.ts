import { Launcher } from './launcher'

window.addEventListener('load', () => {
  document
    .getElementById('alias')
    .addEventListener('keydown', async function (e: any) {
      if (e.keyCode === 13) {
        const launcher = new Launcher(e.target.value)
        document.getElementById('login').style.display = 'none'
        await launcher.start()
      }
    })
})
