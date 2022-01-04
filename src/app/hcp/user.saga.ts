import { Alert } from 'react-native';
import {actionChannel, put, takeEvery,call} from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {appUrl} from '../../configs/globals.config'
import {User,AuthNavigationSettingStack} from '../../../nav.config/nav.stack'
import RealmActions from '../../app/utils/realm'
import * as Types from '../utils/types'

const getEnroleeDependents = async(payload:any)=>{
    return axios.post(appUrl+"/dependent/get_enrollee_dependents.php",payload)
}

function * watchGetEnroleeDependents(){
    yield takeEvery("DO-GET-DEPENDENTS-HCP",function*(action:any){
         try{
            yield put({type:"GET-DEPENDENTS-HCP-STARTED"})
            const getDependents = yield call(getEnroleeDependents.bind(this,action.payload));
            const {status,data} = getDependents.data;
            console.log(getDependents.result)
            if(status == "1"){
            
                yield put({type:"GET-DEPENDENTS-HCP-SUCCESS",payload:data})
            }else{
            
                yield put({type:"GET-DEPENDENTS-HCP-FAILED"});
            }

         }catch(e){
             console.log(e)
            try{
                if(e.response.data.status == 0 ){
                    yield put({type:"GET-DEPENDENTS-HCP-SUCCESS",payload:[]})
                 }else{
                    yield put({type:"GET-DEPENDENTS-HCP-FAILED"})
                 }
            }catch(e){
                console.log(e)
                yield put({type:"GET-DEPENDENTS-HCP-FAILED"})
            }
         }
    })
}

const getDependentType = async(payload:any)=>{
    return axios.post(appUrl+"/dependent/get_dependent_type.php",payload)
}


function * watchGetDependentType(){
    yield takeEvery("DO-GET-DEPENDENTS-TYPE-HCP-",function*(action:any){
         try{
            yield put({type:"GET-DEPENDENTS-TYPE-HCP-STARTED"})
            const getDependentTyper = yield call(getDependentType.bind(this,action.payload));
            const {status,data} = getDependentTyper.data;
            if(status == "1"){
                yield put({type:"GET-DEPENDENTS-TYPE-HCP-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-DEPENDENTS-TYPE-HCP-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-DEPENDENTS-TYPE-HCP-FAILED"})
         }
    })
}

const getCompany = async(payload:any)=>{
    return axios.post(appUrl+"/company/get_single_company.php",payload)
}



function * watchGetCompany(){
    yield takeEvery("DO-GET-COMPANY-HCP",function*(action:any){
         try{
            yield put({type:"GET-COMPANY-HCP-STARTED"})
            const company = yield call(getCompany.bind(this,action.payload));
            const {status,data} = company.data;
            if(status == "1"){
                yield put({type:"GET-COMPANY-HCP-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-COMPANY-HCP-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-COMPANY-HCP-FAILED"})
         }
    })
}

const getState = async(payload:any)=>{
    return axios.post(appUrl+"/state/get_single_state.php",payload)
}

function * watchGetState(){
    yield takeEvery("DO-GET-ENROLEE-STATE-HCP",function*(action:any){
         try{
            yield put({type:"GET-ENROLEE-STATE-HCP-STARTED"})

            const state = yield call(getState.bind(this,action.payload));
            const {status,data} = state.data;
            if(status == "1"){
                yield put({type:"GET-ENROLEE-STATE-HCP-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-ENROLEE-STATE-HCP-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-ENROLEE-STATE-HCP-FAILED"})
         }
    })
}




const getPlanInfo = async(payload:any)=>{
    return axios.post(appUrl+"/plan/get_single_plan.php",payload)
}
function * watchGetPlan(){
    yield takeEvery("DO-GET-PLAN-INFO-HCP",function*(action:any){
         try{
            yield put({type:"GET-PLAN-INFO-HCP-STARTED"})

            const plan = yield call(getPlanInfo.bind(this,action.payload));
            const {status,data} = plan.data;
            if(status == "1"){
                yield put({type:"GET-PLAN-INFO-HCP-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-PLAN-INFO-HCP-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-PLAN-INFO-HCP-FAILED"})
         }
    })
}


const getHcp = async(payload:any)=>{
    return axios.post(appUrl+"/hcp/get_single_hcp.php",payload)
}

function * watchGetHcp(){
    yield takeEvery("DO-GET-HCP-HCP",function*(action:any){
         try{
            yield put({type:"GET-HCP-HCP-STARTED"})

            const plan = yield call(getHcp.bind(this,action.payload));
            const {status,data} = plan.data;
            if(status == "1"){
                yield put({type:"GET-HCP-HCP-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-HCP-HCP-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-HCP-HCP-FAILED"})
         }
    })
}



const getEnrolees = async(payload:any)=>{
    return axios.post(appUrl+"/hcp/get_enrollees_by_hcp.php",payload)
}

function * watchGetEnrolees(){
    yield takeEvery("DO-GET-ENROLEES-HCP",function*(action:any){
         try{


            yield put({type:"GET-ENROLEES-HCP-STARTED"})

            const plan = yield call(getEnrolees.bind(this,action.payload));
            const {status,data} = plan.data;

            if(status == "1"){
                RealmActions.saveUsers(data as Types.User[]);
                let users = RealmActions.getUsers();
                yield put({type:"GET-ENROLEES-HCP-SUCCESS",payload:users})
            }else{
                let empty:any[] = [];
                RealmActions.saveUsers(empty as Types.User[]);
                yield put({type:"GET-ENROLEES-HCP-SUCCESS",payload:[]});
            }

         }catch(e){
             console.log(e)
            yield put({type:"GET-ENROLEES-HCP-FAILED"})
         }
    })
}

function* watchSearchEnrolee(){
    yield takeEvery("DO-SEARCH-ENROLEE-HCP",function*(action:any){
         try{

           let searchQuery = action.payload as string;
           let result:Types.User[];
           if(searchQuery.trim().length < 1){
               result = RealmActions.getUsers();
           }else{
               let search = RealmActions.searchUsers(action.payload as string);
               result = search;
           }

           yield put({type:"GET-ENROLEES-HCP-SUCCESS",payload:result})

         }catch(e){
             console.log(e)
         }
    })
}






 function* watchCloseModal(){
     yield takeEvery("DO-TOGGLE-MODAL-HCP",function*(){
         yield put({type:"TOGGLE-MODAL-HCP"})
     })
 }


 
 function* watchClearInfo(){
     yield takeEvery("DO-CLEAR-INFO",function*(){
         yield put({type:"CLEAR-INFO"})
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
   watchSearchEnrolee
 
}