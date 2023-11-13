# redgoose-v5


## Install

저장소를 클론 받으면 다음 명령어로 실행해줘야한다

```bun
bun install
```


## Development

```shell
bun run dev
bun run dev:live
```


## Production

```shell
bun run build
bun run start
```


## .env

`.env.local`파일을 만들어서 `.env` 내용을 참고하여 사용한다.


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

### update server

```shell
# build
docker buildx build --platform=linux/amd64 -t redgoose/redgoose.me:latest .

# push to server
docker save redgoose/redgoose.me:latest | ssh -C goose@redgoose.me 'cd ~/docker/www && docker-compose down && docker load && docker-compose up -d && cd ../service && ./cmd.sh service reload'
```
