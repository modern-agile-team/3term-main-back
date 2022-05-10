module.exports = {
  apps: [
    {
      name: 'mohae-back/mohae',
      script: 'pm2',
      args: 'start ./dist/main.js',
    },
  ],
};
