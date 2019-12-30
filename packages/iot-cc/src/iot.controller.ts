import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { InChaincodeAdapter } from '@worldsibu/convector-adapter-fabric-in-chaincode';

import { IoT, IoTAttachment } from './iot.model';

const adapter = new InChaincodeAdapter();



@Controller('iot')
export class IoTController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async create(
    @Param(IoT)
    iot: IoT
  ) {
    let is_existing = (await IoT.getOne(iot.id)).id;
    if(!!is_existing)
      throw new Error("IoT with id "+iot.id+" is already existing.");
    await iot.save();
  }

  @Invokable()
  public async attach_to_dg(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string())
    dg_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    if(iot.is_attached != IoTAttachment.NOT_ATTACHED)
      throw new Error("IoT with id "+iot_id+" already attached to '"+iot.attached_to+"'.");
    try{
      let r = await adapter.rawInvoke("dg_get", { tx: this.tx, channel: "ch-global", chaincode: 'dg' }, dg_id);
      let dg = r.result;
      if(!dg._id)
        throw new Error("DG with id '"+dg_id+"' doesn't exist.");
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    iot.is_attached = IoTAttachment.ATTACHED_TO_DG;
    iot.attached_to = dg_id;
    await iot.save();
  }

  @Invokable()
  public async detach_from_dg(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string())
    dg_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    if(iot.is_attached == IoTAttachment.NOT_ATTACHED)
      throw new Error("IoT with id "+iot_id+" already not attached.");
    try{
      let r = await adapter.rawInvoke("dg_get", { tx: this.tx, channel: "ch-global", chaincode: 'dg' }, dg_id);
      let dg = r.result;
      if(!dg._id || iot.attached_to != dg_id)
        throw new Error("DG with id '"+dg_id+"' not valid.");
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    iot.is_attached = IoTAttachment.NOT_ATTACHED;
    iot.attached_to = undefined;
    await iot.save();
  }

  @Invokable()
  public async attach_to_transport(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string())
    transport_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    if(iot.is_attached != IoTAttachment.NOT_ATTACHED)
      throw new Error("IoT with id "+iot_id+" already attached to '"+iot.attached_to+"'.");
    try{
      let r = await adapter.rawInvoke("transport_get", { tx: this.tx, channel: "ch-global", chaincode: 'transport' }, transport_id);
      let transport = r.result;
      if(!transport._id)
        throw new Error("Transport with id '"+transport_id+"' doesn't exist.");
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    iot.is_attached = IoTAttachment.ATTACHED_TO_TRANSPORT;
    iot.attached_to = transport_id;
    await iot.save();
  }

  @Invokable()
  public async detach_from_transport(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string())
    transport_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    if(iot.is_attached == IoTAttachment.NOT_ATTACHED)
      throw new Error("IoT with id "+iot_id+" already not attached.");
    try{
      let r = await adapter.rawInvoke("transport_get", { tx: this.tx, channel: "ch-global", chaincode: 'transport' }, transport_id);
      let transport = r.result;
      if(!transport._id || iot.attached_to != transport_id)
        throw new Error("Transport with id '"+transport_id+"' not valid.");
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    iot.is_attached = IoTAttachment.NOT_ATTACHED;
    iot.attached_to = undefined;
    await iot.save();
  }

  @Invokable()
  public async attach_to_warehouse(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string())
    warehouse_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    if(iot.is_attached != IoTAttachment.NOT_ATTACHED)
    throw new Error("IoT with id "+iot_id+" already attached to '"+iot.attached_to+"'.");
    try{
      let r = await adapter.rawInvoke("warehouse_get", { tx: this.tx, channel: "ch-global", chaincode: 'warehouse' }, warehouse_id);
      let warehouse = r.result;
      if(!warehouse._id)
        throw new Error("Warehouse with id '"+warehouse_id+"' doesn't exist.");
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    iot.is_attached = IoTAttachment.ATTACHED_TO_WAREHOUSE;
    iot.attached_to = warehouse_id;
    await iot.save();
  }

  @Invokable()
  public async detach_from_warehouse(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string())
    warehouse_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    if(iot.is_attached == IoTAttachment.NOT_ATTACHED)
      throw new Error("IoT with id "+iot_id+" already not attached.");
    try{
      let r = await adapter.rawInvoke("warehouse_get", { tx: this.tx, channel: "ch-global", chaincode: 'warehouse' }, warehouse_id);
      let warehouse = r.result;
      if(!warehouse._id || iot.attached_to != warehouse_id)
        throw new Error("Warehouse with id '"+warehouse_id+"' not valid.");
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    iot.is_attached = IoTAttachment.NOT_ATTACHED;
    iot.attached_to = undefined;
    await iot.save();
  }

  @Invokable()
  public async get_location(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    return iot.geo_location.pop();
  }

  @Invokable()
  public async get_location_historic(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    return iot.geo_location;
  }

  @Invokable()
  public async collect_location(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string().min(1))
    new_location: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    // TODO check that user sending the tx is an IoT device user
    // TODO check location is valid (stringified GPS format)
    iot.geo_location.push(new_location);
    await iot.save();
  }

  @Invokable()
  public async get_humidity(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    return iot.humidity.pop();
  }

  @Invokable()
  public async get_humidity_historic(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    return iot.humidity;
  }

  @Invokable()
  public async collect_humidity(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string().min(1))
    new_humidity: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    // TODO check that user sending the tx is an IoT device user
    // TODO check location is valid (stringified GPS format)
    iot.humidity.push(new_humidity);
    await iot.save();
  }

  @Invokable()
  public async get_temperature(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    return iot.temperature.pop();
  }

  @Invokable()
  public async get_temperature_historic(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    return iot.temperature;
  }

  @Invokable()
  public async collect_temperature(
    @Param(yup.string())
    iot_id: string,
    @Param(yup.string().min(1))
    new_temperature: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    // TODO check that user sending the tx is an IoT device user
    // TODO check location is valid (stringified GPS format)
    iot.temperature.push(new_temperature);
    await iot.save();
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    console.log(Object.keys(iot))
    return iot;
  }

  @Invokable()
  public async get_all() {
    return await IoT.getAll();
  }

  @Invokable()
  public async get_tx_history(
    @Param(yup.string())
    iot_id: string
  ) {
    let iot = await IoT.getOne(iot_id);
    let is_existing = iot.id;
    if(!is_existing)
      throw new Error("IoT with id "+iot_id+" doesn't exist.");
    return await this.tx.stub.getHistoryForKeyAsList(iot_id);
  }

}
