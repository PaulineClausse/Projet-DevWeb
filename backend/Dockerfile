FROM node:20

# Dossier de travail
WORKDIR /app

# Copie des fichiers
COPY package*.json ./
RUN npm install

COPY . .

# Port exposé
EXPOSE 3000

# Lancer l'app
CMD ["npm", "run", "dev"]
