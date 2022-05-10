module.exports = {
  apps: [
    {
      name: 'main',
      script: 'pm2',
      args: 'start ./dist/main.js',
    },
  ],
};
