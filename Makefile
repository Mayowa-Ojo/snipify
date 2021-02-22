# CLI commands

push:
	git subtree push --prefix server/ heroku master

logs:
	heroku logs --tail

# restart dyno
restart:
	heroku ps:restart web

addon-postgres:
	heroku addons:create heroku-postgresql:hobby-dev

pg-info:
	heroku pg:info

# ssh into pg instance from terminal
psql:
	heroku pg:psql

# export local db to heroku:pg
pg-push:
	heroku pg:push snipify postgresql-contoured-86378 --app snipify-api