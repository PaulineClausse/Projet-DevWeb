# Utiliser l'image officielle de Node.js
FROM node:16

# Définir un répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json dans le conteneur
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source dans le conteneur
COPY . .

# Exposer le port que l'application va utiliser (ici, 4001)
EXPOSE 4001

# Lancer l'application
CMD ["node", "src/app.js"]
