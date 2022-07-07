import app from './src/app';

const server = app;
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`== 📣 Server running at ${port}! ==`);
});
