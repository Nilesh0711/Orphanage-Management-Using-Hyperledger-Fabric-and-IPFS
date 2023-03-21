# function delay()
# {
#     sleep 0.2;
# }

# #
# # Description : print out executing progress
# # 
# CURRENT_PROGRESS=0
# function progress()
# {
#     PARAM_PROGRESS=$1;
#     PARAM_PHASE=$2;

#     if [ $CURRENT_PROGRESS -le 0 -a $PARAM_PROGRESS -ge 0 ]  ; then echo -ne "[..........................] (0%)  $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 5 -a $PARAM_PROGRESS -ge 5 ]  ; then echo -ne "[#.........................] (5%)  $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 10 -a $PARAM_PROGRESS -ge 10 ]; then echo -ne "[##........................] (10%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 15 -a $PARAM_PROGRESS -ge 15 ]; then echo -ne "[###.......................] (15%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 20 -a $PARAM_PROGRESS -ge 20 ]; then echo -ne "[####......................] (20%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 25 -a $PARAM_PROGRESS -ge 25 ]; then echo -ne "[#####.....................] (25%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 30 -a $PARAM_PROGRESS -ge 30 ]; then echo -ne "[######....................] (30%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 35 -a $PARAM_PROGRESS -ge 35 ]; then echo -ne "[#######...................] (35%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 40 -a $PARAM_PROGRESS -ge 40 ]; then echo -ne "[########..................] (40%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 45 -a $PARAM_PROGRESS -ge 45 ]; then echo -ne "[#########.................] (45%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 50 -a $PARAM_PROGRESS -ge 50 ]; then echo -ne "[##########................] (50%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 55 -a $PARAM_PROGRESS -ge 55 ]; then echo -ne "[###########...............] (55%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 60 -a $PARAM_PROGRESS -ge 60 ]; then echo -ne "[############..............] (60%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 65 -a $PARAM_PROGRESS -ge 65 ]; then echo -ne "[#############.............] (65%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 70 -a $PARAM_PROGRESS -ge 70 ]; then echo -ne "[###############...........] (70%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 75 -a $PARAM_PROGRESS -ge 75 ]; then echo -ne "[#################.........] (75%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 80 -a $PARAM_PROGRESS -ge 80 ]; then echo -ne "[####################......] (80%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 85 -a $PARAM_PROGRESS -ge 85 ]; then echo -ne "[#######################...] (85%) $PARAM_PHASE \r"  ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 90 -a $PARAM_PROGRESS -ge 90 ]; then echo -ne "[##########################] (100%) $PARAM_PHASE \r" ; delay; fi;
#     if [ $CURRENT_PROGRESS -le 100 -a $PARAM_PROGRESS -ge 100 ]; then echo -ne "Network is up and running $PARAM_PHASE \n" ; delay; fi;

#     CURRENT_PROGRESS=$PARAM_PROGRESS;

# }


# echo "The task is in progress, please wait a few seconds"

# progress 0 "Start Network Up              "


# progress 10 "Removing All docker container"
# docker rm -vf $(docker ps -aq) &> /dev/null
# cd ${PWD}/artifacts/channel/


# progress 15 "Removing redudant files      "
# sudo rm -rf crypto-config/
# sudo rm -rf genesis.block
# sudo rm -rf mychannel.tx
# sudo rm -rf Org1MSPanchors.tx
# sudo rm -rf Org2MSPanchors.tx
# cd create-certificate-with-ca
# sleep 1

# progress 20 "Removing fabric ca           "
# sudo rm -rf fabric-ca/
# sleep 1
# docker-compose up -d &> /dev/null
# sleep 1


# progress 30 "creating fabric ca           "
# ./create-certificate-with-ca.sh &> /dev/null
# cd ../
# sleep 1


# progress 40 "creating channel aritfact    "
# ./create-artifacts.sh &> /dev/null
# cd ../
# sleep 1
# docker-compose up -d &> /dev/null
# cd ../
# sleep 1


# progress 50 "create channel               "
# ./createChannel.sh &> /dev/null
# sleep 1


# progress 60 "deploying orphanage chaincode"
# ./deployOrphanChaincode.sh &> /dev/null
# sleep 1


# progress 70 "deploying doctor chaincode   "
# ./deployDoctorChaincode.sh &> /dev/null
# sleep 1


# progress 80 "Removing wallet for org1     "
# cd api
# sudo rm -rf org1-wallet
# sleep 1


# progress 85 "Removing wallet for org2     "
# sudo rm -rf org2-wallet
# sleep 1


# progress 90 "generating CCP Profiles      "
# cd config
# ./generate-ccp.sh &> /dev/null
# cd ../
# sleep 1


# progress 100 "                            "
# npm start



echo
echo "**************************************************************"
echo "########   Start Network Up    #############"
echo "**************************************************************"
echo
echo
echo "**************************************************************"
echo "Removing All docker containers"
echo "**************************************************************"
echo
docker rm -vf $(docker ps -aq)
cd ${PWD}/artifacts/channel/

echo
echo "**************************************************************"
echo "Removing crypto-config genesis mychannel and anchors"
echo "**************************************************************"
echo

sudo rm -rf crypto-config/
sudo rm -rf genesis.block
sudo rm -rf mychannel.tx
sudo rm -rf Org1MSPanchors.tx
sudo rm -rf Org2MSPanchors.tx

cd create-certificate-with-ca
sleep 1
echo
echo "**************************************************************"
echo "Removing fabric ca"
echo "**************************************************************"
echo

sudo rm -rf fabric-ca/
sleep 1
docker-compose up -d

sleep 1
echo
echo "**************************************************************"
echo "creating fabric ca"
echo "**************************************************************"
echo
./create-certificate-with-ca.sh

cd ../
sleep 1
echo
echo "**************************************************************"
echo "creating channel aritfacts"
echo "**************************************************************"
echo
./create-artifacts.sh
cd ../
sleep 1
docker-compose up -d
cd ../
sleep 1
echo
echo "**************************************************************"
echo "create channel"
echo "**************************************************************"
echo
./createChannel.sh
sleep 1
echo
echo "**************************************************************"
echo "deploy chaincode for orphanage"
echo "**************************************************************"
echo
./deployOrphanChaincode.sh
sleep 1

echo
echo "**************************************************************"
echo "deploy chaincode for doctor"
echo "**************************************************************"
echo
./deployDoctorChaincode.sh
sleep 1

echo
echo "**************************************************************"
echo "deploy chaincode for parent"
echo "**************************************************************"
echo
./deployParentChaincode.sh
sleep 1

echo
echo "Removing wallets"
echo
cd api
sudo rm -rf org1-wallet
sudo rm -rf org2-wallet
sleep 1

echo 
echo "CCP Profiles"
echo

cd config
./generate-ccp.sh

cd ../
sleep 1

echo
echo "**************************************************************"
echo "starting server"
echo "**************************************************************"
echo
npm start

echo
echo "**************************************************************"
echo "########   Network Up   #############"
echo "**************************************************************"
echo
