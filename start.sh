#!/bin/sh

sleep 4 # wait hosts file to generate

exec /usr/bin/ss-local -v -c /data/config.json
