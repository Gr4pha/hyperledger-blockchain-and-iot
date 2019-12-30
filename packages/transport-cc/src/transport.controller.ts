import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param,
  ClientFactory
} from '@worldsibu/convector-core';
import { InChaincodeAdapter } from '@worldsibu/convector-adapter-fabric-in-chaincode';

import { Transport } from './transport.model';

const adapter = new InChaincodeAdapter();



@Controller('transport')
export class TransportController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async create(
    @Param(Transport)
    transport: Transport
  ) {
    if(this.tx.identity.getMSPID() != "dgtransporterMSP")
      throw new Error("Only transporters can create Transports.");
    let is_existing = (await Transport.getOne(transport.id)).id;
    if(!!is_existing)
      throw new Error("Transport with id "+transport.id+" is already existing.");
    
    let channel = this.tx.stub.getStub().getChannelID();
    try{
      let dgs = await adapter.rawInvoke("dg_get_all", { tx: this.tx, channel: channel, chaincode: 'dg' });
      let dg_ids = dgs.result.map(dg => dg._id);
      let iots = await adapter.rawInvoke("iot_get_all", { tx: this.tx, channel: channel, chaincode: 'iot' });
      let iot_ids = iots.result.map(iot => iot._id);

      for(let i=0 ; i<transport.goods.length ; i++){
        let dg_id = transport.goods[i];
        let is_existing = dg_ids.includes(dg_id);
        if(!is_existing)
          throw new Error("Dangerous Good with id "+dg_id+" doesn't exist.");
      }
      for(let i=0 ; i<transport.iots.length ; i++){
        let iot_id = transport.iots[i];
        let is_existing = iot_ids.includes(iot_id);
        if(!is_existing)
          throw new Error("IoT with id "+iot_id+" doesn't exist.");
      }
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    transport.moving_steps = new Array();

    await transport.save();
  }

  @Invokable()
  public async move(
    @Param(yup.string())
    transport_id: string,
    @Param(yup.string())
    from: string,               // from / to => geo_location GPS ??? Warehouse ID ??? CURRENTLY warehouse_id !
    @Param(yup.string())
    to: string
  ) {
    let transport = await Transport.getOne(transport_id);
    let is_existing = transport.id;
    if(!is_existing)
      throw new Error("Transport with id "+transport_id+" doesn't exist.");
    
    transport.moving_steps.push(JSON.stringify({
      from: from,
      to: to,
      date: this.tx.stub.getTxDate().toISOString()
    }));

    await transport.save();
  }

  @Invokable()
  public async get_location(
    @Param(yup.string())
    transport_id: string
  ) {
    let transport = await Transport.getOne(transport_id);
    let is_existing = transport.id;
    if(!is_existing)
      throw new Error("Transport with id "+transport_id+" doesn't exist.");
    return transport.geo_location;
  }

  @Invokable()
  public async update_location(
    @Param(yup.string())
    transport_id: string,
    @Param(yup.string().min(1))
    new_location: string
  ) {
    let transport = await Transport.getOne(transport_id);
    let is_existing = transport.id;
    if(!is_existing)
      throw new Error("Transport with id "+transport_id+" doesn't exist.");
    // TODO check that user sending the tx is an DGTransporter user
    // TODO check location is valid (stringified GPS format)
    transport.geo_location = new_location;
    await transport.save();
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    transport_id: string
  ) {
    let transport = await Transport.getOne(transport_id);
    let is_existing = transport.id;
    if(!is_existing)
      throw new Error("Transport with id "+transport_id+" doesn't exist.");
    return transport;
  }

  @Invokable()
  public async get_all() {
    return await Transport.getAll();
  }

  @Invokable()
  public async get_tx_history(
    @Param(yup.string())
    transport_id: string
  ) {
    let transport = await Transport.getOne(transport_id);
    let is_existing = transport.id;
    if(!is_existing)
      throw new Error("Transport with id "+transport_id+" doesn't exist.");
    return await this.tx.stub.getHistoryForKeyAsList(transport_id);
  }

}
