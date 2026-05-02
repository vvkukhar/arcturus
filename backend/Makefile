up:
	docker compose up --build

api:
	cd api && npm install && npm run bootstrap && npm run start:dev

workers:
	cd workers && npm install && npm run scheduled:loop

scrapers:
	cd scrapers && npm install && npm run loop

bootstrap:
	cd api && npm install && npm run bootstrap

seed:
	cd api && npm run prisma:seed