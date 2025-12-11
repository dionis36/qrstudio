FROM node:20-alpine

WORKDIR /app
COPY package.json .
COPY apps/api/package.json ./apps/api/

# Install dependencies using npm
RUN npm install

COPY . .

WORKDIR /app/apps/api
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/app.js"]
