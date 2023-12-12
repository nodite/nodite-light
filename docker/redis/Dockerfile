# 基础镜像
FROM redis
# author
LABEL MAINTAINER="oscaner1997@gmail.com"

COPY docker/redis/redis-entrypoint.sh /usr/local/bin/

# 如果启动的时候出现 chown 权限问题，可以将下面的注释打开
CMD [ "bash", "-c", "/usr/local/bin/redis-entrypoint.sh" ]
