import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';



export enum CountryCode {
  DE = "DE",
  FR = "FR"
}

// cross border checkpoint between two countries owned by one country
// (each country might maintain their own CrossBorder object)
export class CrossBorder extends ConvectorModel<CrossBorder> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.crossborder';

  @Required()
  @Validate(yup.string())
  public country: string;

  @Required()
  @Validate(yup.string())
  public country_out: string;

  @Required()
  @Validate(yup.string())
  public country_in: string;
}

export class CrossBorderRecord extends ConvectorModel<CrossBorderRecord> {
  @ReadOnly()
  @Required()
  public readonly type = 'bc_iot.crossborderrecord';

  @Required()
  @Validate(yup.string())
  public crossborder_id: string;

  @Default(undefined)
  @Validate(yup.string())
  public transport_id: string;

  @Default(undefined)
  @Validate(yup.date())
  public crossing_date: string;
}

