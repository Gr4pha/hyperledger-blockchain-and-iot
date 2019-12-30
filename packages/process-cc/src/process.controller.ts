import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { InChaincodeAdapter } from '@worldsibu/convector-adapter-fabric-in-chaincode';

import { Process, ProcessStatus, AuthorityStatus } from './process.model';
import { enum_to_array } from './utils'

const adapter = new InChaincodeAdapter();



@Controller('process')
export class ProcessController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async initialize(
    @Param(Process)
    process: Process
  ) {
    let channel = this.tx.stub.getStub().getChannelID();

    if(this.tx.identity.getMSPID() != "dgproviderMSP")
      throw new Error("Only providers can initialize dangerous good processes.");
    let is_existing = (await Process.getOne(process.id)).id;
    if(!!is_existing)
      throw new Error("Process with id "+process.id+" is already existing.");
    
    try{
      let dgs = await adapter.rawInvoke("dg_get_all", { tx: this.tx, channel: channel, chaincode: 'dg' });
      let dg_ids = dgs.result.map(dg => dg._id);

      for(let i=0 ; i<process.goods.length ; i++){
        let dg_id = process.goods[i];
        let is_existing = dg_ids.includes(dg_id);
        if(!is_existing)
          throw new Error("Dangerous Good with id "+dg_id+" doesn't exist.");
      }
    } catch(e) {
      throw new Error("Fail to retrieve data (cross-smartcontract-communication). "+e.message);
    }
    
    process.status = ProcessStatus.INITIALIZED;
    if(process.provider == "" || process.provider != this.sender)
      process.provider = this.sender;
    // TODO to update because ID are hardcoded
    process.authority_aggrements = JSON.stringify({
      "auth_de_1": AuthorityStatus.UNDEFINED,
      "auth_fr_1": AuthorityStatus.UNDEFINED
    });
    
    await process.save();
  }

  @Invokable()
  public async schedule_move(
    @Param(yup.string())
    process_id: string,
    @Param(yup.string().min(1))
    transport_id: string,
    @Param(yup.date())
    schedule_departure: string,
    @Param(yup.date())
    schedule_arrival: string
  ) {
    if(this.tx.identity.getMSPID() != "dgproviderMSP")
      throw new Error("Only provider can schedule transports.");
    let process = await Process.getOne(process_id);
    let is_existing = process.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    if(process.status != ProcessStatus.INITIALIZED)
      throw new Error("Process with id "+process_id+" is not initialized.");

    process.departure_date = schedule_departure;
    process.arrival_date = schedule_arrival;
    // notify_new_process for LADE & LAFR & date of arrival for DGReceiver
    // TODO ugly cause Auth IDs hardcoded:
    process.authority_aggrements = JSON.stringify({
      "auth_de_1": AuthorityStatus.PENDING,
      "auth_fr_1": AuthorityStatus.PENDING
    });
    process.transport_id = transport_id;
    
    await process.save();
  }

  @Invokable()
  public async approve(
    @Param(yup.string())
    process_id: string,
    @Param(yup.string())
    authority_id: string
  ) {
    if(this.tx.identity.getMSPID() != "localauthoritydeMSP"
        && this.tx.identity.getMSPID() != "localauthorityfrMSP")
      throw new Error("Only localauthority can approve transports.");
    let process = await Process.getOne(process_id);
    let is_existing = process.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    if(process.status != ProcessStatus.INITIALIZED)
      throw new Error("Process with id "+process_id+" is not initialized.");
    let aggrements = JSON.parse(process.authority_aggrements);
    if(!Object.keys(aggrements).includes(authority_id))
      throw new Error("Process with id "+process_id+" doesn't have the property for authority id '"+authority_id+"'.");
    aggrements[authority_id] = AuthorityStatus.APPROVED;
    process.authority_aggrements = JSON.stringify(aggrements);
    await process.save();
  }

  @Invokable()
  public async refuse(
    @Param(yup.string())
    process_id: string,
    @Param(yup.string())
    authority_id: string
  ) {
    if(this.tx.identity.getMSPID() != "localauthoritydeMSP"
        && this.tx.identity.getMSPID() != "localauthorityfrMSP")
      throw new Error("Only localauthority can approve transports.");
    let process = await Process.getOne(process_id);
    let is_existing = process.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    if(process.status != ProcessStatus.INITIALIZED)
      throw new Error("Process with id "+process_id+" is not initialized.");
    let aggrements = JSON.parse(process.authority_aggrements);
    if(!Object.keys(aggrements).includes(authority_id))
      throw new Error("Process with id "+process_id+" doesn't have the property for authority id '"+authority_id+"'.");
    aggrements[authority_id] = AuthorityStatus.REFUSED;
    process.authority_aggrements = JSON.stringify(aggrements);
    await process.save();
  }

  @Invokable()
  public async move(
    @Param(yup.string())
    process_id: string,
    @Param(yup.string())
    from: string,
    @Param(yup.string())
    to: string
  ) {
    if(this.tx.identity.getMSPID() != "dgtransporterMSP")
      throw new Error("Only transporters can move dangerous good.");
    let process = await Process.getOne(process_id);
    let is_existing = process.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    if(!(process.status == ProcessStatus.INITIALIZED || process.status == ProcessStatus.MOVING))
      throw new Error("Process with id "+process_id+" is not initialized nor on moving.");
    try{
      let aggrements = JSON.parse(process.authority_aggrements);
      await yup.array().of(yup.string().oneOf(enum_to_array(AuthorityStatus))).validate(
        Object.values(aggrements)
      );
      await yup.array().of( yup.string().test(
        'transport is approved',
        'must be approved',
        value => value === AuthorityStatus.APPROVED) )
      .validate(
        Object.values(aggrements)
      );
    } catch(e) {
      throw new Error("Process with id "+process_id+" not approved by authorities. "+e.message);
    }
    
    if(process.status == ProcessStatus.INITIALIZED)
      process.status = ProcessStatus.MOVING;
    
    await process.save();
  }

  @Invokable()
  public async deliver( //at treating facilities
    @Param(yup.string())
    process_id: string
  ) {
    if(this.tx.identity.getMSPID() != "dgreceiverMSP")
      throw new Error("Only dgreceivers can state that dangerous goods are arrived.");
    let process = await Process.getOne(process_id);
    let is_existing = process.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    if(process.status != ProcessStatus.MOVING)
      throw new Error("Process with id "+process_id+" don't have moving status.");
    
    process.status = ProcessStatus.DELIVERED;

    await process.save();
  }

  @Invokable()
  public async finalize( // when DG are treated
    @Param(yup.string())
    process_id: string
  ) {
    if(this.tx.identity.getMSPID() != "dgreceiverMSP")
      throw new Error("Only dgreceiver at treating facilities can state that dangerous goods are treated.");
    let process = await Process.getOne(process_id);
    let is_existing = process.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    if(process.status != ProcessStatus.DELIVERED)
      throw new Error("Process with id "+process_id+" don't have treating status.");

    process.status = ProcessStatus.TREATED;

    await process.save();
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    process_id: string
  ) {
    let process = await Process.getOne(process_id);
    let is_existing = process.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    return process;
  }

  @Invokable()
  public async get_all() {
    return await Process.getAll();
  }

  @Invokable()
  public async get_tx_history(
    @Param(yup.string())
    process_id: string
  ) {
    let dg = await Process.getOne(process_id);
    let is_existing = dg.id;
    if(!is_existing)
      throw new Error("Process with id "+process_id+" doesn't exist.");
    return await this.tx.stub.getHistoryForKeyAsList(process_id);
  }

}
