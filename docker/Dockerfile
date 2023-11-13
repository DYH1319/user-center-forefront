FROM nginx

WORKDIR /
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
