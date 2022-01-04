import { Alert } from 'react-native';
import {actionChannel, put, takeEvery,call} from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import {appUrl} from '../../configs/globals.config'
import {User,AuthNavigationSettingStack} from '../../../nav.config/nav.stack'

const getEnroleeDependents = async(payload:any)=>{
    return axios.post(appUrl+"/dependent/get_enrollee_dependents.php",payload)
}

function * watchGetEnroleeDependents(){
    yield takeEvery("DO-GET-DEPENDENTS",function*(action:any){
         try{
            yield put({type:"GET-DEPENDENTS-STARTED"})
            const getDependents = yield call(getEnroleeDependents.bind(this,action.payload));
            const {status,data} = getDependents.data;
            if(status == "1"){
                yield put({type:"GET-DEPENDENTS-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-DEPENDENTS-FAILED"});
            }

         }catch(e){
            try{
                if(e.response.data.status == 0 ){
                    yield put({type:"GET-DEPENDENTS-SUCCESS",payload:[]})
                 }else{
                    yield put({type:"GET-DEPENDENTS-FAILED"})
                 }
            }catch(e){
                yield put({type:"GET-DEPENDENTS-FAILED"})
            }
         }
    })
}

const getDependentType = async(payload:any)=>{
    return axios.post(appUrl+"/dependent/get_dependent_type.php",payload)
}


function * watchGetDependentType(){
    yield takeEvery("DO-GET-DEPENDENTS-TYPE",function*(action:any){
         try{
            yield put({type:"GET-DEPENDENTS-TYPE-STARTED"})
            const getDependentTyper = yield call(getDependentType.bind(this,action.payload));
            const {status,data} = getDependentTyper.data;
            if(status == "1"){
                yield put({type:"GET-DEPENDENTS-TYPE-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-DEPENDENTS-TYPE-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-DEPENDENTS-TYPE-FAILED"})
         }
    })
}

const getCompany = async(payload:any)=>{
    return axios.post(appUrl+"/company/get_single_company.php",payload)
}



function * watchGetCompany(){
    yield takeEvery("DO-GET-COMPANY",function*(action:any){
         try{
            yield put({type:"GET-COMPANY-STARTED"})
            const company = yield call(getCompany.bind(this,action.payload));
            const {status,data} = company.data;
            if(status == "1"){
                yield put({type:"GET-COMPANY-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-COMPANY-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-COMPANY-FAILED"})
         }
    })
}

const getState = async(payload:any)=>{
    return axios.post(appUrl+"/state/get_single_state.php",payload)
}

function * watchGetState(){
    yield takeEvery("DO-GET-ENROLEE-STATE",function*(action:any){
         try{
            yield put({type:"GET-ENROLEE-STATE-STARTED"})

            const state = yield call(getState.bind(this,action.payload));
            const {status,data} = state.data;
            if(status == "1"){
                yield put({type:"GET-ENROLEE-STATE-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-ENROLEE-STATE-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-ENROLEE-STATE-FAILED"})
         }
    })
}




const getPlanInfo = async(payload:any)=>{
    return axios.post(appUrl+"/plan/get_single_plan.php",payload)
}
function * watchGetPlan(){
    yield takeEvery("DO-GET-PLAN-INFO",function*(action:any){
         try{
            yield put({type:"GET-PLAN-INFO-STARTED"})

            const plan = yield call(getPlanInfo.bind(this,action.payload));
            const {status,data} = plan.data;
            if(status == "1"){
                yield put({type:"GET-PLAN-INFO-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-PLAN-INFO-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-PLAN-INFO-FAILED"})
         }
    })
}


const getHcp = async(payload:any)=>{
    return axios.post(appUrl+"/hcp/get_single_hcp.php",payload)
}

function * watchGetHcp(){
    yield takeEvery("DO-GET-HCP",function*(action:any){
         try{
            yield put({type:"GET-HCP-STARTED"})

            const plan = yield call(getHcp.bind(this,action.payload));
            const {status,data} = plan.data;
            if(status == "1"){
                yield put({type:"GET-HCP-SUCCESS",payload:data})
            }else{
                yield put({type:"GET-HCP-FAILED"});
            }

         }catch(e){
             yield put({type:"GET-HCP-FAILED"})
         }
    })
}


 function* watchCloseModal(){
     yield takeEvery("DO-TOGGLE-MODAL",function*(){
         yield put({type:"TOGGLE-MODAL"})
     })
 }


 function* watchSetHeight(){
    yield takeEvery("DO-SET-HEIGHT",function*(action:any){
        yield put({type:"SET-HEIGHT",payload:action.payload})
    })
}

function* watchSetWeight(){
    yield takeEvery("DO-SET-WEIGHT",function*(action:any){
        yield put({type:"SET-WEIGHT",payload:action.payload})
    })
}


function* watchSetRating(){
    yield takeEvery("DO-SET-RATING",function*(action:any){
         yield put({type:"SET-RATING",payload:action.payload})
    })
}

function* watchSetComment(){
    yield takeEvery("DO-SET-COMMENT",function*(action:any){
         yield put({type:"SET-COMMENT",payload:action.payload})
    })
}


 export default {

   watchGetHcp,
   watchCloseModal,
   watchGetPlan,
   watchGetCompany,
   watchGetDependentType,
   watchGetEnroleeDependents,
   watchGetState,
   watchSetHeight,
   watchSetWeight,
   watchSetRating,
   watchSetComment

}