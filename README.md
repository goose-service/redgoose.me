# redgoose.me v6

> https://redgoose.me

redgoose 대표 서비스 도메인


## Setup

다음과 같은 과정으로 프로그램 사용을 준비합니다.

- [https://bun.sh](https://bun.sh) 설치
- 프로젝트 클론
- `bun install` 명령어로 의존성 설치
- `.env` -> `.env.local` 파일 복사 및 편집
- 개발 실행하거나 프로덕션 작업

## Development

개발과 빠른 프리뷰 용도로 사용할 수 있습니다.
서버를 실행하려면 다음과 같은 명령어를 실행합니다.

```shell
bun run dev
```

서버가 열리면 `.env`에서 설정한 포트 두개가 같이 열리게 됩니다. 이때 `PORT_CLIENT` 포트를 조합한 URL로 접속합니다. ex) `http://localhost:81`


## Production

프로젝트를 빌드하고 운영 상태로 서버를 실행합니다.
먼저 다음과 같이 프로젝트를 빌드합니다.

```shell
bun run build
```

빌드가 완료되면 `dist` 디렉토리가 생성됩니다. 이 디렉토리의 내용으로 웹 서버를 실행하기 위하여 다음과 같은 명령어를 실행합니다.

```shell
bun run preview
```

서버가 실행되었으면 `.env`에서 설정한 `PORT` 포트로 접속할 수 있습니다. ex) `http://localhost:80`


## .env 가이드

프로그램 사용에 기초적인 설정을 합니다.
기본값은 `.env`파일에 기록되어 있으니 참고해주세요.

```
# server
HOST="0.0.0.0" # 서버 호스트 주소
PORT="80" # 백엔드 서버 포트번호 (프로덕션 모드에서 사용)
PORT_CLIENT="81" # 클라이언트 서버 포트번호 (개발모드에서만 사용됩니다.)

# path
URL_PATH="http://localhost" # 이 프로그램에서 사용하는 URL 경로

# cookie
COOKIE_PREFIX="goose-" # 쿠키이름 접두사
COOKIE_MAX_AGE="604800" # 7days (초 단위)
COOKIE_DOMAIN="redgoose.me" # 쿠키 도메인
COOKIE_HTTP_ONLY="true" # 쿠키 HttpOnly 설정
COOKIE_SECURE="true" # 쿠키 Secure 설정

# api
API_URL="" # API 서버 URL
API_CLIENT_URL="" # 클라이언트에서 사용되는 API 서버 URL (값이 없으면 API_URL 값으로 사용합니다.)
API_TOKEN="" # API 공개토큰

# app
APP_SRL="" # 앱 srl 번호
APP_INDEX_SIZE="24" # 목록에서 출력되는 아이템 갯수
```

## Docker 사용하기

podman-compose를 사용하여 컨테이너를 열 수 있습니다.

```yml
services:
  redgoose.me:
    container_name: redgoose.me
    image: redgoose/redgoose.me:latest
    ports:
      - "8000:80"
    volumes:
      - ./.env.docker:/app/.env.local
    networks:
      - goose
    environment:
      - FOO=bar

networks:
  goose:
    name: goose
```
