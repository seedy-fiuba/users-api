run:
	docker-compose up --build

deploy:
	heroku container:login
	heroku container:push web --app seedy-fiuba-grupo-3
	heroku container:release web --app seedy-fiuba-grupo-3
	heroku open --app seedy-fiuba-grupo-3