FROM node:19.8.1-alpine3.17 as build-stage

ARG API_URL=http://localhost:8000
ENV VITE_APP_API_URL=${API_URL}

ARG FRONT_URL=http://localhost:3000
ENV VITE_APP_FRONT_URL=${FRONT_URL}

ARG SLACK_CLIENT_ID
ENV VITE_APP_SLACK_CLIENT_ID=${SLACK_CLIENT_ID}

ARG STATUS_PAGES_URL
ENV VITE_APP_STATUS_PAGES_URL=${STATUS_PAGES_URL}

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.23.4-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
