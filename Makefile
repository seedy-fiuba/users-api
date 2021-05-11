run:
	docker-compose up --build

clean:
	docker-compose down

deploy:
	heroku container:login
	heroku container:push web --app seedy-fiuba-users-api
	heroku container:release web --app seedy-fiuba-users-api
	heroku open --app seedy-fiuba-users-api