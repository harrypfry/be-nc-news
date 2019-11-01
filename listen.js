const { PORT = 9090 } = process.env;

applicationCache.addEventListener(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
