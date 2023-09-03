# app name should be overridden.
# ex) production-stage: make build APP_NAME=<APP_NAME>
# ex) development-stage: make build-dev APP_NAME=<APP_NAME>

SHELL := /bin/bash

APP_NAME = typescript-express
APP_NAME := $(APP_NAME)

.PHONY: help up down clean db

help:
	@grep -E '^[1-9a-zA-Z_-]+:.*?## .*$$|(^#--)' $(MAKEFILE_LIST) \
	| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m %-43s\033[0m %s\n", $$1, $$2}' \
	| sed -e 's/\[32m #-- /[33m/'

#-- Docker
up: ## Up the container images
	docker-compose up -d

down: ## Down the container images
	docker-compose down

build: ## Build the container image - Production
	docker build -t ${APP_NAME}\
		-f Dockerfile.prod .

build-dev: ## Build the container image - Development
	docker build -t ${APP_NAME}\
		-f Dockerfile.dev .

run: ## Run the container image
	docker run -d -it -p 3000:3000 ${APP_NAME}

pause: ## Pause the containers
	docker container rm -f ${APP_NAME}

clean: ## Clean the images
	docker rmi -f ${APP_NAME}

remove: ## Remove the volumes
	docker volume rm -f ${APP_NAME}
