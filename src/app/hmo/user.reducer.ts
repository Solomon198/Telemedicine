import {Alert} from 'react-native';

const initialState = {
  plan: {},
  hcp: {},
  hcps: [],
  state: {},
  company: {},
  dependentType: {},
  dependents: [],
  weight: 0,
  height: 0,
  enrolees: [],
  dependentTypeStatus: 'DEPENDENTYPE.NOT.HMO-STARTED',
  dependentsStatus: 'DEPENDENTS.NOT.HMO.STARTED',
  hcpStatus: 'HCP.NOT.HMO.STARTED',
  hcpsStatus: 'HCPS.NOT.HMO.STARTED',
  planStatus: 'PLAN.NOT.HMO.STARTED',
  companyStatus: 'COMPANY.NOT.HMO.STARTED',
  stateStatus: 'STATE.NOT.HMO.STARTED',
  enroleesStatus: 'ENROLEES.HMO.STARTED',
  modalVisible: false,
  notificationCount: 0,
};

function HMOUser(state = initialState, action: any) {
  switch (action.type) {
    case 'CLEAR-INFO': {
      state = {
        ...state,
        plan: {},
        hcp: {},
        state: {},
        company: {},
        dependentType: {},
        dependents: [],
      };
      return state;
    }
    case 'LOGOUT': {
      state = {
        ...state,
        plan: {},
        hcp: {},
        state: {},
        company: {},
        dependentType: {},
        dependents: [],
      };
      return state;
      break;
    }

    case 'GET-ENROLEES-HMO-STARTED': {
      state = {...state, enroleesStatus: 'ENROLEES.HMO.STARTED'};
      return state;
    }

    case 'GET-ENROLEES-HMO-FAILED': {
      state = {...state, enroleesStatus: 'ENROLEES.HMO.FAILED'};
      return state;
    }

    case 'GET-ENROLEES-HMO-SUCCESS': {
      state = {
        ...state,
        enroleesStatus: 'ENROLEES.HMO.SUCCESS',
        enrolees: action.payload,
      };
      return state;
    }

    case 'TOGGLE-MODAL-HMO': {
      state = {...state, modalVisible: !state.modalVisible};
      return state;
    }

    case 'GET-HCP-HMO-STARTED': {
      state = {...state, hcpStatus: 'HCP-HMO-STARTED'};
      return state;
    }

    case 'GET-HCP-HMO-FAILED': {
      state = {...state, hcpStatus: 'HCP.HMO-FAILED'};
      return state;
    }

    case 'GET-HCP-HMO-SUCCESS': {
      state = {...state, hcp: action.payload, hcpStatus: 'HCP-HMO-SUCCESS'};
      return state;
    }

    case 'GET-HCPS-HMO-STARTED': {
      state = {...state, hcpsStatus: 'HCPS-HMO-STARTED'};
      return state;
    }

    case 'GET-HCPS-HMO-FAILED': {
      state = {...state, hcpsStatus: 'HCPS.HMO-FAILED'};
      return state;
    }

    case 'GET-HCPS-HMO-SUCCESS': {
      state = {...state, hcps: action.payload, hcpsStatus: 'HCPS-HMO-SUCCESS'};
      return state;
    }

    case 'GET-PLAN-INFO-HMO-STARTED': {
      state = {...state, planStatus: 'PLAN-HMO-STARTED'};
      return state;
    }

    case 'GET-PLAN-INFO-HMO-FAILED': {
      state = {...state, planStatus: 'PLAN-HMO-FAILED'};
      return state;
    }

    case 'GET-PLAN-INFO-HMO-SUCCESS': {
      state = {...state, plan: action.payload, planStatus: 'PLAN-HMO-SUCCESS'};
      return state;
    }

    case 'GET-ENROLEE-STATE-HMO-STARTED': {
      state = {...state, stateStatus: 'PLAN-HMO-STARTED'};
      return state;
    }

    case 'GET-ENROLEE-STATE-HMO-FAILED': {
      state = {...state, stateStatus: 'PLAN-HMO-FAILED'};
      return state;
    }

    case 'GET-ENROLEE-STATE-HMO-SUCCESS': {
      state = {
        ...state,
        state: action.payload,
        stateStatus: 'PLAN-HMO-SUCCESS',
      };
      return state;
    }

    case 'GET-ENROLEE-STATE-HMO-STARTED': {
      state = {...state, stateStatus: 'STATE-HMO-STARTED'};
      return state;
    }

    case 'GET-ENROLEE-STATE-HMO-FAILED': {
      state = {...state, stateStatus: 'STATE.HMO-FAILED'};
      return state;
    }

    case 'GET-ENROLEE-STATE-HMO-SUCCESS': {
      state = {
        ...state,
        state: action.payload,
        stateStatus: 'STATE-HMO-SUCCESS',
      };
      return state;
    }

    case 'GET-COMPANY-HMO-STARTED': {
      state = {...state, companyStatus: 'COMPANY-HMO-STARTED'};
      return state;
    }

    case 'GET-COMPANY-HMO-FAILED': {
      state = {...state, companyStatus: 'COMPANY.HMO-FAILED'};
      return state;
    }

    case 'GET-COMPANY-HMO-SUCCESS': {
      state = {
        ...state,
        company: action.payload,
        companyStatus: 'COMPANY.HMO-SUCCESS',
      };
      return state;
    }

    case 'GET-DEPENDENTS-TYPE-HMO-STARTED': {
      state = {...state, dependentTypeStatus: 'DEPENDENTYPE-HMO-STARTED'};
      return state;
    }

    case 'GET-DEPENDENTS-TYPE-HMO-FAILED': {
      state = {...state, dependentTypeStatus: 'DEPENDENTYPE-HMO-FAILED'};
      return state;
    }

    case 'GET-DEPENDENTS-TYPE-HMO-SUCCESS': {
      state = {
        ...state,
        dependentType: action.payload,
        dependentTypeStatus: 'DEPENDENTYPE.-HMO-SUCCESS',
      };
      return state;
    }

    case 'GET-DEPENDENTS-HMO-STARTED': {
      state = {...state, dependentsStatus: 'DEPENDENTS-HMO-STARTED'};
      return state;
    }

    case 'GET-DEPENDENTS-HMO-FAILED': {
      state = {...state, dependentsStatus: 'DEPENDENTS-HMO-FAILED'};
      return state;
    }

    case 'GET-DEPENDENTS-HMO-SUCCESS': {
      state = {
        ...state,
        dependents: action.payload,
        dependentsStatus: 'DEPENDENTS-HMO-SUCCESS',
      };
      return state;
    }

    case 'SET-NOTIFICATION-COUNT-HMO': {
      if (action.increement == 1) {
        let notificationCount =
          state.notificationCount + (action.payload as number);
        state = {...state, notificationCount: notificationCount};
      } else if (action.increement == 2) {
        let notificationCount =
          state.notificationCount - (action.payload as number);
        state = {...state, notificationCount: notificationCount};
      } else {
        state = {...state, notificationCount: action.payload};
      }
      return state;
    }
  }

  return state;
}

export default HMOUser;
