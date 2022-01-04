import {persistStore, persistReducer, PersistConfig} from 'redux-persist';

import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './root.reducer';
import rootSaga from './root.saga';
import MMKVStorage from 'react-native-mmkv-storage';
import {Alert} from 'react-native';

const storage = new MMKVStorage.Loader().initialize();

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig as any, rootReducer);

export default () => {
  console.log(
    'calling this guy .............................********************',
  );
  let store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
  let persistor = persistStore(store);

  // persistor.purge().then(() => Alert.alert('worked'));
  sagaMiddleware.run(rootSaga);

  return {store, persistor};
};
