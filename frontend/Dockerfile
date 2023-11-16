FROM nginx:1.24.0

COPY nginx.conf /etc/nginx/nginx.conf
COPY ./dist /www
COPY startup.sh .
RUN chmod +x ./startup.sh

CMD /bin/bash -c "./startup.sh" 