all: build up

up:
	docker compose up

build:
	docker compose build

down:
	docker compose down

clean:
	docker system prune -a -f --volumes

re: down clean build up

entry:
	docker exec -d postgres /bin/bash ./test_entris.sh

backend:
	docker compose up backend

.PHONY: all up build down clean re entry backend
