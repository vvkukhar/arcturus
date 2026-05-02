#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-api.arcturus.local}"

if [ ! -f "nginx/arcturus.conf" ]; then
  echo "[nginx] run from backend directory"
  exit 1
fi

TMP_FILE="/tmp/arcturus-nginx.conf"

sed "s/server_name api.arcturus.local;/server_name ${DOMAIN};/" nginx/arcturus.conf > "$TMP_FILE"

sudo cp "$TMP_FILE" /etc/nginx/sites-available/arcturus
sudo ln -sf /etc/nginx/sites-available/arcturus /etc/nginx/sites-enabled/arcturus

sudo nginx -t
sudo systemctl reload nginx

echo "[nginx] installed for ${DOMAIN}"