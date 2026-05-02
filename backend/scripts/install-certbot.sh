#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Usage: bash scripts/install-certbot.sh api.example.com admin@example.com"
  exit 1
fi

sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

sudo certbot --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  --redirect

sudo systemctl reload nginx

echo "[certbot] HTTPS enabled for ${DOMAIN}"