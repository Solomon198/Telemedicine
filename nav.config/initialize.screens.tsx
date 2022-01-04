import {Navigation} from 'react-native-navigation';
import App from '../switchNav';
import ReduxConfig from '../src/configs/_redux/store';
import {Provider} from 'react-redux';
import React from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import Login from '../src/app/auth/login.screen';
import SignUp from '../src/app/auth/signup.screen';
import SignIn from '../src/app/auth/signin.screen';
import Verification from '../src/app/auth/verification.screen';
import ValidateResetPasswordCreds from '../src/app/auth/collect.phone.reset.password';
import NewPassword from '../src/app/auth/new.password';
import RatingComponent from '../src/app/user/rating';
import HealthCareProviders from '../src/app/user/health.care.providers';
import Benefits from '../src/app/user/appBenefit';
import BMI from '../src/app/user/bmi.calculator';
import ChatScreen from '../src/app/components/chat';
import Enrolees from '../src/app/hmo/enrolees';
import HealthCareProvidersHmo from '../src/app/hmo/hcps';
import EnrollessRedirect from '../src/app/hmo/enrolees.redirect';
import ChalList from '../src/app/hmo/chat.list';

import UserSideMenu from '../src/app/user/side.menu';
import UserDashboard from '../src/app/user/main.dashboard';
import UserNotifications from '../src/app/user/manager.notifications';
import ErolleeInformation from '../src/app/user/edit.enrollee';
import Beneficiaries from '../src/app/user/beneficiaries';
import Tips from '../src/app/user/viewTips';
import SearchHcp from '../src/app/user/search.hcp';

//HMO
import HmoSideMenu from '../src/app/hmo/side.menu';
import ErolleeInformationHMO from '../src/app/hmo/edit.enrollee';
import BeneficiariesHMO from '../src/app/hmo/beneficiaries';
import UserDashboardHMO from '../src/app/hmo/main.dashboard';
import MedicalBill from '../src/app/hmo/medical.bills';
import MedicalReport from '../src/app/hmo/medical.reports';

//HCP
import HcpSideMenu from '../src/app/hcp/side.menu';
import ErolleeInformationHCP from '../src/app/hcp/edit.enrollee';
import BeneficiariesHCP from '../src/app/hcp/beneficiaries';
import UserDashboardHCP from '../src/app/hcp/main.dashboard';
import MedicalBillHCP from '../src/app/hcp/medical.bills';
import MedicalReportHCP from '../src/app/hcp/medical.reports';
import EnroleesRedirectHCP from '../src/app/hcp/hcp.enrolees.redirect';
import HcpEnrolees from '../src/app/hcp/enrolees';
//Gen
import AppTour from '../src/app/components/appTour';
import HcpInformation from '../src/app/components/hcp.information';

const {store, persistor} = ReduxConfig();

function Wrapper(Component: any) {
  return function (props: any) {
    const EnhancedComponent = () => (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...props} />
        </PersistGate>
      </Provider>
    );
    return <EnhancedComponent />;
  };
}

