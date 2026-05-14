module.exports = {
  apps: [
    {
      name: 'arcturus-api',
      script: './apps/api/dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      node_args: '--max-old-space-size=2048',
      exp_backoff_restart_delay: 100,
      merge_logs: true,
    },
    {
      name: 'arcturus-workers',
      script: './apps/workers/dist/main.js',
      instances: process.env.WORKER_CONCURRENCY || 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      merge_logs: true,
    },
    {
      name: 'arcturus-scrapers',
      script: './apps/scrapers/dist/scraper-loop.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};