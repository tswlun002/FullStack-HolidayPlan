config:
	docker compose config
run:
	docker compose up --force-recreate --build  -d
clean:
	docker compose down
	rm -f *.txt

