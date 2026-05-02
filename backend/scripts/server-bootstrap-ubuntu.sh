#!/usr/bin/env bash
set -euo pipefail

echo "[server-bootstrap] update"
sudo apt-get update
sudo apt-get upgrade -y

echo "[server-bootstrap] install basics"
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  git \
  jq \
  nginx \
  ufw

echo "[server-bootstrap] install docker"
sudo install -m 0755 -d /etc/apt/keyrings

if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
fi

sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker "$USER"

echo "[server-bootstrap] firewall"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "[server-bootstrap] done. Re-login for docker group to apply."