import * as yup from 'yup';
import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { DG, DGType } from './dg.model';
import { enum_to_array } from './utils'



@Controller('dg')
export class DGController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async create(
    @Param(DG)
    dg: DG
  ) {
    if(this.tx.identity.getMSPID() != "dgproviderMSP")
      throw new Error("Only providers can create dangerous goods.");
    let is_existing = (await DG.getOne(dg.id)).id;
    if(!!is_existing)
      throw new Error("Dangerous Good with id "+dg.id+" is already existing.");
    await yup.string().oneOf(enum_to_array(DGType)).validate(dg.labelling);
    await dg.save();
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    dg_id: string
  ) {
    let dg = await DG.getOne(dg_id);
    let is_existing = dg.id;
    if(!is_existing)
      throw new Error("Dangerous Good with id "+dg_id+" doesn't exist.");
    console.log(Object.keys(dg))
    return dg;
  }

  @Invokable()
  public async get_all() {
    return await DG.getAll();
  }

  @Invokable()
  public async get_tx_history(
    @Param(yup.string())
    dg_id: string
  ) {
    let dg = await DG.getOne(dg_id);
    let is_existing = dg.id;
    if(!is_existing)
      throw new Error("Dangerous Good with id "+dg_id+" doesn't exist.");
    return await this.tx.stub.getHistoryForKeyAsList(dg_id);
  }

}
