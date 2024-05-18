# 기본 이미지를 설정합니다.
FROM node:latest

# 앱 디렉토리를 생성합니다.
WORKDIR /game/www/event-v2

# 패키지 파일(package.json)을 복사합니다.
COPY package*.json ./

# npm 패키지를 설치합니다.
RUN npm install

# 앱 소스 코드를 복사합니다.
COPY . .

# PM2를 전역으로 설치합니다.
RUN npm install pm2 -g
RUN npm install yarn -g

# 앱을 빌드합니다.
RUN npm run build

# Nginx를 설치합니다.
RUN apt-get update && apt-get install -y nginx
RUN apt-get install -y vim

# Nginx 설정 파일을 복사합니다.
COPY nginx.conf /etc/nginx/nginx.conf

# 앱을 실행합니다.
CMD service nginx start && pm2-runtime start npm -- start

# 포트 3000을 노출합니다. (Node.js 앱이 3000번 포트에서 실행되는 경우)
EXPOSE 3000
