import { join, resolve } from "path";
import { keyStore, identityName, channel, chaincode, networkProfile, identityId } from './env';
import * as fs from 'fs';
import { FabricControllerAdapter } from '@worldsibu/convector-adapter-fabric';
import { ClientFactory } from '@worldsibu/convector-core';
import { AuthorityController } from 'authority-cc';
import { CrossBorderController } from 'crossborder-cc';
import { DGController } from 'dg-cc';
import { IoTController } from 'iot-cc';
import { ProcessController } from 'process-cc';
import { TransportController } from 'transport-cc';
import { WarehouseController } from 'warehouse-cc';

console.log("Chan: "+channel+" "+chaincode+" "+identityName+" "+keyStore+" "+networkProfile);
const adapter = new FabricControllerAdapter({
    txTimeout: 300000,
    user: identityName,
    channel,
    chaincode,
    keyStore: resolve(__dirname, keyStore),
    networkProfile: resolve(__dirname, networkProfile)
    // userMspPath: keyStore
});

export const initAdapter = adapter.init();


export const AuthorityControllerBackEnd =  ClientFactory(AuthorityController, adapter);
export const CrossBorderControllerBackEnd = ClientFactory(CrossBorderController, adapter);
export const DGControllerBackEnd = ClientFactory(DGController, adapter);
export const IoTControllerBackEnd = ClientFactory(IoTController, adapter);
export const ProcessControllerBackEnd = ClientFactory(ProcessController, adapter);
export const TransportControllerBackEnd = ClientFactory(TransportController, adapter);
export const WarehouseControllerBackEnd = ClientFactory(WarehouseController, adapter);


const contextPath = join(keyStore + '/' + identityName);
fs.readFile(contextPath, 'utf8', async function (err, data) {
    if (err) {
        throw new Error('Context in ' + contextPath 
        + ' does not exist. Make sure that path resolves to your key stores folder');
    } else {
        console.log('Context path with cryptographic materials exists');
    }
});

    
