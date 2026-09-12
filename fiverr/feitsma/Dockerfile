# ==============================
# 1. Build React frontend
# ==============================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/reactFrontend

COPY reactFrontend/package*.json ./
RUN npm ci

COPY reactFrontend/ ./

# IMPORTANT:
# Vite reads VITE_* during "vite build"
ARG VITE_GOOGLE_MAPS_API
ENV VITE_GOOGLE_MAPS_API=$VITE_GOOGLE_MAPS_API

RUN npm run build


# ==============================
# 2. Build Express backend
# ==============================
FROM node:22-alpine AS backend-builder

WORKDIR /app/deliveryBackend

COPY deliveryBackend/package*.json ./
COPY deliveryBackend/tsconfig.json ./

RUN npm ci

COPY deliveryBackend/src ./src

RUN npm run build


# ==============================
# 3. Production image
# ==============================
FROM node:22-alpine

WORKDIR /app/deliveryBackend

COPY deliveryBackend/package*.json ./
RUN npm ci --omit=dev

# Backend compiled JS
COPY --from=backend-builder \
     /app/deliveryBackend/dist \
     ./dist

# React production build
COPY --from=frontend-builder \
     /app/reactFrontend/dist \
     /app/reactFrontend/dist

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]