import { Launcher } from './launcher'

async function start(name: string, isViewMode: boolean) {
  const launcher = new Launcher(name, isViewMode)
  document.getElementById('login').style.display = 'none'
  await launcher.start()
}

window.addEventListener('load', () => {
  if (location.search.startsWith('?viewmode')) {
    start('anonymous', true);
  }
  document
    .getElementById('alias')
    .addEventListener('keydown', async function (e: any) {
      if (e.keyCode === 13) {
        await start(e.target.value, false)
      }
    })
})
