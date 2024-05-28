pipeline {
    agent any

    environment {
        GIT_REPO = 'git@github.com:sagudori/toy.git'
        BRANCH = 'master'
        DEPLOY_PATH = '/game/www/event-v2'
        SSH_KEY_CREDENTIALS_ID = '2e66e3f1-c6f6-4e0d-9ba9-c197ca22d7c7' // 젠킨스에서 설정한 SSH 키의 크리덴셜 ID
        REMOTE_HOST = '172.19.0.3'
    }

    stages {
        stage('Setup SSH Known Hosts') {
            steps {
                script {
                    // 호스트 키를 known_hosts 파일에 추가
                    sh '''
                    mkdir -p ~/.ssh
                    ssh-keyscan -H ${REMOTE_HOST} >> ~/.ssh/known_hosts
                    ssh-keyscan github.com >> ~/.ssh/known_hosts
                    '''
                }
            }
        }
        stage('Checkout') {
            steps {
                script {
                    // 1. 최신화된 git repository 내용을 내려 받는다.
                    git branch: env.BRANCH, credentialsId: env.SSH_KEY_CREDENTIALS_ID, url: env.GIT_REPO
                }
            }
        }
        stage('Install Packages and Build') {
            steps {
                script {
                    try {
                        // 2. pnpm으로 패키지 설치 및 build 진행
                        sh 'npm install'
                        sh 'npm run build'
                    } catch (Exception e) {
                        // 빌드 실패시 fail.sh 쉘 실행
                        echo "build fail"
                        error 'Build failed'
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // 3. pm2 deploy ecosystem.config.js production 명령어 수행
                    sh 'pm2 deploy ecosystem.config.js production'
                }
            }
        }
    }

    post {
        success {
            // 4. 성공시 success.sh 쉘 실행
            echo "deploy success"
        }
        failure {
            // 빌드 실패시 fail.sh 쉘 실행
            echo "deploy fail"
        }
    }
}
