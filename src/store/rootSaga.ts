import { delay, put, takeLatest } from "redux-saga/effects";
import { domainEventRegistered, domainEventRequested } from "@/store/uiSlice";

function* registerDomainEvent(action: ReturnType<typeof domainEventRequested>) {
  yield delay(150);
  yield put(domainEventRegistered(action.payload));
}

export function* rootSaga() {
  yield takeLatest(domainEventRequested.type, registerDomainEvent);
}
