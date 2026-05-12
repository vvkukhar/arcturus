FROM mcr.microsoft.com/playwright:v1.42.1-jammy AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM mcr.microsoft.com/playwright:v1.42.1-jammy AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM mcr.microsoft.com/playwright:v1.42.1-jammy AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./
CMD ["node", "dist/scraper-loop.js"]