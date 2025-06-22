# Utilise la version Node adaptée à ton projet (16 ou 20 selon le service)
FROM node:20

# Dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe toutes les dépendances (prod + dev)
RUN npm install --include=dev

# Copie le reste du code
COPY . .

# Expose le port utilisé par le service (à adapter pour chaque service)
EXPOSE 5173

# Commande de démarrage (à adapter pour chaque service)
CMD ["npm", "run", "dev"]