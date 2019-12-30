#!/bin/bash

# Inputs:
#     PEER → Peer to connect to crawl
#     ORG → Organization whose PEER belongs
#     CHANNEL → Channel whose ledger is considered
#     ORDERER → Orderer empowered for the channel
#     N → Skip N first blocks (default 0)
#     OUTPUT_FILENAME → Name of the output file (not a path, and csv extension)
# Do:
#     Crawl all blockchain blocks of the ledger over the given channel.
#     Calculate the size of each block, and total size (blockchain weight).
# Outputs:
#     CSV file

if [ "$#" -ne 6 ]; then
    echo "Invalid inputs arguments."
    exit 2
fi

export PEER="$1"                                        # e.g. "peer0.org1.hurley.lab"
export ORG="$2"                                         # e.g. "org1"
export CHANNEL="$3"                                     # e.g. "ch-global"
export ORDERER="$4"                                     # e.g. "orderer.hurley.lab"
export N0="$5"                                          # e.g. "3" (default 0)
export OUTPUT_FILENAME="$6"                             # e.g. "out-bc-weight.csv"
export HLF_BIN_PATH="/home/$(whoami)/hyperledger-fabric-network/fabric-binaries/1.4.0/bin"
export PRJCT_PATH="/home/$(whoami)/bc_and_iot/out-stats/"
export OUTPUT_FILEPATH="/home/$(whoami)/bc_and_iot/out-stats/$OUTPUT_FILENAME"

export DOCKER_EXEC="docker exec -it $PEER"
export CSV_HEADER="BlockID;RawBlockSize(B);JsonBlockSize(B);NbTxStoredInBlock"
export RM_BLOCKS="rm -f *.block && rm -f *.block.json"
export DOCKER_FETCH_CHANNEL_INFO="$DOCKER_EXEC peer channel getinfo -c $CHANNEL -o $ORDERER"
export DOCKER_CP="docker cp $PEER:/opt/gopath/src/github.com/hyperledger/fabric"


cd $PRJCT_PATH
export Tstart=$(python3 -c "import time; print(int(time.time()))")


echo "→ Crawling general data..."
export TOTAL_BLOCK=$($DOCKER_FETCH_CHANNEL_INFO | grep "Blockchain info:" | cut -d ' ' -f 3 | jq .height)
echo "Total blocks count: $TOTAL_BLOCK"
export N_BLOCK=$(($TOTAL_BLOCK - $N0))
echo "Delta blocks count: $N_BLOCK"
echo "← Done."
echo 


echo "→ Initialize output file..."
echo "" > $OUTPUT_FILEPATH
echo "Date: $(date -Idate)" >> $OUTPUT_FILEPATH
echo "NbTotalBlocks: $TOTAL_BLOCK" >> $OUTPUT_FILEPATH
echo "FirstBlocksSkipped: $N0" >> $OUTPUT_FILEPATH
echo "NbBlocks: $N_BLOCK" >> $OUTPUT_FILEPATH
echo "" >> $OUTPUT_FILEPATH
echo "" >> $OUTPUT_FILEPATH
echo "" >> $OUTPUT_FILEPATH
echo "$CSV_HEADER" >> $OUTPUT_FILEPATH
echo "← Done."
echo 


echo "→ Crawling blocks..."
for ((i=$N0;i<$TOTAL_BLOCK;i++))
do
	export BLOCK_NAME="$(echo $i).block"
	export DOCKER_FETCH_BLOCK="$DOCKER_EXEC peer channel fetch $i $BLOCK_NAME -c $CHANNEL -o $ORDERER"
	$DOCKER_FETCH_BLOCK 2>/dev/null > /dev/null

	export DOCKER_GET_BLOCK="$DOCKER_CP/$BLOCK_NAME $BLOCK_NAME"
	$DOCKER_GET_BLOCK 2>/dev/null > /dev/null

	cd $HLF_BIN_PATH
    export JSON_BLOCK_NAME="$(echo $BLOCK_NAME).json"
	export BLOCK_TO_JSON="./configtxlator proto_decode --type=common.Block --input=$(echo $PRJCT_PATH)/$(echo $BLOCK_NAME) --output=$(echo $PRJCT_PATH)/$(echo $JSON_BLOCK_NAME)"
	$BLOCK_TO_JSON 2>/dev/null > /dev/null

	cd $PRJCT_PATH
	export NB_TX_IN_BLOCK=$(jq '.data.data | length' $(echo $PRJCT_PATH)/$(echo $BLOCK_NAME).json)
    # timestamp of the tx → jq '.data.data.payload.header.channel_header.timestamp
    export RAW_BLOCK_SIZE="$(du -b $PRJCT_PATH/$BLOCK_NAME | cut -f 1)"
    export JSON_BLOCK_SIZE="$(du -b $PRJCT_PATH/$JSON_BLOCK_NAME | cut -f 1)"

    echo "$i;$RAW_BLOCK_SIZE;$JSON_BLOCK_SIZE;$NB_TX_IN_BLOCK" >> $OUTPUT_FILEPATH
done
echo "← Done."
echo 


echo "→ Removing blocks..."
$RM_BLOCKS 2>/dev/null > /dev/null
echo "← Done."
echo 


export Tdiff=$(echo $Tstart | python3 -c "import sys, time; print(int(time.time()) - int([l for l in sys.stdin][0]))")
export TdiffMin=$(echo $Tdiff | python3 -c 'import sys; print(int(int([l for l in sys.stdin][0]) / 60))')
echo "----------------------------------------------------"
echo "[IN]"
echo "Peer: $PEER"
echo "Org: $ORG"
echo "Channel: $CHANNEL"
echo "Orderer: $ORDERER"
echo "Skipped blocks: $N0"
echo "HLF path: $HLF_BIN_PATH"
echo "Project path: $PRJCT_PATH"
echo "----------------------------------------------------"
echo "[OUT]"
echo "Results: $OUTPUT_FILEPATH"
echo "----------------------------------------------------"
echo "Time spent (s): $Tdiff"
echo "Time spent (min): $TdiffMin"
echo "----------------------------------------------------"
echo "Finished."
echo 


