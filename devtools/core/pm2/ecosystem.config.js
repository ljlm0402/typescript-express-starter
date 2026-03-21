module.exports = {
  apps: [
    // --- PRODUCTION ---
    {
      name: 'prod',
      script: 'dist/server.js',
      exec_mode: 'cluster',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      output: './logs/access.log',
      error: './logs/error.log',
      merge_logs: true,
      time: true, // 로그에 타임스탬프
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
      node_args: '--enable-source-maps', // 소스맵 스택트레이스
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
      // env_production: { ... } // 필요 시 분리도 가능
    },

    // --- DEVELOPMENT ---
    {
      name: 'dev',
      script: 'src/server.ts',
      interpreter: 'node',
      node_args: '-r ts-node/register -r tsconfig-paths/register --enable-source-maps',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: ['src'],
      watch_delay: 300, // 저장 폭주 시 완충
      ignore_watch: ['node_modules', 'logs', 'dist'],
      max_memory_restart: '1G',
      output: './logs/access.log',
      error: './logs/error.log',
      merge_logs: true,
      time: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
    },
  ],

  deploy: {
    production: {
      user: 'user',
      host: '0.0.0.0',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/home/user/app',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};
