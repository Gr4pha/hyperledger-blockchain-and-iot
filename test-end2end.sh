#!/bin/bash

export START_TIMESTAMP=$(date +%s)

export SKIP_NET=0
# export SKIP_NET=1
export SKIP_NET_HLF=0
# export SKIP_NET_HLF=1

export SKIP_CC_INIT=0
# export SKIP_CC_INIT=1

# export SKIP_SCENAR=0
export SKIP_SCENAR=1
export SKIP_SCENAR_INIT=0
# export SKIP_SCENAR_INIT=1
export SKIP_SCENAR_DO=0
# export SKIP_SCENAR_DO=1


echo "> Machine settings..."
echo
echo ">>> Distrib:"
uname -a 2>/dev/null
echo
lsb_release -a 2>/dev/null
echo
echo ">>> Disk:"
df -h .
echo
echo ">>> RAM:"
free -h
echo
echo

if [ $SKIP_NET -eq 0 ]; then
    echo "> Removing old containers and old compiled stuffs..."
    npm run env:clean
    rm -Rf chaincode-*/ packages/authority-cc/dist/ packages/crossborder-cc/dist/ packages/dg-cc/dist/ packages/iot-cc/dist/ packages/msg-cc/dist/ packages/process-cc/dist/ packages/transport-cc/dist/ packages/warehouse-cc/dist/
    echo "OK"
    echo
    echo

    if [ $SKIP_NET_HLF -eq 0 ]; then
        echo "> Restarting the network..."
        # In case of keeping the default Hurley config:
        #npm run env:restart
        # In case of updating the default Hurley config:
		bash /home/$USER/hyperledger-fabric-network/restart.sh
        echo "OK"
        echo
        echo
    fi

    bash crawl-blockchain-weight.sh peer0.dgprovider.hurley.lab dgprovider ch-global orderer.hurley.lab 0 out--bc-weight--provider--0.csv
    bash crawl-blockchain-weight.sh peer0.dgtransporter.hurley.lab dgtransporter ch-global orderer.hurley.lab 0 out--bc-weight--transporter--0.csv

    echo "> Building and packaging chaincodes..."
    npm run lerna:build
    npm run cc:manager:packaging authority
    npm run cc:manager:packaging crossborder
    npm run cc:manager:packaging dg
    npm run cc:manager:packaging iot
    npm run cc:manager:packaging process
    npm run cc:manager:packaging transport
    npm run cc:manager:packaging warehouse
    echo "OK"
    echo
    echo

    echo "> Installing chaincodes..."
    hurl install -C ch-global -P ./chaincode-crossborder -o dgprovider -o dgreceiver -o dgtransporter -o localauthorityde -o localauthorityfr -o warehousede -o warehousefr -c '{"Args":["init", ""]}' crossborder node
    hurl install -C ch-global -P ./chaincode-dg -o dgprovider -o dgreceiver -o dgtransporter -o localauthorityde -o localauthorityfr -o warehousede -o warehousefr -c '{"Args":["init", ""]}' dg node
    hurl install -C ch-global -P ./chaincode-iot -o dgprovider -o dgreceiver -o dgtransporter -o localauthorityde -o localauthorityfr -o warehousede -o warehousefr -c '{"Args":["init", ""]}' iot node
    hurl install -C ch-global -P ./chaincode-process -o dgprovider -o dgreceiver -o dgtransporter -o localauthorityde -o localauthorityfr -o warehousede -o warehousefr -c '{"Args":["init", ""]}' process node
    hurl install -C ch-global -P ./chaincode-transport -o dgprovider -o dgreceiver -o dgtransporter -o localauthorityde -o localauthorityfr -o warehousede -o warehousefr -c '{"Args":["init", ""]}' transport node
    hurl install -C ch-de -P ./chaincode-authority -o localauthorityde -o warehousede -c '{"Args":["init", ""]}' authority node
    hurl install -C ch-de -P ./chaincode-warehouse -o localauthorityde -o warehousede -c '{"Args":["init", ""]}' warehouse node
    hurl install -C ch-fr -P ./chaincode-authority -o localauthorityfr -o warehousefr -c '{"Args":["init", ""]}' authority node
    hurl install -C ch-fr -P ./chaincode-warehouse -o localauthorityfr -o warehousefr -c '{"Args":["init", ""]}' warehouse node
    echo "OK"
    echo
    export END_TIMESTAMP=$(date +%s)
    export ELAPSED_TIME=$(($END_TIMESTAMP - $START_TIMESTAMP))
    echo "Elapsed time (network): $(TZ=UTC0 printf '%(%H:%M:%S)T\n' $ELAPSED_TIME)"
    echo
    echo
