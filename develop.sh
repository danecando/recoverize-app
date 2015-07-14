#!/usr/bin/env bash

load_env() {
  filename=$1
  filelines=`cat $filename`
  echo 'Starting in development mode'
  for line in $filelines; do
    export $line
  done
}

load_env './.env'
meteor $@ --settings settings.json