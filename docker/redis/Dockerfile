# 基础镜像
FROM redis
# author
LABEL MAINTAINER="oscaner1997@gmail.com"

COPY docker/redis/redis-entrypoint.sh /usr/local/bin/

CMD [ "bash", "-c", "/usr/local/bin/redis-entrypoint.sh" ]
