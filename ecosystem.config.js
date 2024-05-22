module.exports = {
    apps: [
      {
        name: 'nuxt-app',
        script: 'npm',
        args: 'start',
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
        'pre-deploy-local': '',
        'post-deploy': 'pnpm install && pnpm run build && pm2 reload ecosystem.config.js --env production',
        'pre-setup': ''
      }
    }
  };
  