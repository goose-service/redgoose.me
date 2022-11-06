script="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"

case "$1" in

  upgrade)
    docker buildx build --platform=linux/amd64 -t redgoose/redgoose.me:latest .
    docker save redgoose/redgoose.me:latest | ssh -C goose@redgoose.me 'cd www && docker-compose down && docker load && docker-compose up -d && cd ../service && ./cmd.sh service reload'
    ;;

  *)
    echo "Usage: ${script} {upgrade}" >&2
    exit 3
    ;;

esac
