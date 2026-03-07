#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="ta-website-mockup"
APP_DIR="$HOME/TA-Website-Mockup"
BRANCH="main"
PORT="3001"

echo "==> Deploying $APP_NAME from branch $BRANCH"
cd "$APP_DIR"

echo "==> Fetching latest code"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "==> Installing dependencies"
npm install

echo "==> Building app"
npm run build

echo "==> Starting or restarting PM2 app"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  PORT="$PORT" pm2 restart "$APP_NAME" --update-env
else
  PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start
fi

echo "==> Saving PM2 process list"
pm2 save

echo "==> Checking app"
sleep 2
curl -I "http://127.0.0.1:$PORT" || true

echo "==> Done"
pm2 status "$APP_NAME"