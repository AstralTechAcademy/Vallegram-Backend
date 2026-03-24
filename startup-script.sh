#!/bin/bash

# Install dependencies from apt
apt-get update
apt-get install -yq nodejs npm git

# Get the application source code from the Google Cloud Storage bucket.
git clone https://github.com/AstralTechAcademy/Vallegram-Backend.git /vallegram-backend/

# Install app dependencies.
cd /vallegram-backend/
npm install

gsutil cp gs://vallegram-startup/.env .env