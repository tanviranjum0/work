#!/usr/bin/env bash
# Prepare a fresh Ubuntu 24.04 LTS EC2 instance (t2.micro / t3.micro) for the RideBack stack.
#
#   sudo bash deploy/scripts/bootstrap-ec2.sh
#
# Idempotent: safe to re-run.
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "Run with sudo." >&2; exit 1; }
TARGET_USER="${SUDO_USER:-ubuntu}"

# 1 GiB RAM is tight for an image build plus Node, nginx and Redis: add 2 GiB of swap.
if ! swapon --show | grep -q '^/swapfile'; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
fi
grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
echo 'vm.swappiness=10' > /etc/sysctl.d/99-rideback.conf
sysctl --system >/dev/null

# Docker Engine + Compose plugin.
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker
usermod -aG docker "$TARGET_USER"

# Unattended security updates.
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y unattended-upgrades git
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "Bootstrap complete. Log out and back in so '$TARGET_USER' can run docker without sudo."
