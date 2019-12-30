import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import { enum_to_array } from './utils'



export enum IoTAttachment {
  NOT_ATTACHED = "not_attached",
  ATTACHED_TO_DG = "attached_to_dg",
  ATTACHED_TO_TRANSPORT = "attached_to_transport",
  ATTACHED_TO_WAREHOUSE = "attached_to_warehouse"
}

export class IoT extends ConvectorModel<IoT> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.iot';

  @Required()
  @Validate(yup.string())
  public name: string;

  // TODO need owner to check who can collect data or attach/detach device
  
  @Default(new Array())
  @Validate(yup.array().of(yup.string()))
  public geo_location: Array<string>;

  @Default(new Array())
  @Validate(yup.array().of(yup.string()))
  public humidity: Array<string>;
  
  @Default(new Array())
  @Validate(yup.array().of(yup.string()))
  public temperature: Array<string>;

  @Default(IoTAttachment.NOT_ATTACHED)
  @Validate(yup.string().oneOf(enum_to_array(IoTAttachment)))
  public is_attached: string;

  @Default(undefined)
  @Validate(yup.string().min(1))
  public attached_to: string;
}
