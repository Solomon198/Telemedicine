import AuthReducer from '../../app/auth/auth.reducer';
import UserReducer from '../../app/user/user.reducer';
import HmoReducer from '../../app/hmo/user.reducer'
import HcpReducer from '../../app/hcp/user.reducer'
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    Auth: AuthReducer,
    User : UserReducer,
    Hmo : HmoReducer,
    Hcp : HcpReducer
})

export default rootReducer;