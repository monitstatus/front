FROM node:18.12.1-alpine3.15 as build-stage

ARG API_URL=http://localhost:8000
ENV VITE_APP_API_URL=${API_URL}

ARG SLACK_CLIENT_SECRET
ENV VITE_APP_SLACK_CLIENT_SECRET=${SLACK_CLIENT_SECRET}

ARG STATUS_PAGES_URL
ENV VITE_APP_STATUS_PAGES_URL=${STATUS_PAGES_URL}

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.22.1-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
