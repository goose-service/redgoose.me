# redgoose.me version.2

두번째 버전의 redgoose 저장소


## Preference data
`Goose - json`에서 html 설정값을 가지고 있는 json 데이터를 추가해야한다.


## Navigation data
`Goose - json`에서 메뉴트리값을 가지고 있는 json 데이터를 추가해야한다.


## index.user.php
경로설정을 가지고 있는 `index.user.php` 파일이 꼭 필요하다.

----

## URL Guide

### Address
- `/ajax/` : ajax 형식으로 출력하기

### Parameter

#### List page
...

#### Detail page
`/article/{article}/` 형태의 본문 페이지에서 사용되는 파라메터

- `?popup=1` : 소스 형태로 본문 내용을 출력한다.
- `?popup=2` : 요소가 없는 레이아웃과 본문만 출력된다.
- `?hud=0` : 컨트롤 버튼이나 좋아요 버튼 출력여부. (기본값:1)