#!/usr/bin/env bash
# @see https://github.com/kubernetes-sigs/aws-efs-csi-driver/issues/300

_db_ready() {
  local user
  user="$(stat -c '%u' /var/lib/postgresql/data)"

  if [ "$user" == '0' ]; then
    return
  fi

  usermod -u $(stat -c '%u' /var/lib/postgresql/data) postgres
  groupmod -g $(stat -c '%u' /var/lib/postgresql/data) postgres
  chown -R postgres:postgres /var/lib/postgresql/data
}

_db_ready

/usr/local/bin/docker-entrypoint.sh postgres
