# ---- Step 1: Builder ----
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build-time secrets as arguments
ARG AUTH0_SECRET
ARG APP_BASE_URL
ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ARG AUTH0_CLIENT_SECRET
ARG MONGODB_URI
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_S3_BUCKET_NAME

# Set environment variables for build-time access
ENV AUTH0_SECRET=$AUTH0_SECRET
ENV APP_BASE_URL=$APP_BASE_URL
ENV AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
ENV AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET
ENV MONGODB_URI=$MONGODB_URI
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION
ENV AWS_S3_BUCKET_NAME=$AWS_S3_BUCKET_NAME

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

RUN npm run build

# ---- Step 2: Runner ----
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Runtime environment variables (these will be injected during docker run or ECS)
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
