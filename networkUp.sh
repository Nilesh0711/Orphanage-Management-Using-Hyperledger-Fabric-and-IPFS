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
echo "deploy chaincode"
echo "**************************************************************"
echo
./deployChaincode.sh
sleep 1
echo
echo "**************************************************************"
echo "########   Network Up  Generate CCP in API  #############"
echo "**************************************************************"
echo