fi


if [ $SKIP_CC_INIT -eq 0 ]; then
    echo "> Invoking each chaincode to init them..."
    echo
    echo ">> dg-cc..."
    hurl invoke dg dg_get_all -C ch-global -o dgprovider -u User1
    hurl invoke dg dg_get_all -C ch-global -o dgreceiver -u User1
    hurl invoke dg dg_get_all -C ch-global -o dgtransporter -u User1
    hurl invoke dg dg_get_all -C ch-global -o localauthorityde -u User1
    hurl invoke dg dg_get_all -C ch-global -o localauthorityfr -u User1
    hurl invoke dg dg_get_all -C ch-global -o warehousede -u User1
    hurl invoke dg dg_get_all -C ch-global -o warehousefr -u User1
    echo
    echo ">> iot-cc..."
    hurl invoke iot iot_get_all -C ch-global -o dgprovider -u User1
    hurl invoke iot iot_get_all -C ch-global -o dgreceiver -u User1
    hurl invoke iot iot_get_all -C ch-global -o dgtransporter -u User1
    hurl invoke iot iot_get_all -C ch-global -o localauthorityde -u User1
    hurl invoke iot iot_get_all -C ch-global -o localauthorityfr -u User1
    hurl invoke iot iot_get_all -C ch-global -o warehousede -u User1
    hurl invoke iot iot_get_all -C ch-global -o warehousefr -u User1
    echo
    echo ">> process-cc..."
    hurl invoke process process_get_all -C ch-global -o dgprovider -u User1
    hurl invoke process process_get_all -C ch-global -o dgreceiver -u User1
    hurl invoke process process_get_all -C ch-global -o dgtransporter -u User1
    hurl invoke process process_get_all -C ch-global -o localauthorityde -u User1
    hurl invoke process process_get_all -C ch-global -o localauthorityfr -u User1
    hurl invoke process process_get_all -C ch-global -o warehousede -u User1
    hurl invoke process process_get_all -C ch-global -o warehousefr -u User1
    echo
    echo ">> transport-cc..."
    hurl invoke transport transport_get_all -C ch-global -o dgprovider -u User1
    hurl invoke transport transport_get_all -C ch-global -o dgreceiver -u User1
    hurl invoke transport transport_get_all -C ch-global -o dgtransporter -u User1
    hurl invoke transport transport_get_all -C ch-global -o localauthorityde -u User1
    hurl invoke transport transport_get_all -C ch-global -o localauthorityfr -u User1
    hurl invoke transport transport_get_all -C ch-global -o warehousede -u User1
    hurl invoke transport transport_get_all -C ch-global -o warehousefr -u User1
    echo
    echo ">> authority-cc..."
    hurl invoke authority authority_get_all -C ch-de -o localauthorityde -u User1
    hurl invoke authority authority_get_all -C ch-fr -o localauthorityfr -u User1
    echo
    echo ">> warehouse-cc..."
    hurl invoke warehouse warehouse_get_all -C ch-de -o warehousede -u User1
    hurl invoke warehouse warehouse_get_all -C ch-fr -o warehousefr -u User1
    echo
    echo ">> crossborder-cc..."
    hurl invoke crossborder crossborder_get_all -C ch-global -o dgprovider -u User1
    hurl invoke crossborder crossborder_get_all -C ch-global -o dgreceiver -u User1
    hurl invoke crossborder crossborder_get_all -C ch-global -o dgtransporter -u User1
    hurl invoke crossborder crossborder_get_all -C ch-global -o localauthorityde -u User1
    hurl invoke crossborder crossborder_get_all -C ch-global -o localauthorityfr -u User1
    hurl invoke crossborder crossborder_get_all -C ch-global -o warehousede -u User1
    hurl invoke crossborder crossborder_get_all -C ch-global -o warehousefr -u User1
    echo "Done"
    echo
    export END_TIMESTAMP=$(date +%s)
    export ELAPSED_TIME=$(($END_TIMESTAMP - $START_TIMESTAMP))
    echo "Elapsed time (cc init): $(TZ=UTC0 printf '%(%H:%M:%S)T\n' $ELAPSED_TIME)"
    echo
    echo
