import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';



export enum DGType {
  UNDEFINED = "undefined",
  FLAMMABLE = "flammable",
  NUCLEAR = "nuclear",
  EXPLOSIVE = "explosive"
}

export class Warehouse extends ConvectorModel<Warehouse> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.warehouse';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Default('{}')
  @Validate(yup.string())
  public services: string;        // JSON: list of supported types of DG, mapped to remaining capacity of each labelling, e.g. '{"flammable": 12, "nuclear": 456}'

  @Default('{}')
  @Validate(yup.string())
  public inventory: string;       // JSON: list of supported types of DG, mapped to list of dg_ids stored, e.g. '{"flammable": ["DG1", "DG2"], "nuclear": []}'
}

