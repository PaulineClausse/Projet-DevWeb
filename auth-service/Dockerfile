FROM node:20

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y netcat-openbsd
RUN npm install --include=dev


EXPOSE 5000

COPY . .
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "run", "dev"]