fi


bash crawl-blockchain-weight.sh peer0.dgprovider.hurley.lab dgprovider ch-global orderer.hurley.lab 0 out--bc-weight--provider--1.csv
bash crawl-blockchain-weight.sh peer0.dgtransporter.hurley.lab dgtransporter ch-global orderer.hurley.lab 0 out--bc-weight--transporter--1.csv


if [ $SKIP_SCENAR -eq 0 ]; then
    if [ $SKIP_SCENAR_INIT -eq 0 ]; then
        echo "> Defining objects for scenario..."
        echo
        echo ">> Creating Authorities objects..."
        export LADE_ID='auth_de_1'
        export LAFR_ID='auth_fr_1'
        export LADE='{"id": "'$LADE_ID'", "name": "Authority DE 001", "country": "DE"}'
        export LAFR='{"id": "'$LAFR_ID'", "name": "Authority FR 001", "country": "FR"}'
        hurl invoke authority authority_create "$LADE" -C ch-de -o localauthorityde -u User1
        hurl invoke authority authority_create "$LAFR" -C ch-fr -o localauthorityfr -u User1
        echo
        echo ">> Creating Warehouse objects..."
        export W_P='{"id": "w_de_1", "name": "Warehouse DE 001 (DGProducer)", "services": "{\"flammable\": 50, \"nuclear\": 35}", "inventory": "{\"flammable\": [], \"nuclear\": []}"}'
        export W_2='{"id": "w_de_2", "name": "Warehouse DE 002 (road stop)", "services": "{\"flammable\": 20, \"nuclear\": 20}", "inventory": "{\"flammable\": [], \"nuclear\": []}"}'
        export W_3='{"id": "w_fr_1", "name": "Warehouse FR 001 (road stop)", "services": "{\"flammable\": 15, \"nuclear\": 20}", "inventory": "{\"flammable\": [], \"nuclear\": []}"}'
        export W_R='{"id": "w_fr_2", "name": "Warehouse FR 002 (DGReceiver)", "services": "{\"flammable\": 20, \"nuclear\": 10}", "inventory": "{\"flammable\": [], \"nuclear\": []}"}'
        hurl invoke warehouse warehouse_create "$W_P" -C ch-de -o warehousede -u User1
        hurl invoke warehouse warehouse_create "$W_2" -C ch-de -o warehousede -u User1
        hurl invoke warehouse warehouse_create "$W_3" -C ch-fr -o warehousefr -u User1
        hurl invoke warehouse warehouse_create "$W_R" -C ch-fr -o warehousefr -u User1
        echo
        echo ">> Creating CrossBorder objects..."
        export CB_DE_ID="CB_DE2FR_1"
        export CB_FR_ID="CB_FR2DE_1"
        export CB_1='{"id": "'$CB_DE_ID'", "name": "Border DE to FR 001", "country": "DE", "country_out": "DE", "country_in": "FR"}'
        export CB_2='{"id": "'$CB_FR_ID'", "name": "Border FR to DE 001", "country": "FR", "country_out": "FR", "country_in": "DE"}'
        hurl invoke crossborder crossborder_create "$CB_1" -C ch-global -o localauthorityde -u User1
        hurl invoke crossborder crossborder_create "$CB_2" -C ch-global -o localauthorityfr -u User1
        echo
        echo ">> Creating DG objects..."
        export DG_1='{"id": "dg_1", "name": "DG 001", "labelling": "flammable"}'
        export DG_2='{"id": "dg_2", "name": "DG 002", "labelling": "flammable", "quantity": 2}'
        export DG_3='{"id": "dg_3", "name": "DG 003", "labelling": "nuclear"}'
        hurl invoke dg dg_create "$DG_1" -C ch-global -o dgprovider -u User1
        hurl invoke dg dg_create "$DG_2" -C ch-global -o dgprovider -u User1
        hurl invoke dg dg_create "$DG_3" -C ch-global -o dgprovider -u User1
        echo
        echo ">> Creating IoT objects..."
        export IOT_1='{"id": "iot_1", "name": "Device 1"}'
        export IOT_2='{"id": "iot_2", "name": "Device 2"}'
        export IOT_3='{"id": "iot_3", "name": "Device 3"}'
        hurl invoke iot iot_create "$IOT_1" -C ch-global -o dgprovider -u User1
        hurl invoke iot iot_create "$IOT_2" -C ch-global -o dgprovider -u User2
        hurl invoke iot iot_create "$IOT_3" -C ch-global -o dgprovider -u User1
        echo
        echo ">> Creating transport..."
        export TRANSPORT_ID='T_1'
        export TRANSPORT_1='{"id": "'$TRANSPORT_ID'", "goods": ["dg_1"], "iots": []}'
        hurl invoke dg dg_get_all -C ch-global -o dgtransporter -u User1
        hurl invoke iot iot_get_all -C ch-global -o dgtransporter -u User1
        hurl invoke transport transport_create "$TRANSPORT_1" -C ch-global -o dgtransporter -u User1
        echo "Done"
        echo
        export END_TIMESTAMP=$(date +%s)
        export ELAPSED_TIME=$(($END_TIMESTAMP - $START_TIMESTAMP))
        echo "Elapsed time (objs init): $(TZ=UTC0 printf '%(%H:%M:%S)T\n' $ELAPSED_TIME)"
        echo
        echo
    fi

    if [ $SKIP_SCENAR_DO -eq 0 ]; then
        echo
        echo "> Starting testing scenario..."
        echo
        echo ">> Creating Process object..."
        export PROCESS_ID="process_1"
        export RECEIVER_USER1=$(npm run user:fingerprint User1 dgreceiver | grep -v '> ' | tr -d '\n')
        export PROCESS_1='{"id": "'$PROCESS_ID'", "name": "object name", "goods": ["dg_1"], "iots": ["iot_1"], "receiver": "'$RECEIVER_USER1'"}'
        hurl invoke process process_initialize "$PROCESS_1" -C ch-global -o dgprovider -u User1
        echo
        echo ">> Scheduling the move..."
        export DEPARTURE_DATE='2029-12-05T13:51:16.101Z'
        export ARRIVAL_DATE='2029-12-08T10:30:00.000Z'
        hurl invoke process process_schedule_move "$PROCESS_ID" "$TRANSPORT_ID" "$DEPARTURE_DATE" "$ARRIVAL_DATE" -C ch-global -o dgprovider -u User1
        hurl invoke authority authority_notify_new_process "ar_1" "$LADE_ID" "$PROCESS_ID" "$TRANSPORT_ID" -C ch-de -o localauthorityde -u User1
        hurl invoke authority authority_notify_new_process "ar_2" "$LAFR_ID" "$PROCESS_ID" "$TRANSPORT_ID" -C ch-fr -o localauthorityfr -u User1
        echo
        echo ">> Authorizing the move..."
        hurl invoke authority authority_approve_process "$LADE_ID" "$PROCESS_ID" -C ch-de -o localauthorityde -u User1
        hurl invoke authority authority_approve_process "$LAFR_ID" "$PROCESS_ID" -C ch-fr -o localauthorityfr -u User1
        hurl invoke process process_approve "$PROCESS_ID" "$LADE_ID" -C ch-global -o localauthorityde -u User1
        hurl invoke process process_approve "$PROCESS_ID" "$LAFR_ID" -C ch-global -o localauthorityfr -u User1
        echo
        echo ">> Attaching IoTs for the move..."
        hurl invoke iot iot_attach_to_dg "iot_1" "dg_1" -C ch-global -o dgprovider -u User1
        hurl invoke iot iot_attach_to_transport "iot_2" "$TRANSPORT_ID" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Moving from DGProvider's Warehouse1 onto Warehouse2..."
        hurl invoke process process_move "$PROCESS_ID" "w_de_1" "w_de_2" -C ch-global -o dgtransporter -u User1
        hurl invoke transport transport_move "$TRANSPORT_ID" "w_de_1" "w_de_2" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Collecting data thanks to IoT..."
        hurl invoke iot iot_collect_location "iot_1" "Loc A" -C ch-global -o dgprovider -u User1
        hurl invoke iot iot_collect_location "iot_2" "Loc A" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Moving from Warehouse2 onto Warehouse3..."
        hurl invoke process process_move "$PROCESS_ID" "w_de_2" "w_fr_1" -C ch-global -o dgtransporter -u User1
        hurl invoke transport transport_move "$TRANSPORT_ID" "w_de_2" "w_fr_1" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Collecting data thanks to IoT..."
        hurl invoke iot iot_collect_location "iot_1" "Loc B" -C ch-global -o dgtransporter -u User1
        hurl invoke iot iot_collect_location "iot_2" "Loc B" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Crossing the border..."
        hurl invoke crossborder crossborder_get_all -C ch-global -o dgtransporter -u User1
        hurl invoke crossborder crossborder_cross "cbr_1" "$CB_DE_ID" "$TRANSPORT_ID" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Collecting data thanks to IoT..."
        hurl invoke iot iot_collect_location "iot_1" "Loc B'" -C ch-global -o dgtransporter -u User1
        hurl invoke iot iot_collect_location "iot_2" "Loc B'" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Moving from Warehouse3 onto DGReceiver's Warehouse4..."
        hurl invoke process process_move "$PROCESS_ID" "w_fr_1" "w_fr_2" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Collecting data thanks to IoT..."
        hurl invoke iot iot_collect_location "iot_1" "Loc C" -C ch-global -o dgtransporter -u User1
        hurl invoke iot iot_collect_location "iot_2" "Loc C" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Delivering DGs at Warehouse4, which ends the move..."
        hurl invoke process process_deliver "$PROCESS_ID" -C ch-global -o dgreceiver -u User1
        echo
        echo ">> Collecting data thanks to IoT..."
        hurl invoke iot iot_collect_location "iot_1" "Loc D" -C ch-global -o dgtransporter -u User1
        hurl invoke iot iot_collect_location "iot_2" "Loc D" -C ch-global -o dgtransporter -u User1
        echo
        echo ">> Detaching IoTs from the move..."
	hurl invoke dg dg_get_all -C ch-global -o dgreceiver -u User1
	hurl invoke iot iot_get_all -C ch-global -o dgreceiver -u User1
        hurl invoke iot iot_detach_from_transport "iot_2" "$TRANSPORT_ID" -C ch-global -o dgtransporter -u User1
        hurl invoke iot iot_detach_from_dg "iot_1" "dg_1" -C ch-global -o dgreceiver -u User1
        echo
        echo ">> Finalizing the process..."
        hurl invoke process process_finalize "$PROCESS_ID" -C ch-global -o dgreceiver -u User1
        echo
        echo ">> Retreiving data..."
        hurl invoke process process_get_all -C ch-global -o dgprovider -u User1
        hurl invoke transport transport_get_all -C ch-global -o dgtransporter -u User1
        hurl invoke warehouse warehouse_get_all -C ch-de -o warehousede -u User1
        hurl invoke warehouse warehouse_get_all -C ch-fr -o warehousefr -u User1
        hurl invoke crossborder crossborder_get_all -C ch-global -o localauthorityde -u User1
        hurl invoke crossborder crossborder_get_all -C ch-global -o localauthorityfr -u User1
        hurl invoke authority authority_get_all -C ch-de -o localauthorityde -u User1
        hurl invoke authority authority_get_all_records -C ch-de -o localauthorityde -u User1
        hurl invoke authority authority_get_all -C ch-fr -o localauthorityfr -u User1
        hurl invoke authority authority_get_all_records -C ch-fr -o localauthorityfr -u User1
        echo "Done"
        echo
        echo
        echo
    fi
fi

export END_TIMESTAMP=$(date +%s)
export ELAPSED_TIME=$(($END_TIMESTAMP - $START_TIMESTAMP))
echo "Total elapsed time: $(TZ=UTC0 printf '%(%H:%M:%S)T\n' $ELAPSED_TIME)"
# Note: this printf works with BASH, don't works with SH.

echo "> Machine status..."
echo
echo ">>> Disk:"
df -h .
echo
echo ">>> RAM:"
free -h
echo
echo

