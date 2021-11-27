FROM nginx:mainline-alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.crt /etc/ssl
COPY nginx.key /etc/ssl
EXPOSE 80
