# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json pnpm-lock.yaml* bun.lockb* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; \
  elif [ -f bun.lockb ]; then npm install -g bun && bun install; \
  else npm install; fi

COPY . .

RUN npm run build

# Étape 2 : Image finale pour servir le build
FROM node:20-alpine AS runner

WORKDIR /app

# Installe un serveur statique léger
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"] 