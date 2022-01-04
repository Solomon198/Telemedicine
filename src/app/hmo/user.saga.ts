import { Alert } from 'react-native';
import {actionChannel, put, takeEvery,call} from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {appUrl} from '../../configs/globals.config'
import * as Types from '../utils/types'
import {User,AuthNavigationSettingStack} from '../../../nav.config/nav.stack'
import RealmActions from '../../app/utils/realm'
const getEnroleeDependents = async(payload:any)=>{
    return axios.post(appUrl+"/dependent/get_enrollee_dependents.php",payload)
}

function * watchGetEnroleeDependents(){
    yield takeEvery("DO-GET-DEPENDENTS-HMO",function*(action:any){
         try{
            yield put({type:"GET-DEPENDENTS-HMO-STARTED"})
            const getDependents = yield call(getEnroleeDependents.bind(this,action.payload));
            const {status,data} = getDependents.data;
            console.log(getDependents.result)
            if(status == "1"){
            
                yield put({type:"GET-DEPENDENTS-HMO-SUCCESS",payload:data})
            }else{
            
                yield put({type:"GET-DEPENDENTS-HMO-FAILED"});
            }

         }catch(e){
             console.log(e)
            try{
                if(e.response.data.status == 0 ){
                    yield put({type:"GET-DEPENDENTS-HMO-SUCCESS",payload:[]})
                 }else{
                    yield put({type:"GET-DEPENDENTS-HMO-FAILED"})
                 }
            }catch(e){
                console.log(e)
                yield put({type:"GET-DEPENDENTS-HMO-FAILED"})
            }
         }
    })
}

const getDependentType = async(payload:any)=>{
    return axios.post(appUrl+"/dependent/get_dependent_type.php",payload)
}


