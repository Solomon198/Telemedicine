// @ts-nocheck

type typeUser = {
  name: string;
  primaryKey: string;
  properties: {
    _id: string;
    ukey: string;
    enrolee_id: string;
    nin_no: string;
    hcp: string;
    family_name: string;
    other_name: string;
    gender: string;
    mstatus: string;
    enrollee_mobile_photo_url: string;
    date_birth: string;
    state: string;
    phone: string;
    email: string;
    occupation: string;
    company: string;
    plan: string;
    allergies: string;
    health_cases: string;
    enrolee_photo: string;
    address: string;
    email_address: string;
    regdate: string;
    status: string;
    fullname: string;
    id: string;
  };
};

type typeHcps = {
  name: string;
  primaryKey: string;
  properties: {
    _id: any;
    ukey: string;
    hcp_code: string;
    hcp_name: string;
    phone: string;
    email: string;
    desk_officer: string;
    desk_officer_phone: string;
    location: string;
    bank: string;
    account_no: string;
    address: string;
    nhis_no: string;
    lives: string;
    status: string;
    hcp_mobile_photo_url: string;
  };
};

const HcpSchema: typeHcps = {
  name: 'hcps',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    ukey: 'int?',
    hcp_code: 'string?',
    hcp_name: 'string?',
    phone: 'string?',
    email: 'string?',
    desk_officer: 'string?',
    desk_officer_phone: 'string?',
    location: 'int?',
    bank: 'int?',
    account_no: 'string?',
    address: 'string?',
    nhis_no: 'string?',
    hcp_mobile_photo_url: 'string?',
    lives: 'int?',
    status: 'string?',
  },
};

const UserSchema: typeUser = {
  name: 'enrolees',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    ukey: 'int?',
    enrolee_id: 'string?',
    nin_no: 'string?',
    hcp: 'int?',
    family_name: 'string?',
    enrollee_mobile_photo_url: 'string?',
    other_name: 'string?',
    gender: 'string?',
    mstatus: 'string?',
    date_birth: 'string?',
    state: 'int?',
    phone: 'string?',
    email: 'string?',
    occupation: 'string?',
    company: 'int?',
    plan: 'int?',
    allergies: 'string?',
    health_cases: 'string?',
    enrolee_photo: 'string?',
    address: 'string?',
    email_address: 'string?',
    regdate: 'string?',
    status: 'int?',
    fullname: 'string?',
    id: 'string?',
  },
};

export default {
  UserSchema,
  HcpSchema,
};
