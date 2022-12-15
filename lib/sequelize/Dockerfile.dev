# NodeJS Version 16
FROM node:16.18-buster-slim

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN npm install --legacy-peer-deps

RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT [ "docker-entrypoint.sh" ]

# Set Env
ENV NODE_ENV development

EXPOSE 3000

# Cmd script
CMD ["npm", "run", "dev"]