function * watchGetDependentType(){
    yield takeEvery("DO-GET-DEPENDENTS-TYPE-HMO-",function*(action:any){
         try{
            yield put({type:"GET-DEPENDENTS-TYPE-HMO-STARTED"})
            const getDependentTyper = yield call(getDependentType.bind(this,action.payload));
            const {status,data} = getDependentTyper.data;
            if(status == "1"){
                yield put({type:"GET-DEPENDENTS-TYPE-HMO-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-DEPENDENTS-TYPE-HMO-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-DEPENDENTS-TYPE-HMO-FAILED"})
         }
    })
}

const getCompany = async(payload:any)=>{
    return axios.post(appUrl+"/company/get_single_company.php",payload)
}



function * watchGetCompany(){
    yield takeEvery("DO-GET-COMPANY-HMO",function*(action:any){
         try{
            yield put({type:"GET-COMPANY-HMO-STARTED"})
            const company = yield call(getCompany.bind(this,action.payload));
            const {status,data} = company.data;
            if(status == "1"){
                yield put({type:"GET-COMPANY-HMO-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-COMPANY-HMO-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-COMPANY-HMO-FAILED"})
         }
    })
}

const getState = async(payload:any)=>{
    return axios.post(appUrl+"/state/get_single_state.php",payload)
}

function * watchGetState(){
    yield takeEvery("DO-GET-ENROLEE-STATE-HMO",function*(action:any){
         try{
            yield put({type:"GET-ENROLEE-STATE-HMO-STARTED"})

            const state = yield call(getState.bind(this,action.payload));
            const {status,data} = state.data;
            if(status == "1"){
                yield put({type:"GET-ENROLEE-STATE-HMO-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-ENROLEE-STATE-HMO-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-ENROLEE-STATE-HMO-FAILED"})
         }
    })
}




const getPlanInfo = async(payload:any)=>{
    return axios.post(appUrl+"/plan/get_single_plan.php",payload)
}
function * watchGetPlan(){
    yield takeEvery("DO-GET-PLAN-INFO-HMO",function*(action:any){
         try{
            yield put({type:"GET-PLAN-INFO-HMO-STARTED"})

            const plan = yield call(getPlanInfo.bind(this,action.payload));
            const {status,data} = plan.data;
            if(status == "1"){
                yield put({type:"GET-PLAN-INFO-HMO-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-PLAN-INFO-HMO-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-PLAN-INFO-HMO-FAILED"})
         }
    })
}


const getHcp = async(payload:any)=>{
    return axios.post(appUrl+"/hcp/get_single_hcp.php",payload)
}

function * watchGetHcp(){
    yield takeEvery("DO-GET-HCP-HMO",function*(action:any){
         try{
            yield put({type:"GET-HCP-HMO-STARTED"})

            const plan = yield call(getHcp.bind(this,action.payload));
            const {status,data} = plan.data;
            if(status == "1"){
                yield put({type:"GET-HCP-HMO-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-HCP-HMO-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-HCP-HMO-FAILED"})
         }
    })
}



const getEnrolees = async()=>{
    return axios.get(appUrl+"/enrolee/get_all_enrollees.php")
}

function * watchGetEnrolees(){
    yield takeEvery("DO-GET-ENROLEES-HMO",function*(){
         try{

            yield put({type:"GET-ENROLEES-HMO-STARTED"})

            const plan = yield call(getEnrolees.bind(this));
            const {status,data} = plan.data;
            if(status == "1"){
                RealmActions.saveUsers(data as Types.User[]);
                console.log(data)
                let users = RealmActions.getUsers();
                yield put({type:"GET-ENROLEES-HMO-SUCCESS",payload:users})
            }else{
                yield put({type:"GET-ENROLEES-HMO-FAILED"});
            }
 
         }catch(e){
             console.log(e)
             yield put({type:"GET-ENROLEES-HMO-FAILED"})
         }
    })
}





 function* watchCloseModal(){
     yield takeEvery("DO-TOGGLE-MODAL-HMO",function*(){
         yield put({type:"TOGGLE-MODAL-HMO"})
     })
 }


 
 function* watchClearInfo(){
     yield takeEvery("DO-CLEAR-INFO",function*(){
         yield put({type:"CLEAR-INFO"})
     })
 }

 function* watchSearchEnrolee(){
     yield takeEvery("DO-SEARCH-ENROLEE",function*(action:any){
          try{

            let searchQuery = action.payload as string;
            let result:Types.User[];
            if(searchQuery.trim().length < 1){
                result = RealmActions.getUsers();
            }else{
                let search = RealmActions.searchUsers(action.payload as string);
                result = search;
            }

            yield put({type:"GET-ENROLEES-HMO-SUCCESS",payload:result})

          }catch(e){
              console.log(e)
          }
     })
 }

 function* watchSearchHcps(){
    yield takeEvery("DO-SEARCH-HCPS",function*(action:any){
         try{

           let searchQuery = action.payload as string;
           let result:Types.HealthCareProvider[];
           if(searchQuery.trim().length < 1){
               result = RealmActions.getHcps();
           }else{
               let search = RealmActions.searchHcps(action.payload as string);
               result = search;
           }

           yield put({type:"GET-HCPS-HMO-SUCCESS",payload:result})

         }catch(e){
             console.log(e)
         }
    })
}


 const getHcps = async()=>{
    return axios.get(appUrl+"/hcp/get_all_hcps.php")
}

function * watchGetHcps(){
    yield takeEvery("DO-GET-HCPS-HMO",function*(action:any){
         try{
            yield put({type:"GET-HCPS-HMO-STARTED"})

            const _hcps = yield call(getHcps.bind(this));
            const {status,data} = _hcps.data;
            if(status == "1"){
                console.log(data)
                RealmActions.saveHcps(data as Types.HealthCareProvider[]);
                let hcpS = RealmActions.getHcps();
                yield put({type:"GET-HCPS-HMO-SUCCESS",payload:hcpS})
            }else{
                yield put({type:"GET-HCPS-HMO-FAILED"});
            }

         }catch(e){
             console.log(e)
             yield put({type:"GET-HCPS-HMO-FAILED"})
         }
    })
}

function * setHmoNotificationCount(){
      yield takeEvery("DO-SET-NOTIFICATION-COUNT-HMO",function*(action:any){
           yield put({type:"SET-NOTIFICATION-COUNT-HMO",payload:action.payload,increement:action.increement})
      })
}


 export default {
   watchClearInfo,
   watchGetHcp,
   watchCloseModal,
   watchGetPlan,
   watchGetCompany,
   watchGetDependentType,
   watchGetEnroleeDependents,
   watchGetState,
   watchGetEnrolees,
   watchSearchEnrolee,
   watchGetHcps,
   watchSearchHcps,
   setHmoNotificationCount
 
}