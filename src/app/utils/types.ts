
export type User  = {
    _id?:any;
    ukey: number;
    enrolee_id: string;
    nin_no: string;
    hcp: number;
    enrollee_mobile_photo_url:string;
    family_name: string;
    other_name: string;
    gender: string;
    mstatus: string;
    date_birth: string;
    state: string;
    phone: string;
    email: string;
    occupation: string;
    company: number;
    plan: number;
    allergies: string;
    health_cases: string;
    enrolee_photo: string;
    address: string;
    email_address:string;
    regdate: string;
    status:  number,
    fullname: string;
    id : string;
}

export type Dependent = {
     ukey: number;
     principal_id:number;
     dependant_name: string;
     dependant_type:number;
     dependant_dob:string;
     regdate: string;
}

export type DependentType = {
         ukey: number;
         name: string;
         status: number
}

export type hmo = {
        enrolee_photo:string,
        user_name:string,
        email_address:string,
        email:string
    }

export type Company = {
        ukey: number;
        company_code: string;
        company_name: string;
        phone: string;
        email: string;
        contact_person: string;
        contact_phone: string;
        location: number;
        scheme:number;
        regdate: string;
        next_renewal_date: string;
        address: string;
        lives: number;
        status: number;
}

export type CountryState = {
       ukey: number,
       name: string
}

export type plan = {
         ukey:number,
         name : string,
         plan_price :string;
         status : number
}

export type HealthCareProvider = {
        _id?:any;
        ukey:number;
        hcp_code:  string;
        hcp_name: string;
        phone: string;
        email: string;
        desk_officer: string;
        desk_officer_phone:string;
        location: number;
        bank: number;
        account_no: string;
        address: string;
        hcp_mobile_photo_url:string;
        nhis_no: string;
        lives: number;
        status:number
}

