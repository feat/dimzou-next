if [ "$CI_COMMIT_REF_NAME" = "master" ] 
then 
    export GA_CODE=${PROD_GA_CODE};
elif [ "$CI_COMMIT_REF_NAME" = "develop" ]
then
    export GA_CODE=${DEV_GA_CODE};
fi