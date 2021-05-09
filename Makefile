run:
	docker-compose up --build

lint:
	docker run -i -t users-api ./node_modules/.bin/eslint app.js

deploy:
	heroku container:login
	heroku container:push web --app seedy-fiuba-grupo-3
	heroku container:release web --app seedy-fiuba-grupo-3
