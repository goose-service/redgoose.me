#!/bin/bash

# set port
[[ -z "$2" ]] && port=8000 || port=$2

# func / start server
start() {
	php -S localhost:$port -t ./
}

case "$1" in
	start)
		start
		;;

	install)
		# make cache directory
		if [ ! -d cache ]; then
			mkdir cache
			chmod 707 cache
		fi
		# copy .env
		if [ ! -f .env ]; then
			cp .env.example .env
		fi
		;;

	*)
		echo "Usage: ./action.sh {start}" >&2
		exit 3
		;;
esac