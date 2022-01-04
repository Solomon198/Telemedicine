import {model, Schema} from 'mongoose';

export type AccountProps = {
  other_name: string;
  family_name: string;
  enrolee_id: string;
  hcp: string;
  password: string;
  email: string;
};

enum ACCOUNT_TYPES {
  ADMIN = 1,
  CONSULTANT = 2,
  USER = 3,
}

const Account: Schema = new Schema({
  other_name: Schema.Types.String,
  email: Schema.Types.String,
  family_name: Schema.Types.String,
  enrolee_id: Schema.Types.String,
  hcp: {type: Schema.Types.String, default: 'default'},
  accountType: {
    type: Schema.Types.Number,
    enum: [ACCOUNT_TYPES.ADMIN, ACCOUNT_TYPES.CONSULTANT, ACCOUNT_TYPES.USER],
    default: ACCOUNT_TYPES.USER,
  },
  password: Schema.Types.String,
});

export default model<AccountProps>('users', Account);
