# CLI commands

push:
	git subtree push --prefix server/ heroku master

logs:
	heroku logs --tail

restart:
	heroku ps:restart web

addon-postgres:
	heroku addons:create heroku-postgresql:hobby-dev

pg-info:
	heroku pg:info