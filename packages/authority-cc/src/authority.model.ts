import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';
import { enum_to_array } from './utils';



export enum AuthorityStatus {
  UNDEFINED = "undefined",
  PENDING = "pending",
  APPROVED = "approved",
  REFUSED = "refused",
  UPDATE_REQUESTED = "update_requested"
}

export class Authority extends ConvectorModel<Authority> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.authority';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.string())
  public country: string;
}

export class AuthorityRecord extends ConvectorModel<AuthorityRecord> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.authorityrecord';

  @Required()
  @Validate(yup.string())
  public authority_id: string;

  @Required()
  @Validate(yup.string())
  public process_id: string;

  @Required()
  @Validate(yup.string())
  public transport_id: string;

  @Default(AuthorityStatus.UNDEFINED)
  @Validate(yup.string().oneOf(enum_to_array(AuthorityStatus)))
  public status: string;

  @ReadOnly()
  @Required()
  @Validate(yup.date())
  public creating: string;
}

