# redgoose-v5

redgoose.me ver 5.6


## Install

저장소를 클론 받으면 다음 명령어로 실행해줘야한다

```bash
```


## Development

```bash
bun run dev
bun run dev:live
```


## Production

```bash
npm run build
npm run start
```


## .env

`.env.local`파일을 만들어서 `.env` 내용을 참고하여 사용한다.


## docker


## vendors

- Vite
- SCSS
- Typescript
- DotENV
- express
- isbot
- svelte


## docker

### make image

이미지 만들기

```shell
# Mac M1 for linux
docker buildx build --platform=linux/amd64 -t redgoose/redgoose.me:latest .
# Mac M1 for macos
docker buildx build --platform=linux/arm64/v8 -t redgoose/redgoose.me:latest .
# Mac Intel
docker build -t redgoose/redgoose.me:latest .
```
