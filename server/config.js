module.exports = {
  server: {
    port: process.env.SERVER_PORT,
  },
  characters: {
    mario: {
      name: process.env.MARIO_NAME,
      password: process.env.MARIO_PASSWORD,
    },
    luigi: {
      name: process.env.LUIGI_NAME,
      password: process.env.LUIGI_PASSWORD,
    },
  },
}
