import {Alert} from 'react-native';

const initialState = {
  user: {},
  hcpInfo: {},
  accessToken: '',
  refreshToken: '',

  loginPhoneNumber: '',
  loginPassword: '',

  firstName: '',
  lastName: '',
  gender: '',
  password: '',
  phoneNumber: '',

  login: 'LOGIN-NOT-STARTED',
  signUp: 'SIGNUP-NOT-STARTED',
  verification: 'VERIFICATION-NOT-STARTED',
  verifyingCode: 'VERIFICATION-NOT-STARTED',
  ressetPasswordStatus: 'RESSET-NOT-STARTED',
  verificationToken: '',

  errorVerification: '',
  errorLogin: '',
  errorSignUp: '',
  ressetError: '',

  verificationPin: '',
  timerElapse: false,
  countdownComponentId: 'default',

  resetPhoneNumber: '',

  newPassword: '',
  confirmNewPassword: '',
  account_type: '',

  tourFinish: false,
};

function AuthReducer(state = initialState, action: any) {
  switch (action.type) {
    case 'RESSET-PASSWORD-STARTED': {
      state = {...state, ressetPasswordStatus: 'RESSET-STARTED'};
      return state;
    }

    case 'RESSET-PASSWORD-FAILED': {
      state = {
        ...state,
        ressetPasswordStatus: 'RESSET-FAILED',
        ressetError: action.payload,
      };
      return state;
    }

    case 'RESSET-PASSWORD-SUCCESS': {
      state = {...state, ressetPasswordStatus: 'RESSET-SUCCESS'};
      return state;
    }

    case 'SEND-VERIFICATION-CODE-STARTED': {
      state = {
        ...state,
        verification: 'VERIFICATION-STARTED',
        errorVerification: '',
      };
      return state;
    }

    case 'SEND-VERIFICATION-CODE-SUCCESS': {
      state = {
        ...state,
        verification: 'VERIFICATION-SUCCESS',
        verificationToken: action.payload.token,
      };
      return state;
    }

    case 'SEND-VERIFICATION-CODE-FAILED': {
      state = {
        ...state,
        verification: 'VERIFICATION-FAILED',
        errorVerification: action.payload,
      };
      return state;
    }

    case 'VERIFY-VERIFICATION-CODE-STARTED': {
      state = {
        ...state,
        verifyingCode: 'VERIFICATION-STARTED',
        errorVerification: '',
      };
      return state;
    }

    case 'VERIFY-VERIFICATION-CODE-SUCCESS': {
      state = {
        ...state,
        verifyingCode: 'VERIFICATION-SUCCESS',
        accessToken: action.payload.accessToken,
      };
      return state;
    }

    case 'VERIFY-VERIFICATION-CODE-FAILED': {
      state = {
        ...state,
        verifyingCode: 'VERIFICATION-FAILED',
        errorVerification: action.payload,
      };
      return state;
    }

    case 'SET-HCP-LOGIN': {
      state = {...state, hcpInfo: action.payload};
      return state;
    }

    case 'CHANGE-HCP-PROFILE-PICTURE': {
      let hcp = state.hcpInfo;
      hcp = {...hcp, hcp_mobile_photo_url: action.payload};
      state = {...state, hcpInfo: hcp};
      return state;
    }

    case 'CHANGE-USER-PROFILE-PICTURE': {
      let user = state.user;
      user = {...user, enrollee_mobile_photo_url: action.payload};
      state = {...state, user: user};
      return state;
    }

    case 'SET-LOGIN-PHONE-NUMBER': {
      state = {...state, loginPhoneNumber: action.payload};
      return state;
      break;
    }

    case 'SET-TOUR-FINISH': {
      state = {...state, tourFinish: true};
      return state;
      break;
    }

    case 'SET-LOGIN-PASSWORD': {
      state = {...state, loginPassword: action.payload};
      return state;
      break;
    }

    case 'SET-FIRST-NAME': {
      state = {...state, firstName: action.payload};
      return state;
      break;
    }

    case 'SET-LAST-NAME': {
      state = {...state, lastName: action.payload};
      return state;
      break;
    }

    case 'SET-SIGNUP-PHONE-NUMBER': {
      state = {...state, phoneNumber: action.payload};
      return state;
      break;
    }

    case 'SET-SIGNUP-PASSWORD': {
      state = {...state, password: action.payload};
      return state;
      break;
    }

    case 'SET-GENDER': {
      state = {...state, gender: action.payload};
      return state;
      break;
    }

    case 'LOGIN-STARTED': {
      state = {...state, login: 'LOGIN-STARTED'};
      return state;
      break;
    }

    case 'LOGIN-FAILED': {
      state = {...state, login: 'LOGIN-FAILED', errorLogin: action.error};
      return state;
      break;
    }

    case 'LOGIN-SUCCESS': {
      console.log(action.payload, action.account_type);
      state = {
        ...state,
        login: 'LOGIN-SUCCESS',
        user: action.payload,
        accessToken: 'pr48484reiei84',
        refreshToken: 'dkdkdjd',
        account_type: action.account_type,
      };
      return state;
      break;
    }

    case 'SIGNUP-STARTED': {
      state = {...state, signUp: 'SIGNUP-STARTED'};
      return state;
      break;
    }

    case 'SIGNUP-FAILED': {
      state = {...state, signUp: 'SIGNUP-FAILED', errorSignUp: action.error};
      return state;
      break;
    }

    case 'SIGNUP-SUCCESS': {
      state = {...state, signUp: 'SIGNUP-SUCCESS'};
      return state;
      break;
    }

    case 'SET-RESSET-PASSWORD-PHONE-NUMBER': {
      state = {...state, resetPhoneNumber: action.payload};
      return state;
      break;
    }

    case 'SET-VERIFICATION-PIN': {
      state = {...state, verificationPin: action.payload};
      return state;
      break;
    }

    case 'SET-TIMER-ELAPSE': {
      state = {...state, timerElapse: true};
      return state;
      break;
    }

    case 'CHANGE-COUTDOWN-COMPOENT-ID': {
      const newId = Math.floor(Math.random() * 1000);
      state = {
        ...state,
        countdownComponentId: newId.toString(),
        timerElapse: false,
      };
      return state;
    }

    case 'SET-NEW-PASSWORD': {
      state = {...state, newPassword: action.payload};
      return state;
      break;
    }

    case 'SET-CONFIRM-NEW-PASSWORD': {
      state = {...state, confirmNewPassword: action.payload};
      return state;
      break;
    }

    case 'LOGIN': {
      state = {...state, accessToken: 'working'};
      break;
    }

    case 'LOGOUT': {
      state = {
        ...state,
        user: {},
        accessToken: '',
        refreshToken: '',

        loginPhoneNumber: '',
        loginPassword: '',

        firstName: '',
        lastName: '',
        gender: '',
        password: '',
        phoneNumber: '',

        login: 'LOGIN-NOT-STARTED',
        signUp: 'SIGNUP-NOT-STARTED',

        errorLogin: '',
        errorSignUp: '',

        verificationPin: '',
        timerElapse: false,
        countdownComponentId: 'default',

        resetPhoneNumber: '',
        hcpInfo: {},

        newPassword: '',
        confirmNewPassword: '',
        account_type: '',
      };
      return state;
      break;
    }

    case 'SIGNUP-STARTED': {
      Alert.alert('hi reducer');
      state = {...state, signUp: 'SIGNUP-STARTED'};
      return state;
      break;
    }

    case 'SIGNUP-FAILED': {
      state = {...state, signUp: 'SIGNUP-FAILED', errorLogin: action.error};
      return state;
      break;
    }

    case 'SIGNUP-SUCCESS': {
      state = {...state, signUp: 'SIGNUP-SUCCESS'};
      return state;
      break;
    }
  }

  return state;
}

export default AuthReducer;
