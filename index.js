/**
 * @format
 */


 import { Navigation } from "react-native-navigation";
import InitializeScreens from './nav.config/initialize.screens';
import {DefaultNavSettingStack} from './nav.config/nav.stack'
import 'react-native-get-random-values'
import {Provider} from 'react-redux'

InitializeScreens();

Navigation.setDefaultOptions({
  topBar:{
    visible:false,
  },
  bottomTabs:{
    visible:false,
  },
  // statusBar:{
  //   backgroundColor:Colors.primary
  // },
  layout:{
    orientation:['portrait']
  }
  
})

Navigation.events().registerAppLaunchedListener(() => {
   DefaultNavSettingStack();
});

