#!/bin/bash

# disable the host key checking.
chmod o+x ./deploy/disableHostKeyChecking.sh
./deploy/disableHostKeyChecking.sh

# write public key for instance
eval $(ssh-agent -s)

if [ "$CI_ENVIRONMENT_NAME" = "prod" ]
then
  DEPLOY_SERVER_HOST=$PROD_HOST;
  DEPLOY_SERVER_PORT=${PROD_PORT:-22}
  DEPLOY_DIRECTORY=$PROD_DEPLOY_DIRECTORY
  DEPLOY_PRIVATE_KEY=$PROD_PRIVATE_KEY
  DEPLOY_USER=$PROD_USER
elif [ "$CI_ENVIRONMENT_NAME" = "staging" ]
then
  DEPLOY_SERVER_HOST=$STAGING_HOST
  DEPLOY_SERVER_PORT=${STAGING_PORT:-22}
  DEPLOY_DIRECTORY=$STAGING_DEPLOY_DIRECTORY
  DEPLOY_PRIVATE_KEY=$STAGING_PRIVATE_KEY
  DEPLOY_USER=$STAGING_USER
else
  DEPLOY_SERVER_HOST=$DEV_PREVIEW_HOST
  DEPLOY_SERVER_PORT=${DEV_PREVIEW_PORT:-22}
  DEPLOY_DIRECTORY=$DEV_DEPLOY_DIRECTORY
  DEPLOY_PRIVATE_KEY=$DEV_PREVIEW_PRIVATE_KEY
  DEPLOY_USER=$DEV_PREVIEW_USER
fi

FILE_NAME=$CI_COMMIT_SHORT_SHA.tar.gz
rm -rf build/cache
tar -zcf $FILE_NAME build server node_modules babel.config.js .env.example next.config.js  alias-config.js package.json 

echo 'Tar file created'

chmod 400 $DEPLOY_PRIVATE_KEY

# copy to remote server
ssh -p $DEPLOY_SERVER_PORT -i $DEPLOY_PRIVATE_KEY $DEPLOY_USER@$DEPLOY_SERVER_HOST "mkdir /tmp/fe-build"
scp -P $DEPLOY_SERVER_PORT -i $DEPLOY_PRIVATE_KEY $FILE_NAME $DEPLOY_USER@$DEPLOY_SERVER_HOST:/tmp/fe-build/

# update script
sed -i -e 's/__PACKAGE__/'"$FILE_NAME"'/' ./deploy/update.sh
sed -i -e 's@__DIRECTORY__@'"$DEPLOY_DIRECTORY"'@' ./deploy/update.sh

# cat ./deploy/update.sh

# remote deploy
echo 'Remote Deploy'
ssh -p $DEPLOY_SERVER_PORT -i $DEPLOY_PRIVATE_KEY $DEPLOY_USER@$DEPLOY_SERVER_HOST 'bash' < ./deploy/update.sh
