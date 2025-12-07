#!/bin/sh

# set docker container name
IMAGE_NAME="redgoose/redgoose.me:latest"
TMP_FILE="_tmp.tar"
HOST="redgoose.me"

build() {
  docker build --force-rm -t $IMAGE_NAME .
  docker image prune -f
}

upload() {
  docker save -o $TMP_FILE $IMAGE_NAME
  cat $TMP_FILE | ssh $HOST 'docker load'
  rm $TMP_FILE
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
