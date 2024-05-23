module.exports = {
    apps: [
      {
        name: 'nuxt-app',
        script: 'npm',
        args: `start -c ${process.cwd()}/nuxt.config.js`,
        instances: 4,
        exec_mode: 'cluster',
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
        user: 'root', // 서버의 SSH 사용자명
        host: [
          '172.19.0.3'
        ],
        ref: 'origin/master', // Git 브랜치 이름
        repo: 'git@github.com:sagudori/toy', // Git 리포지토리 URL
        path: '/game/www/event-v2', // 서버에서 애플리케이션이 배포될 경로
        // 'pre-deploy-local': 'ssh-keyscan -H 172.19.0.3 >> ~/.ssh/known_hosts',
        // 'post-deploy': 'cp ~/ecosystem.config.js ~/game/www/event-v2/current && pnpm install && pnpm run build && pm2 reload ecosystem.config.js --env production',
        // 'pre-setup': '',
        // 'post-setup': 'echo "Setup is complete"',
        // 'pre-deploy': 'echo "Deploying to production"',
        // 'pre-restart': 'echo "Restarting application"',
        // 'post-restart': 'echo "Application restarted"'
        'pre-setup': 'mkdir -p /game/www/event-v2/source /game/www/event-v2/releases /game/www/event-v2/shared',
        'post-deploy': 'cp /game/www/event-v2/ecosystem.config.js /game/www/event-v2/current/ecosystem.config.js && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
        'post-restart': 'rm -rf /game/www/event-v2/source'
      }
    }
  };
  