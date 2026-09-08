#!/usr/bin/env bash

# Esperar a MongoDB
./wait-for-it.sh mongo 27017

# Esperar a RabbitMQ
./wait-for-it.sh rabbitmq 5672

# Iniciar el backend
yarn dev

