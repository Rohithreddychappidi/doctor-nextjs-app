#!/bin/bash
# JVM Medical Services - Automated Daily Backblaze B2 Backup Runner
# Usage:
# Run manually: ./scripts/backup-to-backblaze.sh
# Cron entry (daily at 2:00 AM UTC):
# 0 2 * * * cd /home/rohith-reddy/Downloads/doctor-nextjs-app && ./scripts/backup-to-backblaze.sh >> /var/log/jvm-backup.log 2>&1

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo " Starting JVM Medical Services Daily Backup: $(date)"
echo " Workspace: $DIR"
echo "=========================================================="

# Export variables from .env.local if present
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | xargs -d '\n')
fi

# Run Node.js Backup Engine
node scripts/backup-to-b2.mjs

echo " Finished Backup at: $(date)"
echo "=========================================================="
