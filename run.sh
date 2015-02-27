#!/usr/bin/env bash

MONGO_URL=$(cat ./db.txt) MAIL_URL=smtp://postmaster@recoverize.com:Recoverize123@smtp.mailgun.org:587 meteor $@ --settings settings.json