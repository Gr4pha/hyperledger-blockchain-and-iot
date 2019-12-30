import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';



export class Transport extends ConvectorModel<Transport> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.transport';

  @Default("truck")
  @Validate(yup.string().oneOf(["truck", "train", "plane"]))
  public means: string;

  @Required()
  @Validate(yup.array().of(yup.string()))
  public goods: Array<string>;               // list of DG_ids

  @Required()
  @Validate(yup.array().of(yup.string()))
  public iots: Array<string>;                // list of IoT_ids

  @Default("")
  @Validate(yup.string())
  public geo_location: string;

  @Default(new Array())
  @Validate(yup.array().of(yup.string()))
  public moving_steps: Array<string>;         // JSON object -> list of stops when moving goods, e.g. Object[] => [{to: str, from: str}]
}
