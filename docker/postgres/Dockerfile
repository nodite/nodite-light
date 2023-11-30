FROM postgres:16

# 默认使用清华镜像以提高 apt update 速度，如无需要可自行注释
COPY docker/debian.sources.list /etc/apt/sources.list

RUN apt-get update && \
  apt-get install -y --no-install-recommends postgresql-16-pgvector

COPY docker/postgres/postgres-entrypoint.sh /usr/local/bin/

# 如果启动的时候出现 chown 权限问题，可以将下面的注释打开
CMD ["bash", "-c", "/usr/local/bin/postgres-entrypoint.sh"]
