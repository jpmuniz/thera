import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { monitoringReducer } from "@/store/monitoringSlice";
import { uiReducer } from "@/store/uiSlice";
import { rootSaga } from "@/store/rootSaga";

export function makeStore() {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: {
      monitoring: monitoringReducer,
      ui: uiReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware)
  });

  sagaMiddleware.run(rootSaga);
  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
