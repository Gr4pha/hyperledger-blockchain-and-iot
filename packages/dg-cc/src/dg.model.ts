import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import { enum_to_array } from './utils'


export enum DGType {
  UNDEFINED = "undefined",
  FLAMMABLE = "flammable",
  NUCLEAR = "nuclear",
  EXPLOSIVE = "explosive"
}

export class DG extends ConvectorModel<DG> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.dg';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Default(new Date().toISOString())
  @Validate(yup.date())
  public creating_date: string;

  @Default(DGType.UNDEFINED)
  @Validate(yup.string().oneOf(enum_to_array(DGType)))
  public labelling: string;

  @Default(1.0)
  @Validate(yup.number().positive())
  public quantity: number;
}
