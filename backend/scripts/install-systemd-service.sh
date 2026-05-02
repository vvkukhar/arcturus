#!/usr/bin/env bash
set -euo pipefail

sudo cp systemd/arcturus.service /etc/systemd/system/arcturus.service
sudo systemctl daemon-reload
sudo systemctl enable arcturus.service
sudo systemctl start arcturus.service

sudo systemctl status arcturus.service --no-pager