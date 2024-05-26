module.exports = {
    apps: [
      {
        name: 'nuxt-app',
        script: './node_modules/nuxt/bin/nuxt.js',
        args: `-c /game/www/event-v2/nuxt.config.js`,
        cwd: '/game/www/event-v2',
        instances: 3,
        exec_mode: 'cluster_mode',
        max_restarts: 2,
        watch: false,
        ignore_watch: ['node_modules', 'logs'],
        env: {
          NODE_ENV: 'development'
        },
        env_production: {
          NODE_ENV: 'production'
        }
      }
    ],
    deploy: {
      production: {
        user: 'root',
        host: [
          '172.19.0.3'
        ],
        ref: 'origin/master',
        repo: 'git@github.com:sagudori/toy',
        path: '/game/www/event-v2',
        'pre-setup': 'mkdir -p /game/www/event-v2/source /game/www/event-v2/releases /game/www/event-v2/shared',
        'post-deploy': 'cp /game/www/event-v2/ecosystem.config.js /game/www/event-v2/current/ecosystem.config.js && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
        'post-restart': 'rm -rf /game/www/event-v2/source'
      }
    }
  };
  