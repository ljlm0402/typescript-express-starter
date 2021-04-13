module.exports = {
  apps: [
    {
      name: 'myapp',
      // package.json에 정의된 npm run start를 실행하게 해서 PM2로 관리하게 한다.
      script: 'npm',
      args: 'run dev',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // development mode
      // pm2 start ecosystem.config.js
      env: {
        HOST: '0.0.0.0',
        PORT: 3000,
        NODE_ENV: 'development',
      },
      // production mode
      // pm2 start ecosystem.config.js --env production
      env_production: {
        HOST: '0.0.0.0',
        PORT: 3000,
        NODE_ENV: 'production',
      },
      output: './logs/console.log',
      error: './logs/consoleError.log',
    },
  ],

  deploy: {
    production: {
      // sample
      user: 'node',
      host: '123.12.123.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    },
  },
};
