# build stage
FROM node
COPY . /src
WORKDIR /src
RUN npm install
RUN npm run build

# run stage
FROM linuxserver/nginx
RUN mkdir /mindmap
WORKDIR /mindmap/
COPY --from=0 /src/bin /config/www
EXPOSE 80
