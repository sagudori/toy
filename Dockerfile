# 기본 이미지를 설정합니다.
FROM node:latest

# 앱 디렉토리를 생성합니다.
WORKDIR /game/www/event-v2

# 패키지 파일(package.json)을 복사합니다.
COPY package*.json ./

# PM2와 Yarn을 전역으로 설치합니다.
RUN npm install -g pm2
RUN npm install -g pnpm

# npm 패키지를 설치합니다.
RUN npm install

# 앱 소스 코드를 복사합니다.
COPY . . 

# 앱을 빌드합니다.
RUN npm run build

# Nginx를 설치합니다.
RUN apt-get update && apt-get install -y nginx && apt-get install -y vim && apt-get install -y git && apt-get install -y openssh-server

RUN mkdir -p /root/.ssh && \
    ssh-keygen -t rsa -b 4096 -N '' -f /root/.ssh/id_rsa && \
    cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 644 /root/.ssh/id_rsa.pub && \
    chmod 700 /root/.ssh && \
    sed -i 's/#   StrictHostKeyChecking ask/StrictHostKeyChecking no/' /etc/ssh/ssh_config


# Nginx 설정 파일을 복사합니다.
COPY nginx.conf /etc/nginx/nginx.conf

# 앱을 실행합니다.
CMD ["sh", "-c", "service nginx start && service ssh start && pm2-runtime start ecosystem.config.js"]


# 포트 3000을 노출합니다. (Node.js 앱이 3000번 포트에서 실행되는 경우)
EXPOSE 22 3000
