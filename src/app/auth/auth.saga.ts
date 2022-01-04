import {Alert, Keyboard, ToastAndroid} from 'react-native';
import {
  actionChannel,
  put,
  takeEvery,
  call,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';
import axios, {AxiosResponse} from 'axios';
import {appUrl, apiUrl} from '../../configs/globals.config';
import {
  User,
  AuthNavigationSettingStack,
  HMO_Dashboard,
  HCP_Dashboard,
} from '../../../nav.config/nav.stack';
import {Navigation} from 'react-native-navigation';
import MMKVStorage from 'react-native-mmkv-storage';
import Splashcreen from 'react-native-splash-screen';
import CreateAccount from '../../backend/controllers/create.account';
import LoginAccount from '../../backend/controllers/login.account';
import Utils from '../utils/utils';
const storage = new MMKVStorage.Loader().initialize();
const login = async (payload: any) => {
  return axios.post(appUrl + '/login.php', payload);
};

const SignUp = async (payload: any) => {
  return axios.post(appUrl + '/enrolee/register.php', payload);
};

const getHcp = async (payload: any) => {
  return axios.post(appUrl + '/hcp/get_single_hcp.php', payload);
};

//LOGIN
// ********************************** **************************************************
function* WatchLogin() {
  yield takeLatest('DO-LOGIN', function* (action: any) {
    try {
      yield put({type: 'LOGIN-STARTED'});
      const loginUser = yield call(LoginAccount.bind(this, action.payload));
      const {account_type} = loginUser;

      console.log(account_type);
      if (account_type === 'HCP Admin') {
        // const getHcpInfo = yield call(
        //   getHcp.bind(this, {
        //     // hcp_id: enrolee_data.hcp,
        //   }),
        // );
        // yield put({type: 'SET-HCP-LOGIN', payload: getHcpInfo.data.data});
      }
      yield put({
        type: 'LOGIN-SUCCESS',
        payload: loginUser,
        account_type: account_type,
      });

      if (account_type === 'Enrolee') {
        User();
      } else if (account_type === 'HMO Admin') {
        HMO_Dashboard();
      } else if (account_type === 'HCP Admin') {
        HCP_Dashboard();
      }

      //perform actions
    } catch (e) {
      console.log(e);
      if (e.response) {
        yield put({type: 'LOGIN-FAILED', error: e.response.message});
      } else {
        yield put({type: 'LOGIN-FAILED', error: e.message});
      }
    }
  });
}

//LOGIN
// ********************************** **************************************************
function* WatchSignUp() {
  yield takeLeading('DO-SIGNUP', function* (action: any) {
    try {
      yield put({type: 'SIGNUP-STARTED'});
      const signUpUser = yield call(CreateAccount.bind(null, action.payload));
      console.log(signUpUser, '-----------SAGA success');
      yield put({type: 'SIGNUP-SUCCESS', payload: signUpUser});
      Alert.alert(
        'Account Created',
        'Account have been created successfully!!, please login to continue.',
      );
      Navigation.pop('stack.auth.signup');

      //perform actions
    } catch (e) {
      console.log(e, 'Saga error');
      if (e.response) {
        yield put({type: 'SIGNUP-FAILED', error: e.response.data.message});
      } else {
        yield put({type: 'SIGNUP-FAILED', error: e});
      }
    }
  });
}

function* watchLogout() {
  yield takeLatest('DO-LOGOUT', function* (action) {
    try {
      yield put({type: 'LOGOUT'});

      AuthNavigationSettingStack();
    } catch (e) {}
  });
}

function* WatchSetLoginPhoneNumber() {
  yield takeEvery('DO-SET-LOGIN-PHONE-NUMBER', function* (action: any) {
    yield put({type: 'SET-LOGIN-PHONE-NUMBER', payload: action.payload});
  });
}

function* watchSetLoginPassword() {
  yield takeEvery('DO-SET-LOGIN-PASSWORD', function* (action: any) {
    yield put({type: 'SET-LOGIN-PASSWORD', payload: action.payload});
  });
}

// ************************************************ SIGN UP

function* watchSetSignUpFirstName() {
  yield takeEvery('DO-SET-FIRST-NAME', function* (action: any) {
    yield put({type: 'SET-FIRST-NAME', payload: action.payload});
  });
}

function* watchSetSignUpLastName() {
  yield takeEvery('DO-SET-LAST-NAME', function* (action: any) {
    yield put({type: 'SET-LAST-NAME', payload: action.payload});
  });
}
function* watchSetSignUpPhoneNumber() {
  yield takeEvery('DO-SET-SIGNUP-PHONE-NUMBER', function* (action: any) {
    yield put({type: 'SET-SIGNUP-PHONE-NUMBER', payload: action.payload});
  });
}

function* watchSetSignUpPassword() {
  yield takeEvery('DO-SET-SIGNUP-PASSWORD', function* (action: any) {
    yield put({type: 'SET-SIGNUP-PASSWORD', payload: action.payload});
  });
}

function* watchSetGender() {
  yield takeEvery('DO-SET-GENDER', function* (action: any) {
    yield put({type: 'SET-GENDER', payload: action.payload});
  });
}

//****************************RESET PASSWORD************************************ */

function* watchSetRessetPasswordPhoneNumber() {
  yield takeEvery(
    'DO-SET-RESSET-PASSWORD-PHONE-NUMBER',
    function* (action: any) {
      yield put({
        type: 'SET-RESSET-PASSWORD-PHONE-NUMBER',
        payload: action.payload,
      });
    },
  );
}

function* watchConfirmPhoneNumber() {
  yield takeEvery('DO-CONFIRM-PHONE_NUMBER', function* () {
    ///
  });
}

// VERIFICATION ACTIONS

function* watchSetVerificationPin() {
  yield takeEvery('DO-SET-VERIFICATION-PIN', function* (action: any) {
    yield put({type: 'SET-VERIFICATION-PIN', payload: action.payload});
  });
}

function* watchSetTimerElapse() {
  yield takeEvery('DO-SET-TIMER-ELAPSE', function* (action: any) {
    yield put({type: 'SET-TIMER-ELAPSE', payload: action.payload});
  });
}

function* watchResendCodeAuth() {
  yield takeEvery('DO-SEND-VERIFICATION-CODlkkE', function* (action: any) {
    yield put({type: 'CHANGE-COUTDOWN-COMPOENT-ID'});
  });
}

// resset passwor d
function* watchSetNewpassword() {
  yield takeEvery('DO-SET-NEW-PASSWORD', function* (action: any) {
    yield put({type: 'SET-NEW-PASSWORD', payload: action.payload});
  });
}

function* watchSetConfirmNewpassword() {
  yield takeEvery('DO-SET-CONFIRM-NEW-PASSWORD', function* (action: any) {
    yield put({type: 'SET-CONFIRM-NEW-PASSWORD', payload: action.payload});
  });
}

function* watchSetTourFinish() {
  yield takeEvery('DO-TOUR-FINISH', function* () {
    Navigation.dismissAllModals();
    yield put({type: 'SET-TOUR-FINISH'});
  });
}

function* watchSetHcpProfilePicture() {
  yield takeEvery('DO-CHANGE-HCP-PROFILE-PICTURE', function* (action: any) {
    Navigation.dismissAllModals();
    yield put({type: 'CHANGE-HCP-PROFILE-PICTURE', payload: action.payload});
  });
}

function* watchSetUserProfilePicture() {
  yield takeEvery('DO-CHANGE-USER-PROFILE-PICTURE', function* (action: any) {
    Navigation.dismissAllModals();
    yield put({type: 'CHANGE-USER-PROFILE-PICTURE', payload: action.payload});
  });
}

const sendVerificationCode = async (payload: any) => {
  return axios.post(apiUrl + '/verify/sms', payload);
};

function* watchSendVerificationCode() {
  yield takeEvery('DO-SEND-VERIFICATION-CODE', function* (action: any) {
    try {
      yield put({type: 'SEND-VERIFICATION-CODE-STARTED'});
      const signUpUser = yield call(
        sendVerificationCode.bind(this, action.payload),
      );
      const {message, payload} = signUpUser.data;

      yield put({type: 'SEND-VERIFICATION-CODE-SUCCESS', payload: payload});
      yield put({type: 'CHANGE-COUTDOWN-COMPOENT-ID'});

      if (action.confirmNumber) {
        Navigation.push('stack.auth.validate.reset.credentials', {
          component: {
            name: 'stack.auth.verification',
            id: 'stack.auth.verification',
          },
        });
      }

      //perform actions
    } catch (e) {
      let errorMessage: string;
      let requestStatus: number;

      if (e.response) {
        const {status, data} = e.response;

        errorMessage = data.message || e.message;

        requestStatus = status as number;
      } else {
        errorMessage = e.message;
        requestStatus = 0;
      }

      if (Utils.matchStatus(requestStatus)) {
        yield put({
          type: 'SEND-VERIFICATION-CODE-FAILED',
          payload: errorMessage,
        });
      } else {
        yield put({
          type: 'SEND-VERIFICATION-CODE-FAILED',
          payload: errorMessage,
        });
      }
    }
  });
}

const verifyPin = async (payload: any) => {
  return axios.post(apiUrl + '/verify/code', payload);
};

function* watchVerifyPin() {
  yield takeEvery('DO-VERIFY-VERIFICATION-CODE', function* (action: any) {
    try {
      yield put({type: 'VERIFY-VERIFICATION-CODE-STARTED'});
      const signUpUser = yield call(verifyPin.bind(this, action.payload));
      const {message, payload} = signUpUser.data;

      yield put({type: 'VERIFY-VERIFICATION-CODE-SUCCESS', payload: payload});

      Navigation.push('stack.auth.verification', {
        component: {
          name: 'stack.auth.newPassword',
          id: 'stack.auth.newPassword',
        },
      });

      //perform actions
    } catch (e) {
      let errorMessage: string;
      let requestStatus: number;

      if (e.response) {
        const {status, data} = e.response;

        errorMessage = data.message || e.message;

        requestStatus = status as number;
      } else {
        errorMessage = e.message;
        requestStatus = 0;
      }

      if (Utils.matchStatus(requestStatus)) {
        yield put({
          type: 'VERIFY-VERIFICATION-CODE-FAILED',
          payload: errorMessage,
        });
      } else {
        yield put({
          type: 'VERIFY-VERIFICATION-CODE-FAILED',
          payload: errorMessage,
        });
      }
    }
  });
}

const RessetPassword = async (payload: any) => {
  return axios.post(apiUrl + '/reset-password', payload);
};
function* watchRessetPassword() {
  yield takeEvery('DO-RESSET-PASSWORD', function* (action: any) {
    try {
      yield put({type: 'RESSET-PASSWORD-STARTED'});

      yield call(RessetPassword.bind(this, action.payload));

      yield put({type: 'RESSET-PASSWORD-SUCCESS'});

      Alert.alert('', 'password changed successfully!!!');

      Navigation.popToRoot('stack.auth.newPassword');

      //perform actions
    } catch (e) {
      let errorMessage: string;
      let requestStatus: number;

      if (e.response) {
        const {status, data} = e.response;

        errorMessage = data.message || e.message;

        requestStatus = status as number;
      } else {
        errorMessage = e.message;
        requestStatus = 0;
      }

      if (Utils.matchStatus(requestStatus)) {
        yield put({type: 'RESSET-PASSWORD-FAILED', payload: errorMessage});
      } else {
        yield put({type: 'RESSET-PASSWORD-FAILED', payload: errorMessage});
      }
    }
  });
}

export default {
  watchSetTourFinish,

  WatchSignUp,

  watchSetConfirmNewpassword,
  watchSetNewpassword,

  watchSetRessetPasswordPhoneNumber,
  watchConfirmPhoneNumber,
  watchSetVerificationPin,
  watchSetTimerElapse,
  watchResendCodeAuth,

  watchSetSignUpFirstName,
  watchSetSignUpLastName,
  watchSetSignUpPhoneNumber,
  watchSetSignUpPassword,
  watchSetGender,

  WatchLogin,
  watchLogout,
  watchSetLoginPassword,
  WatchSetLoginPhoneNumber,

  watchSetHcpProfilePicture,
  watchSetUserProfilePicture,
  watchSendVerificationCode,
  watchVerifyPin,
  watchRessetPassword,
};
