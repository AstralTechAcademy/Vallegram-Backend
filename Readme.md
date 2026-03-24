# Vallegram backend environment on GCP and Azure

## GCP

### Prepare startup-script.sh

```
#!/bin/bash

# Install dependencies from apt
apt-get update
apt-get install -yq nodejs npm git

# Get the application source code from the Google Cloud Storage bucket.
git clone https://github.com/AstralTechAcademy/Vallegram-Backend.git /vallegram-backend/

# Install app dependencies.
cd vallegram-backend/
npm install

# Create a nodeapp user. The application will run as this user.
useradd -m -d /home/nodeapp nodeapp
chown -R nodeapp:nodeapp /opt/app

# Configure supervisor to run the node app.
cat >/etc/supervisor/conf.d/node-app.conf << EOF
[program:nodeapp]
directory=/vallegram-backend
command=npm start
autostart=true
autorestart=true
user=nodeapp
environment=HOME="/home/nodeapp",USER="nodeapp",NODE_ENV="production"
stdout_logfile=syslog
stderr_logfile=syslog
EOF

supervisorctl reread
supervisorctl update
```


### Create compute engine instance

```
gcloud compute instances create <VM_NAME> \
   --machine-type=e2-small \
   --zone=europe-southwest1-a \ 
   --tags=node-backend \
   --metadata=startup-script-url=https://github.com/AstralTechAcademy/Vallegram-Backend/blob/main/startup-script.sh
```

### Open firewall port to instance

```
gcloud compute firewall-rules create fw-fe \
    --allow tcp:3000 \
    --target-tags=backend
```

## Azure
