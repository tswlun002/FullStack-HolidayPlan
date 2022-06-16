install: venv

	venv/bin/activate; pip3 install -Ur requirements.txt
venv :
	test -d venv || python3 -m venv venv
runServer:
	python3 OXOGameServer.py
run:
	python3 FINAL_OXO_GAME.py
clean:
	rm -rf venv
	find -iname "*.pyc" -delete