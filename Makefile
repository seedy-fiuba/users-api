run:
	docker-compose run -e NODE_ENV=stage -p 8080:8080 web npm start
