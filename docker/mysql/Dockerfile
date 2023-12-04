FROM mysql

COPY docker/mysql/mysql-entrypoint.sh /usr/local/bin/

# 如果启动的时候出现 chown 权限问题，可以将下面的注释打开
CMD ["bash", "-c", "/usr/local/bin/mysql-entrypoint.sh"]
