import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import { enum_to_array } from './utils'



export enum ProcessStatus {
  UNDEFINED = "undefined",
  INITIALIZED = "initialized",
  MOVING = "moving",
  DELIVERED = "delivered",
  TREATED = "treated"
}

export enum AuthorityStatus {
  UNDEFINED = "undefined",
  PENDING = "pending",
  APPROVED = "approved",
  REFUSED = "refused",
  UPDATE_REQUESTED = "update_requested"
}

export enum DGStatus {
  NOT_TREATED = "not_treated",
  TREATED = "treated"
}

export class Process extends ConvectorModel<Process> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.process';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.array().of(yup.string()))
  public goods: Array<string>;

  @Default(ProcessStatus.UNDEFINED)
  @Validate(yup.string().oneOf(enum_to_array(ProcessStatus)))
  public status: string;

  @Default("{}")
  @Validate(yup.string())
  public authority_aggrements: string;      // JSON object id:authorityID, value: AuthorityStatus

  @Default("")
  @Validate(yup.string())
  public provider: string;

  @Required()
  @Validate(yup.string().min(1))
  public receiver: string;

  @Default(undefined)
  @Validate(yup.string().min(1))
  public transport_id: string;

  @Default(undefined)
  @Validate(yup.date())
  public departure_date: string;

  @Default(undefined)
  @Validate(yup.date())
  public arrival_date: string;
}

