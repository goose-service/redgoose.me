#!/bin/sh

script="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
IMAGE_NAME="redgoose/www:latest"
TMP_FILE="_tmp.tar"
HOST="redgoose.me"
#HOST="goose@192.168.0.220"

build() {
  podman build -t $IMAGE_NAME .
}

upload() {
  podman save -o $TMP_FILE $IMAGE_NAME
  cat $TMP_FILE | ssh $HOST 'podman load'
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
    ssh $HOST 'cd ~/docker/www && docker-compose down'
    upload
    ssh $HOST 'cd ~/docker/www && docker-compose up -d'
    ssh $HOST '~/docker/service/cmd.sh service reload'
    ;;

  *)
    echo "Usage: ${script} {build|upload|upgrade}" >&2
    exit 0
    ;;

esac
