import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { CrossBorder, CrossBorderRecord, CountryCode } from './crossborder.model';
import { enum_to_array } from './utils'



@Controller('crossborder')
export class CrossBorderController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async create(
    @Param(CrossBorder)
    crossborder: CrossBorder
  ) {
    if(this.tx.identity.getMSPID() != "localauthoritydeMSP"
        && this.tx.identity.getMSPID() != "localauthorityfrMSP")
      throw new Error("Only LocalAuthorities can initialize CrossBorder.");
    let is_existing = (await CrossBorder.getOne(crossborder.id)).id;
    if(!!is_existing)
      throw new Error("CrossBorder with id "+crossborder.id+" is already existing.");
    try{
      await yup.string().oneOf(enum_to_array(CountryCode)).validate(crossborder.country);
      await yup.string().oneOf(enum_to_array(CountryCode)).validate(crossborder.country_out);
      await yup.string().oneOf(enum_to_array(CountryCode)).validate(crossborder.country_in);
    } catch(e) {
      throw new Error("CrossBorder's country code invalid. "+e.message);
    }
    await crossborder.save();
  }

  @Invokable()
  public async cross(       // triggered by transporter or self-triggered by IoT geolocation each time the border is crossed
    @Param(yup.string())
    record_id: string,
    @Param(yup.string())
    crossborder_id: string,
    @Param(yup.string().min(1))
    transport_id: string
  ) {
    let border = await CrossBorder.getOne(crossborder_id);
    let is_existing = border.id;
    if(!is_existing)
      throw new Error("CrossBorder with id "+crossborder_id+" doesn't exist.");
    is_existing = (await CrossBorder.getOne(record_id)).id;
    if(!!is_existing)
      throw new Error("CrossBorderRecord with id "+record_id+" is already existing.");

    let record = new CrossBorderRecord({
      id: record_id,
      crossborder_id: crossborder_id,
      transport_id: transport_id,
      crossing_date: this.tx.stub.getTxDate().toISOString()
    });

    await record.save();
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    crossborder_id: string
  ) {
    let crossborder = await CrossBorder.getOne(crossborder_id);
    let is_existing = crossborder.id;
    if(!is_existing)
      throw new Error("CrossBorder with id "+crossborder_id+" doesn't exist.");
    return crossborder;
  }

  @Invokable()
  public async get_record(
    @Param(yup.string())
    record_id: string
  ) {
    let record = await CrossBorderRecord.getOne(record_id);
    let is_existing = record.id;
    if(!is_existing)
      throw new Error("CrossBorderRecord with id "+record_id+" doesn't exist.");
    return record;
  }

  @Invokable()
  public async get_all() {
    return await CrossBorder.getAll();
  }

  @Invokable()
  public async get_all_records() {
    return await CrossBorderRecord.getAll();
  }

  @Invokable()
  public async get_tx_history(
    @Param(yup.string())
    crossborder_id: string
  ) {
    let cb = await CrossBorder.getOne(crossborder_id);
    let is_existing = cb.id;
    if(!is_existing)
      throw new Error("CrossBorder with id "+crossborder_id+" doesn't exist.");
    return await this.tx.stub.getHistoryForKeyAsList(crossborder_id);
  }

}
