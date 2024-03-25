//ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'grinbit.cloudpc',
      interpreter: 'node',
      script: './dist/main.js',
      instances: 0,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',

        SERVICE_URL: 'cloudpc.grinbit.io:443',
        VIP_HOST: 'cloudpc.grinbit.io',
        VIP_PORT: 443,

        HTTP_PORT: 8000,
        HTTPS_PORT: 8443,
        JWT_SECRET: '',
        JWT_EXPIRATION: '4h',
        JWT_REFRESH_SECRET: '',
        JWT_REFRESH_EXPIRATION: '30 days',

        REDIS_HOST: 'cloudpc.grinbit.io',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: '',
        REDIS_MASTER_NAME: '',
        SENTINEL_PORT: 234,

        DB_HOST: '',
        DB_PORT: 3306,
        DB_USER: '',
        DB_PASSWORD: '',
        DB_DATABASE: '',

        WALLET_DB_HOST: '',
        WALLET_DB_PORT: 3306,
        WALLET_DB_USER: '',
        WALLET_DB_PASSWORD: '',
        WALLET_DB_DATABASE: '',

        IAMPORT_KEY: '',
        IAMPORT_SECRET:
          '',
      },
      env_staging: {
        NODE_ENV: 'staging',

        SERVICE_URL: '',
        VIP_HOST: 'dev.grinbit.io',
        VIP_PORT: 8880,

        HTTP_PORT: 8881,
        HTTPS_PORT: 8880,
        JWT_SECRET: '!@',
        JWT_EXPIRATION: '4h',
        JWT_REFRESH_SECRET: '',
        JWT_REFRESH_EXPIRATION: '30 days',

        REDIS_HOST: '127.0.0.1',
        REDIS_PORT: 6379,
        REDIS_PASSWORD: '',
        REDIS_MASTER_NAME: '',
        SENTINEL_HOST: '127.0.0.1',
        SENTINEL_PORT: 26379,

        DB_HOST: '',
        DB_PORT: 3306,
        DB_USER: '',
        DB_PASSWORD: '',
        DB_DATABASE: '',

        WALLET_DB_HOST: '',
        WALLET_DB_PORT: 3306,
        WALLET_DB_USER: '',
        WALLET_DB_PASSWORD: '',
        WALLET_DB_DATABASE: '',

        IAMPORT_KEY: '',
        IAMPORT_SECRET:
          '',
      },
      watch: true,
      ignore_watch: ['logs', 'node_modules'],
      merge_logs: true,
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
    },
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['cloudpc1.grinbit.io', 'cloudpc2.grinbit.io'],
      key: '~/.ssh/grinbit-deploy.key',
      ssh_options: 'StrictHostKeyChecking=no',
      repo: 'git@github.com:grinbit-korea/grinbit.cloud.git',
      ref: 'origin/master',
      'post-setup':
        'yarn ; nest build ; pm2 start ecosystem.config.js --env production; pm2 save',
      'post-deploy':
        'yarn ; nest build ; pm2 reload ecosystem.config.js --env production',
      path: '/home/ubuntu/grinbit.cloud',
    },
    
    staging: {
      user: 'ofu',
      host: [{ host: 'dev.grinbit.io', port: '243' }],
      key: '~/.ssh/grinbit-deploy.key',
      ssh_options: 'StrictHostKeyChecking=no',
      repo: 'git@github.com:grinbit-korea/grinbit.cloud.git',
      ref: 'origin/develop',
      'post-setup':
        'yarn ; nest build ; pm2 start ecosystem.config.js --env staging; pm2 save',
      'post-deploy':
        'yarn ; nest build ; pm2 reload ecosystem.config.js --env staging',
      path: '/home/ofu/grinbit.cloud',
    },
  },
};
