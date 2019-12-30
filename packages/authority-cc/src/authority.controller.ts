import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { InChaincodeAdapter } from '@worldsibu/convector-adapter-fabric-in-chaincode';

import { Authority, AuthorityRecord, AuthorityStatus } from './authority.model';

const adapter = new InChaincodeAdapter();



@Controller('authority')
export class AuthorityController extends ConvectorController<ChaincodeTx> {

  public async check_user(
    @Param(yup.string())
    user_msp: string,
    @Param(yup.string())
    auth_country: string
  ) {
    let invalid_user = false;
    let country = auth_country.toUpperCase();
    if(country === "DE"){
      if(user_msp != "localauthoritydeMSP")
        invalid_user = true;
    }
    else if(country === "FR"){
      if(user_msp != "localauthorityfrMSP")
        invalid_user = true;
    }
    else
      throw new Error("Invalid country.");
    if(invalid_user)
      throw new Error("Only LocalAuthority users belonging to the authority's country can do that.");
    return true;
  }

  @Invokable()
  public async create(
    @Param(Authority)
    authority: Authority
  ) {
    let is_existing = (await Authority.getOne(authority.id)).id;
    if(!!is_existing)
      throw new Error("Authority with id "+authority.id+" is already existing.");
    this.check_user(this.tx.identity.getMSPID(), authority.country);

    authority.country = authority.country.toUpperCase();
    await authority.save();
  }

  @Invokable()
  public async notify_new_process(
    @Param(yup.string())
    record_id: string,
    @Param(yup.string())
    authority_id: string,
    @Param(yup.string())
    process_id: string,
    @Param(yup.string())
    transport_id: string
  ) {
    let auth = await Authority.getOne(authority_id);
    let is_existing = auth.id;
    if(!is_existing)
      throw new Error("Authority with id "+authority_id+" doesn't exist.");
    let authrecord = await AuthorityRecord.getOne(record_id);
    is_existing = authrecord.id;
    if(!!is_existing)
      throw new Error("AuthorityRecord with id "+record_id+" is already existing.");
    
    let record = new AuthorityRecord({
      id: record_id,
      authority_id: authority_id,
      process_id: process_id,
      transport_id: transport_id,
      status: AuthorityStatus.PENDING,
      creating: this.tx.stub.getTxDate().toISOString()
    })

    await record.save();
  }

  @Invokable()
  public async approve_process(
    @Param(yup.string())
    authority_id: string,
    @Param(yup.string())
    process_id: string
  ) {
    // Note:
    // authority_id + process_id => identify one process
    // authority_id + process_id + transport_id => identify one transport for one process => transport can be multiple per process (CURRENTLY UNIQUE)
    let auth = await Authority.getOne(authority_id);
    let is_existing = auth.id;
    if(!is_existing)
      throw new Error("Authority with id "+authority_id+" doesn't exist.");
    this.check_user(this.tx.identity.getMSPID(), auth.country);
    
    let records = await AuthorityRecord.getAll();
    records = records.filter(record => record.authority_id == authority_id && record.process_id == process_id);
    if(records.length <= 0)
      throw new Error("No corresponding records found.");
    for(let i=0 ; i<records.length ; i++){
      let record = records[i];
      if(record.status != AuthorityStatus.PENDING)
        throw new Error("AuthRecord with id "+record.id+" is not in pending.");
      record.status = AuthorityStatus.APPROVED;
      await record.save();
    }
  }

  @Invokable()
  public async refuse_process(
    @Param(yup.string())
    authority_id: string,
    @Param(yup.string())
    process_id: string
  ) {
    let auth = await Authority.getOne(authority_id);
    let is_existing = auth.id;
    if(!is_existing)
      throw new Error("Authority with id "+authority_id+" doesn't exist.");
    this.check_user(this.tx.identity.getMSPID(), auth.country);

    let records = await AuthorityRecord.getAll();
    records = records.filter(record => record.authority_id == authority_id && record.process_id == process_id);
    if(records.length <= 0)
      throw new Error("No corresponding records found.");
    for(let i=0 ; i<records.length ; i++){
      let record = records[i];
      if(record.status != AuthorityStatus.PENDING)
        throw new Error("AuthRecord with id "+record.id+" is not in pending.");
      record.status = AuthorityStatus.REFUSED;
      await record.save();
    }
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    authority_id: string
  ) {
    let auth = await Authority.getOne(authority_id);
    let is_existing = auth.id;
    if(!is_existing)
      throw new Error("Authority with id "+authority_id+" doesn't exist.");
    return auth;
  }

  @Invokable()
  public async get_record(
    @Param(yup.string())
    record_id: string
  ) {
    let record = await Authority.getOne(record_id);
    let is_existing = record.id;
    if(!is_existing)
      throw new Error("AuthorityRecord with id "+record_id+" doesn't exist.");
    return record;
  }

  @Invokable()
  public async get_all() {
    return await Authority.getAll();
  }

  @Invokable()
  public async get_all_records() {
    return await AuthorityRecord.getAll();
  }

}
