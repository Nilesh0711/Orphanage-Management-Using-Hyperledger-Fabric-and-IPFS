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