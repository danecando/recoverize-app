#!/usr/bin/env bash

MONGO_URL=$(cat ./db.txt) meteor --settings config/settings.json