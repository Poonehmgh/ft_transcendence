all:
	docker compose up

build:
	docker compose up --build

down:
	docker compose down

clean: down
	docker system prune -a

re: clean all

rebuild:
	docker compose down
	docker-compose build --no-cache
	docker-compose up --force-recreate

nuke: down-v
	docker system prune --all --force

mgit:
	git add .
	@read -p "Enter the commit message: " msg;\
	git commit -m "$$msg"
	git push
	@echo "$(COLOR)git auto add & push with message performed.$(RESET)"

.PHONY: all build down clean re
