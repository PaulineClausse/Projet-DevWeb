# Utilisation de l'image officielle Node.js
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet dans le conteneur
COPY . .

# Exposer le port utilisé par l'application
EXPOSE 4002

# Lancer l'application
CMD ["npm", "run", "dev"]
