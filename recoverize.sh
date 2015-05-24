#!/usr/bin/env bash

load_env() {
  filename=$1
  filelines=`cat $filename`
  echo Start
  for line in $filelines; do
    export $line
  done
}

load_env './.env'
meteor $@ --settings settings.json