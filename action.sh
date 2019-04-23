#!/bin/bash

# set port
[[ -z "$2" ]] && port=9000 || port=$2

# func / start server
start() {
	php -S 0.0.0.0:$port -t ./
}

case "$1" in
	start)
		start
		;;

	setup)
		# make cache directory
		if [ ! -d cache ]; then
			mkdir cache
			chmod 707 cache
			mkdir cache/view
			chmod 707 cache/view
		fi
		# copy .env
		if [ ! -f .env ]; then
			cp .env.example .env
		fi
		;;

	# watch js,css
	watch)
		parcel watch assets/js/app.js \
		  --no-autoinstall \
		  --out-dir assets/dist \
		  --cache-dir cache/parcel \
		  --public-url /assets/dist
		;;

	build)
		rm -rf assets/dist
		parcel build assets/js/app.js \
		  --no-source-maps \
		  --out-dir assets/dist \
		  --public-url ./ \
		  --cache-dir \
		  cache/parcel
		;;

	*)
		echo "Usage: ./action.sh {setup|start|watch|build}" >&2
		exit 3
		;;
esac