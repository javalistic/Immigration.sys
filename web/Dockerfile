# Build stage
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies and server code
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/server.js /app/server.js
COPY serve.json /app/serve.json

EXPOSE 3000 3001

# Start both frontend and backend
CMD ["node", "server.js"]
