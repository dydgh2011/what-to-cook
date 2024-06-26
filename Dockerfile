FROM node:20

ARG NODE_ENV
ARG BASE_URL
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG DB_SYNC
ARG OPENAI_API_KEY
ARG JWT_KEY
ARG JWT_EXPIRES_IN
ARG API_DOCS_USER
ARG API_DOCS_PASSWORD
ARG GOOGLE_SEARCH_API_KEY
ARG GOOGLE_SEARCH_ENGINE_ID
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG GOOGLE_AUTH_ID
ARG GOOGLE_AUTH_SECRET
ARG FACEBOOK_AUTH_ID
ARG FACEBOOK_AUTH_SECRET
ARG TWITTER_COMSUMER_ID
ARG TWITTER_COMSUMER_SECRET
ARG TWITTER_AUTH_ID
ARG TWITTER_AUTH_SECRET
ARG MAIL_USER
ARG MAIL_PASS
ARG SUPPORT_EMAIL
ARG SALT_ROUNDS


ENV NODE_ENV=$NODE_ENV
ENV BASE_URL=$BASE_URL
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV DB_SYNC=$DB_SYNC
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV JWT_KEY=$JWT_KEY
ENV JWT_EXPIRES_IN=$JWT_EXPIRES_IN
ENV API_DOCS_USER=admin
ENV API_DOCS_PASSWORD=1234
ENV GOOGLE_SEARCH_API_KEY=$GOOGLE_SEARCH_API_KEY
ENV GOOGLE_SEARCH_ENGINE_ID=$GOOGLE_SEARCH_ENGINE_ID
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ENV SENTRY_DSN=$SENTRY_DSN
ENV GOOGLE_AUTH_ID=$GOOGLE_AUTH_ID
ENV GOOGLE_AUTH_SECRET=$GOOGLE_AUTH_SECRET
ENV FACEBOOK_AUTH_ID=$FACEBOOK_AUTH_ID
ENV FACEBOOK_AUTH_SECRET=$FACEBOOK_AUTH_SECRET
ENV TWITTER_COMSUMER_ID=$TWITTER_COMSUMER_ID
ENV TWITTER_COMSUMER_SECRET=$TWITTER_COMSUMER_SECRET
ENV TWITTER_AUTH_ID=$TWITTER_AUTH_ID
ENV TWITTER_AUTH_SECRET=$TWITTER_AUTH_SECRET
ENV MAIL_USER=$MAIL_USER
ENV MAIL_PASS=$MAIL_PASS
ENV SUPPORT_EMAIL=$SUPPORT_EMAIL
ENV SALT_ROUNDS=$SALT_ROUNDS

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 80

CMD ["yarn", "run", "start:prod"]
