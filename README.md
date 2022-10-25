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


## TODO

- [x] 출력 순서가 거꾸로 되어있는거 같다?
- [x] 좋아요 액션 API 연동
- [x] RSS 작업
- [x] 모바일 화면에서 메뉴토글 기능작업
- [ ] docker 설정
- [x] 본문 라이트박스 제작
- [x] markdown 조정
- [x] 봇용 html 작업
