#!/bin/sh

# set docker container name
IMAGE_NAME="redgoose/redgoose.me:local"
UPLOAD_IMAGE_NAME="super8/service:dev"
HOST="redgoose.me"

build() {
  docker build --force-rm -t $IMAGE_NAME .
  docker image prune -f
}

upload() {
  docker image tag $IMAGE_NAME $UPLOAD_IMAGE_NAME
  docker save $UPLOAD_IMAGE_NAME | ssh $HOST 'docker load'
  docker image rm $UPLOAD_IMAGE_NAME >/dev/null
}

case "$1" in

  build)
    build
    ;;

  upload)
    upload
    ;;

  upgrade)
    build
    upload
    ;;

  compose)
    docker-compose down && docker-compose up -d
    ;;

  *)
    echo "Usage: ${script} {build|upload|upgrade|compose}" >&2
    exit 0
    ;;

esac
