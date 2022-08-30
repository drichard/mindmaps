FROM node:18 as builder
ADD . /src
WORKDIR /src
RUN npm install && \
    npm run build

FROM nginx:1.23
COPY --from=builder /src/dist /usr/share/nginx/html
# Add text/cache-manifest type in mime types
RUN sed -i 's/^types {/types {\n    text\/cache-manifest appcache;/' /etc/nginx/mime.types
