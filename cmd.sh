script="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"

case "$1" in

  upload)
    docker save redgoose/redgoose.me:latest | ssh -C reverse docker load
    ;;

  *)
    echo "Usage: ${script} {upload}" >&2
    exit 3
    ;;

esac
