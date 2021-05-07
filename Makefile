run:
	docker-compose up --build

deploy:
	heroku container:push web
	heroku container:release web
