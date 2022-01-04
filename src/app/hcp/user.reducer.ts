import { Alert } from "react-native";

const initialState  = {
    
    plan:{},
    hcp:{},
    state : {},
    company:{},
    dependentType:{},
    dependents:[],
    weight : 0,
    height : 0,
    enrolees:[],
    dependentTypeStatus:"DEPENDENTYPE.NOT.HCP.STARTED",
    dependentsStatus:"DEPENDENTS.NOT.HCP.STARTED",
    hcpStatus:"HCP.NOT.HCP.STARTED",
    planStatus:"PLAN.NOT.HCP.STARTED",
    companyStatus:"COMPANY.NOT.HCP.STARTED",
    stateStatus : "STATE.NOT.HCP.STARTED",
    enroleesStatus : "ENROLEES.HCP.STARTED",
    modalVisible:false,

}

function HMOUser (state=initialState,action:any){
 
    switch(action.type){
        case "CLEAR-INFO":{
           state = {...state,
            plan:{},
            hcp:{},
            state : {},
            company:{},
            dependentType:{},
            dependents:[],   
        }
        return state;
        }
        case "LOGOUT":{
            state = {
                ...state,
                plan:{},
                hcp:{},
                state : {},
                company:{},
                dependentType:{},
                dependents:[],

            }
            return state;
            break;
        }

      
        case "GET-ENROLEES-HCP-STARTED":{
            state = {...state,enroleesStatus:"ENROLEES.HMO.STARTED"};
            return state;
        }

        case "GET-ENROLEES-HCP-FAILED":{
            state = {...state,enroleesStatus:"ENROLEES.HMO.FAILED"};
            return state;
        }

        case "GET-ENROLEES-HCP-SUCCESS":{
            state = {...state,enroleesStatus:"ENROLEES.HMO.SUCCESS",enrolees:action.payload};
            return state;
        }

        case "TOGGLE-MODAL-HCP":{
            state = {...state,modalVisible:!state.modalVisible};
            return state;
        }
        
        case "GET-HCP-HCP-STARTED" :{
            state = {...state,hcpStatus:"HCP.HCP-STARTED"}
            return state;
        }

        case "GET-HCP-HCP-FAILED":{
            state = {...state,hcpStatus:"HCP.HCP-FAILED"};
            return state;
        }

        case "GET-HCP-HCP-SUCCESS":{
            state = {...state,hcp:action.payload,hcpStatus:"HCP.HCP-SUCCESS"};
            return state;
        }

        case "GET-PLAN-INFO-HCP-STARTED" :{
            state = {...state,planStatus:"PLAN.HCP-STARTED"}
            return state;
        }

        case "GET-PLAN-INFO-HCP-FAILED":{
            state = {...state,planStatus:"PLAN.HCP-FAILED"};
            return state;
        }

        case "GET-PLAN-INFO-HCP-SUCCESS":{
            state = {...state,plan:action.payload,planStatus:"PLAN.HCP-SUCCESS"};
            return state;
        }


        case "GET-ENROLEE-STATE-HCP-STARTED" :{
            state = {...state,stateStatus:"PLAN.HCP-STARTED"}
            return state;
        }

        case "GET-ENROLEE-STATE-HCP-FAILED":{
            state = {...state,stateStatus:"PLAN.HCP-FAILED"};
            return state;
        }

        case "GET-ENROLEE-STATE-HCP-SUCCESS":{
            state = {...state,state:action.payload,stateStatus:"PLAN.HCP-SUCCESS"};
            return state;
        }

        case "GET-ENROLEE-STATE-HCP-STARTED" :{
            state = {...state,stateStatus:"STATE.HCP-STARTED"}
            return state;
        }

        case "GET-ENROLEE-STATE-HCP-FAILED":{
            state = {...state,stateStatus:"STATE.HCP-FAILED"};
            return state;
        }

        case "GET-ENROLEE-STATE-HCP-SUCCESS":{
            state = {...state,state:action.payload,stateStatus:"STATE.HCP-SUCCESS"};
            return state;
        }

        case "GET-COMPANY-HCP-STARTED" :{
            state = {...state,companyStatus:"COMPANY.HCP-STARTED"}
            return state;
        }

        case "GET-COMPANY-HCP-FAILED":{
            state = {...state,companyStatus:"COMPANY.HCP-FAILED"};
            return state;
        }

        case "GET-COMPANY-HCP-SUCCESS":{
            state = {...state,company:action.payload,companyStatus:"COMPANY.HCP-SUCCESS"};
            return state;
        }



        case "GET-DEPENDENTS-TYPE-HCP-STARTED" :{
            state = {...state,dependentTypeStatus:"DEPENDENTYPE.HCP-STARTED"}
            return state;
        }

        case "GET-DEPENDENTS-TYPE-HCP-FAILED":{
            state = {...state,dependentTypeStatus:"DEPENDENTYPE.HCP-FAILED"};
            return state;
        }

        case "GET-DEPENDENTS-TYPE-HCP-SUCCESS":{
            state = {...state,dependentType:action.payload,dependentTypeStatus:"DEPENDENTYPE.HCP-SUCCESS"};
            return state;
        }

        case "GET-DEPENDENTS-HCP-STARTED" :{
            state = {...state,dependentsStatus:"DEPENDENTS.HCP-STARTED"}
            return state;
        }

        case "GET-DEPENDENTS-HCP-FAILED":{
            state = {...state,dependentsStatus:"DEPENDENTS.HCP-FAILED"};
            return state;
        }

        case "GET-DEPENDENTS-HCP-SUCCESS":{
            state = {...state,dependents:action.payload,dependentsStatus:"DEPENDENTS.HCP-SUCCESS"};
            return state;
        }


        


    }

    return state;


}

export default HMOUser;