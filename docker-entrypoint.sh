#!/bin/sh

if [ -n "$EXTRA_PACKAGES" ]; then
  echo "Installing additional packages: $EXTRA_PACKAGES"
  apt-get update && apt-get install -y $EXTRA_PACKAGES && apt-get clean && rm -rf /var/lib/apt/lists/*
fi

exec npm start 