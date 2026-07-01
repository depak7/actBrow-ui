# Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Client-exposed (NEXT_PUBLIC_*) values must be present at build time to be inlined into the bundle.
ARG NEXT_PUBLIC_ACTBROW_BASE_URL=http://localhost:8080
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID=
ENV NEXT_PUBLIC_ACTBROW_BASE_URL=$NEXT_PUBLIC_ACTBROW_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
RUN npm run build

# Run
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./next.config.js

EXPOSE 3000
# NEXT_PUBLIC_API_PROXY_TARGET is read by next.config.js at server startup (runtime), so it can be
# supplied via the compose `environment:` block rather than a build arg.
CMD ["npm", "start"]
