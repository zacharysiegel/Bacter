PORT ?= 12001

.PHONY: default
default:
	exit 1

.PHONY: build
build:
	./build.sh

.PHONY: start
start:
	PORT=$(PORT) ./start.sh

.PHONY: start-bg
start-bg:
	PORT=$(PORT) ./start.sh &

