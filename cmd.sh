#!/bin/sh

# set docker container name
IMAGE_NAME="redgoose/redgoose.me:latest"
TMP_FILE="_tmp.tar"
HOST="redgoose.me"

build() {
  bun run build
  podman build --force-rm -t $IMAGE_NAME .
  podman image prune -f
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
    upload
    ;;

  compose)
    podman-compose down && podman-compose --project-name goose up -d
    ;;

  *)
    echo "Usage: ${script} {build|upload|upgrade|compose}" >&2
    exit 0
    ;;

esac
