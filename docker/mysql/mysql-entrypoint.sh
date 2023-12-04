#!/usr/bin/env bash
# @see https://github.com/kubernetes-sigs/aws-efs-csi-driver/issues/300

_db_ready() {
  local user
  user="$(stat -c '%u' /var/lib/mysql)"

  if [ "$user" == '0' ]; then
    return
  fi

  usermod -u $(stat -c '%u' /var/lib/mysql) mysql
  groupmod -g $(stat -c '%u' /var/lib/mysql) mysql
  chown -R mysql:mysql /var/lib/mysql
}

_db_ready

/usr/local/bin/docker-entrypoint.sh mysqld
