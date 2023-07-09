config:
	docker compose config
run:
	docker compose up --build --force-recreate  -d
run-client:
	docker  compose up --build --force-recreate -d tour-client
run-server:
	docker compose up --build --force-recreate -d tour-server
run-db:
	docker compose up --build --force-recreate -d mysqldb
clean:
	docker compose down
	rm -f *.txt

