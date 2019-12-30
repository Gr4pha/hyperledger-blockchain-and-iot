import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import { InChaincodeAdapter } from '@worldsibu/convector-adapter-fabric-in-chaincode';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Warehouse, DGType } from './warehouse.model';
import { enum_to_array } from './utils'

const adapter = new InChaincodeAdapter();



@Controller('warehouse')
export class WarehouseController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async is_able_to_store_dgs(
    @Param(yup.string().min(1))
    warehouse_id: string,
    @Param(yup.string().min(1))
    process_id: string
  ) {
    let warehouse = await Warehouse.getOne(warehouse_id);
    let is_existing = warehouse.id;
    if(!is_existing)
      throw new Error("Warehouse with id "+warehouse_id+" doesn't exist.");

    // checking warehouse capability to receive and store DGs
    try{
      let process = await adapter.rawInvoke("process_get", { tx: this.tx, channel: "ch-global", chaincode: 'process' }, process_id);
      let dgs = process.result.goods;
      for(let dg_id in dgs){
        let dg = await adapter.rawInvoke("dg_get", { tx: this.tx, channel: "ch-global", chaincode: 'dg' }, dg_id);
        let label = dg.result.labelling;
        let quantity = dg.result.quantity;
        let services = JSON.parse(warehouse.services);
        if(!(label in services)){
          console.log("Warehouse with id "+warehouse_id+" doesn't have such '"+label+"' service.");
          return false; 
        }
        if(services[label] - quantity < 0){
          console.log("Warehouse with id "+warehouse_id+" doesn't have remaining place for that DG.");
          return false; 
        }
      }
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    return true;
  }

  @Invokable()
  public async create(
    @Param(Warehouse)
    warehouse: Warehouse
  ) {
    if(this.tx.identity.getMSPID() != "warehousedeMSP"
        && this.tx.identity.getMSPID() != "warehousefrMSP")
      throw new Error("Only warehouse owners can initialize Warehouses.");
    let is_existing = (await Warehouse.getOne(warehouse.id)).id;
    if(!!is_existing)
      throw new Error("Warehouse with id "+warehouse.id+" is already existing.");
    try{
      let S = JSON.parse(warehouse.services);
      let I = JSON.parse(warehouse.inventory);
      await yup.array().of(yup.string().oneOf(enum_to_array(DGType))).validate(Object.keys(S));
      await yup.array().of(yup.string().oneOf(enum_to_array(DGType))).validate(Object.keys(I));
    } catch(e) {
      throw new Error("Fail in parsing JSON service and inventory. "+e.message);
    }
    await warehouse.save();
  }

  @Invokable()
  public async store_dgs(
    @Param(yup.string())
    warehouse_id: string,
    @Param(yup.string())
    process_id: string
  ) {
    let warehouse = await Warehouse.getOne(warehouse_id);
    let is_existing = warehouse.id;
    if(!is_existing)
      throw new Error("Warehouse with id "+warehouse_id+" doesn't exist.");
    
    try{
      if(this.is_able_to_store_dgs(warehouse_id, process_id)){
        let S = JSON.parse(warehouse.services);
        let I = JSON.parse(warehouse.inventory);
        let process = await adapter.rawInvoke("process_get", { tx: this.tx, channel: "ch-global", chaincode: 'process' }, process_id);
        let dgs = process.result.goods;
        for(let dg_id in dgs){
          let dg = await adapter.rawInvoke("dg_get", { tx: this.tx, channel: "ch-global", chaincode: 'dg' }, dg_id);
          let label = dg.result.labelling;
          let quantity = dg.result.quantity;
          S[label] -= quantity;
          I[label].push(dg_id);
        }
        warehouse.services = JSON.stringify(S);
        warehouse.inventory = JSON.stringify(I);
        await warehouse.save();
        return true;
      }
    } catch(e) {
      console.log(e);
    } finally {
      throw new Error("Unable to store DGs in warehouse "+warehouse.id+".");
    }
  }

  @Invokable()
  public async unstore_dgs(
    @Param(yup.string())
    warehouse_id: string,
    @Param(yup.string())
    process_id: string
  ) {
    let warehouse = await Warehouse.getOne(warehouse_id);
    let is_existing = warehouse.id;
    if(!is_existing)
      throw new Error("Warehouse with id "+warehouse_id+" doesn't exist.");
    
    try{
      if(this.is_able_to_store_dgs(warehouse_id, process_id)){
        let S = JSON.parse(warehouse.services);
        let I = JSON.parse(warehouse.inventory);
        let process = await adapter.rawInvoke("process_get", { tx: this.tx, channel: "ch-global", chaincode: 'process' }, process_id);
        let dgs = process.result.goods;
        for(let dg_id in dgs){
          let dg = await adapter.rawInvoke("dg_get", { tx: this.tx, channel: "ch-global", chaincode: 'dg' }, dg_id);
          let label = dg.result.labelling;
          let quantity = dg.result.quantity;
          I[label].splice(I[label].indexOf(dg_id), 1);
          S[label] += quantity;
        }
        warehouse.services = JSON.stringify(S);
        warehouse.inventory = JSON.stringify(I);
        await warehouse.save();
        return true;
      }
    } catch(e) {
      console.log(e);
    } finally {
      throw new Error("Unable to unstore DGs in warehouse "+warehouse.id+".");
    }
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    warehouse_id: string
  ) {
    let warehouse = await Warehouse.getOne(warehouse_id);
    let is_existing = warehouse.id;
    if(!is_existing)
      throw new Error("Warehouse with id "+warehouse_id+" doesn't exist.");
    return warehouse;
  }

  @Invokable()
  public async get_all() {
    return await Warehouse.getAll();
  }

  @Invokable()
  public async get_tx_history(
    @Param(yup.string())
    warehouse_id: string
  ) {
    let dg = await Warehouse.getOne(warehouse_id);
    let is_existing = dg.id;
    if(!is_existing)
      throw new Error("Warehouse with id "+warehouse_id+" doesn't exist.");
    return await this.tx.stub.getHistoryForKeyAsList(warehouse_id);
  }

}
