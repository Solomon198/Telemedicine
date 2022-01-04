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
    comment :"",
    rating: 1,

    dependentTypeStatus:"DEPENDENTYPE.NOT.STARTED",
    dependentsStatus:"DEPENDENTS.NOT.STARTED",
    hcpStatus:"HCP.NOT.STARTED",
    planStatus:"PLAN.NOT.STARTED",
    companyStatus:"COMPANY.NOT.STARTED",
    stateStatus : "STATE.NOT.STARTED",
    modalVisible:false,

}

function User (state=initialState,action:any){
 
    switch(action.type){

        case "LOGOUT":{
            state = {
                ...state,
                plan:{},
                hcp:{},
                state : {},
                company:{},
                dependentType:{},
                dependents:[],
                weight : 0,
                height : 0,
                rating:1,
                comment:""

            }
            return state;
            break;
        }

        case "SET-RATING":{
            state = {...state,rating:action.payload};
            return state;
        }

        case "SET-COMMENT":{
            state = {...state,comment:action.payload};
            return state;
        }


        

        case "SET-WEIGHT":{
            state = {...state,weight:action.payload};
            return state;
        }

        case "SET-HEIGHT":{
            state = {...state,height:action.payload};
            return state;
        }

        case "TOGGLE-MODAL":{
            state = {...state,modalVisible:!state.modalVisible};
            return state;
        }
        
        case "GET-HCP-STARTED" :{
            state = {...state,hcpStatus:"HCP.STARTED"}
            return state;
        }

        case "GET-HCP-FAILED":{
            state = {...state,hcpStatus:"HCP.FAILED"};
            return state;
        }

        case "GET-HCP-SUCCESS":{
            state = {...state,hcp:action.payload,hcpStatus:"HCP.SUCCESS"};
            return state;
        }

        case "GET-PLAN-INFO-STARTED" :{
            state = {...state,planStatus:"PLAN.STARTED"}
            return state;
        }

        case "GET-PLAN-INFO-FAILED":{
            state = {...state,planStatus:"PLAN.FAILED"};
            return state;
        }

        case "GET-PLAN-INFO-SUCCESS":{
            state = {...state,plan:action.payload,planStatus:"PLAN.SUCCESS"};
            return state;
        }


        case "GET-ENROLEE-STATE-STARTED" :{
            state = {...state,stateStatus:"PLAN.STARTED"}
            return state;
        }

        case "GET-ENROLEE-STATE-FAILED":{
            state = {...state,stateStatus:"PLAN.FAILED"};
            return state;
        }

        case "GET-ENROLEE-STATE-SUCCESS":{
            state = {...state,state:action.payload,stateStatus:"PLAN.SUCCESS"};
            return state;
        }

        case "GET-ENROLEE-STATE-STARTED" :{
            state = {...state,stateStatus:"STATE.STARTED"}
            return state;
        }

        case "GET-ENROLEE-STATE-FAILED":{
            state = {...state,stateStatus:"STATE.FAILED"};
            return state;
        }

        case "GET-ENROLEE-STATE-SUCCESS":{
            state = {...state,state:action.payload,stateStatus:"STATE.SUCCESS"};
            return state;
        }

        case "GET-COMPANY-STARTED" :{
            state = {...state,companyStatus:"COMPANY.STARTED"}
            return state;
        }

        case "GET-COMPANY-FAILED":{
            state = {...state,companyStatus:"COMPANY.FAILED"};
            return state;
        }

        case "GET-COMPANY-SUCCESS":{
            state = {...state,company:action.payload,companyStatus:"COMPANY.SUCCESS"};
            return state;
        }



        case "GET-DEPENDENTS-TYPE-STARTED" :{
            state = {...state,dependentTypeStatus:"DEPENDENTYPE.STARTED"}
            return state;
        }

        case "GET-DEPENDENTS-TYPE-FAILED":{
            state = {...state,dependentTypeStatus:"DEPENDENTYPE.FAILED"};
            return state;
        }

        case "GET-DEPENDENTS-TYPE-SUCCESS":{
            state = {...state,dependentType:action.payload,dependentTypeStatus:"DEPENDENTYPE.SUCCESS"};
            return state;
        }

        case "GET-DEPENDENTS-STARTED" :{
            state = {...state,dependentsStatus:"DEPENDENTS.STARTED"}
            return state;
        }

        case "GET-DEPENDENTS-FAILED":{
            state = {...state,dependentsStatus:"DEPENDENTS.FAILED"};
            return state;
        }

        case "GET-DEPENDENTS-SUCCESS":{
            state = {...state,dependents:action.payload,dependentsStatus:"DEPENDENTS.SUCCESS"};
            return state;
        }


        


    }

    return state;


}

export default User;