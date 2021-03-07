FROM centos:7 as builder

RUN yum install -y epel-release && \
    yum install -y curl wget && \
    curl -sL https://rpm.nodesource.com/setup_10.x | bash - && \
    yum install -y nodejs && \
    node --version && \
    npm --version

COPY . .

RUN npm install && \
	npm run build

FROM nginx:stable-alpine

COPY --from=builder /dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]