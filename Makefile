all: build up

up:
	docker compose up

build:
	docker compose build

down:
	docker compose down

re: down build up

entry:
	docker exec -d postgres /bin/bash ./test_entris.sh 

	