export default function InitializeScreens(Provider: any, Store: any) {
  Navigation.registerComponent('stack.auto.switch', () => Wrapper(App) as any);
  Navigation.registerComponent(
    'stack.user.information',
    () => HcpInformation as any,
  );

  //UserPages
  Navigation.registerComponent(
    'stack.user.sidemenu',
    () => Wrapper(UserSideMenu) as any,
  );
  Navigation.registerComponent(
    'stack.user.dashboard',
    () => Wrapper(UserDashboard) as any,
  );
  Navigation.registerComponent(
    'stack.user.notifications',
    () => Wrapper(UserNotifications) as any,
  );
  Navigation.registerComponent(
    'stack.user.erollee.info',
    () => Wrapper(ErolleeInformation) as any,
  );
  Navigation.registerComponent(
    'stack.user.beneficiaries',
    () => Wrapper(Beneficiaries) as any,
  );
  Navigation.registerComponent(
    'stack.user.rating',
    () => Wrapper(RatingComponent) as any,
  );
  Navigation.registerComponent(
    'stack.user.providers',
    () => Wrapper(HealthCareProviders) as any,
  );
  Navigation.registerComponent(
    'stack.user.benefits',
    () => Wrapper(Benefits) as any,
  );
  Navigation.registerComponent('stack.user.bmi', () => Wrapper(BMI) as any);
  Navigation.registerComponent(
    'stack.user.search',
    () => Wrapper(SearchHcp) as any,
  );
  Navigation.registerComponent('stack.user.tips', () => Wrapper(Tips) as any);
  Navigation.registerComponent(
    'stack.gen.chat',
    () => Wrapper(ChatScreen) as any,
  );
  Navigation.registerComponent(
    'stack.admin.enrolees',
    () => Wrapper(Enrolees) as any,
  );
  Navigation.registerComponent(
    'stack.admin.hcps',
    () => Wrapper(HealthCareProvidersHmo) as any,
  );

  Navigation.registerComponent('stack.gen.tour', () => Wrapper(AppTour) as any);

  Navigation.registerComponent(
    'stack.hmo.chatlist',
    () => Wrapper(ChalList) as any,
  );

  Navigation.registerComponent(
    'stack.hmo.enrolee',
    () => Wrapper(ErolleeInformationHMO) as any,
  );
  Navigation.registerComponent(
    'stack.hmo.dependents',
    () => Wrapper(BeneficiariesHMO) as any,
  );
  Navigation.registerComponent(
    'stack.hmo.dashboard',
    () => Wrapper(UserDashboardHMO) as any,
  );
  Navigation.registerComponent(
    'stack.hmo.sidemenu',
    () => Wrapper(HmoSideMenu) as any,
  );
  Navigation.registerComponent(
    'stack.hmo.medicalBills',
    () => Wrapper(MedicalBill) as any,
  );
  Navigation.registerComponent(
    'stack.hmo.medicalReports',
    () => Wrapper(MedicalReport) as any,
  );
  Navigation.registerComponent(
    'stack.hmo.enrolees.redirect',
    () => Wrapper(EnrollessRedirect) as any,
  );

  Navigation.registerComponent(
    'stack.hcp.enrolee',
    () => Wrapper(ErolleeInformationHCP) as any,
  );
  Navigation.registerComponent(
    'stack.hcp.enrolees',
    () => Wrapper(HcpEnrolees) as any,
  );
  Navigation.registerComponent(
    'stack.hcp.dependents',
    () => Wrapper(BeneficiariesHCP) as any,
  );
  Navigation.registerComponent(
    'stack.hcp.dashboard',
    () => Wrapper(UserDashboardHCP) as any,
  );
  Navigation.registerComponent(
    'stack.hcp.sidemenu',
    () => Wrapper(HcpSideMenu) as any,
  );
  Navigation.registerComponent(
    'stack.hcp.medicalBills',
    () => Wrapper(MedicalBillHCP) as any,
  );
  Navigation.registerComponent(
    'stack.hcp.medicalReports',
    () => Wrapper(MedicalReportHCP) as any,
  );
  Navigation.registerComponent(
    'stack.hcp.enrolee.redirect',
    () => Wrapper(EnroleesRedirectHCP) as any,
  );

  //Auth Pages
  Navigation.registerComponent('stack.auth.login', () => Wrapper(Login) as any);
  Navigation.registerComponent(
    'stack.auth.signup',
    () => Wrapper(SignUp) as any,
  );
  Navigation.registerComponent(
    'stack.auth.signin',
    () => Wrapper(SignIn) as any,
  );
  Navigation.registerComponent(
    'stack.auth.verification',
    () => Wrapper(Verification) as any,
  );
  Navigation.registerComponent(
    'stack.auth.validate.reset.credentials',
    () => Wrapper(ValidateResetPasswordCreds) as any,
  );
  Navigation.registerComponent(
    'stack.auth.newPassword',
    () => Wrapper(NewPassword) as any,
  );
}
