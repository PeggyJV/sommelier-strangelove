#! /bin/bash
if [ -z "$MAXMIND_KEY" ]
then
  echo "Missing Maxmind License Key, please set it via export MAXMIND_KEY=<your license key>"
else
  echo "Downloading the maxmind database"
  wget "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$MAXMIND_KEY&suffix=tar.gz" -O maxmind.tar.gz
  mkdir -p maxmind
  tar -xf maxmind.tar.gz -C ./maxmind --strip 1
fi
