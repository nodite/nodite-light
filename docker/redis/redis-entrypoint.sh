#!/usr/bin/env bash
# @see https://github.com/kubernetes-sigs/aws-efs-csi-driver/issues/300

_db_ready() {
  local user; user="$(stat -c '%u' /data)"

  if [ "$user" == '0' ]; then
    return
  fi

  usermod -u $(stat -c '%u' /data) redis
  groupmod -g $(stat -c '%u' /data) redis
  chown -R redis:redis /data
}

_db_ready

/usr/local/bin/docker-entrypoint.sh redis-server
