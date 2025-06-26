FROM node:20

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y netcat-openbsd
RUN npm install --include=dev

COPY . .

EXPOSE 5000

# Copier et rendre exécutable l'entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Définir l'entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Commande par défaut exécutée par l'entrypoint
CMD ["npm", "run", "dev"]
