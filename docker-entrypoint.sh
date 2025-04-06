#!/bin/sh

if [ -n "$EXTRA_PACKAGES" ]; then
  echo "Installing additional packages: $EXTRA_PACKAGES"
  apk add --no-cache $EXTRA_PACKAGES
fi

exec npm start 