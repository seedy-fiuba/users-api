# Users API


### How to run locally:
`make run`

### How to deploy docker image to heroku:

First you have to have installed `heroku cli`, if you don't please follow this [tutorial](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).
Then follow this steps:

1. Login to heroku cli, be sure to have access to the heroku application:

`heroku login`

2. Login to heroku container registry:

`heroku container:login`

3. Build the image and push to Container Registry (make sure that your directory contains a Dockerfile):

`heroku container:push web`

4. Then release the image to your app:

`heroku container:release web`

5. Now open the app in your browser, you must see in the logs your application deploy:

`heroku open`

Note: if you are already login to the container registry you can also deploy to heroku using the following make command:

`make deploy`

