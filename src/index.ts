import { useCallback, useEffect } from 'react'
import { Dispatch } from 'redux'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

// See: https://react-redux.js.org/api/hooks#recipe-useshallowequalselector
export function useShallowEqualSelector<T extends (state: State) => ReturnType<T>, State extends object>(selector: T) {
  return useSelector(selector, shallowEqual)
}

// This is a hook to dispatch actions in handlers
// The variables using in a handler are passed to deps for useCallbacks
// This returns a function like this: (dispatch, ...closureVariables) => (...paramsOfHandler) => void
// const handlePagination = (dispatch: Dispatch, search: string) => (pageNumber: number) => {
//  dispatch(navigateToDocGroups(updatePageNumber(queryToPager(search), pageNumber)))
// };
// search is like a variable from useSelector
// const onClickPagination = useDispatchHandler(handlePagination, search)
export function useDispatchHandler<Deps extends any[], Params extends any[]>(
  cb: (dispatch: Dispatch, ...deps: Deps) => (...params: Params) => void,
  ...deps: Deps
): (...params: Params) => void {
  const dispatch = useDispatch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...params: Params) => cb(dispatch, ...deps)(...params), [cb, dispatch, ...deps])
}

// This is a hook to pass dispatch to useEffect.
// The variables using in a handler are passed to deps for useEffect
export function useDispatchEffect<Deps extends any[]>(
  cb: (dispatch: Dispatch, ...deps: Deps) => ReturnType<React.EffectCallback>,
  ...deps: Deps
): void {
  const dispatch = useDispatch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cb(dispatch, ...deps), [cb, dispatch, ...deps])
}

// This is a hook to pass dispatch to useEffect.
// The difference with useDispatchEffect is that you have to pass deps for useEffect explicitly
// This is intended for a case that we can't use useDispatchEffect
export function useDispatchEffectManualDeps<Deps extends any[], Params extends any[]>(
  cb: (dispatch: Dispatch, ...deps: Params) => ReturnType<React.EffectCallback>,
  explicitDeps: Deps,
  ...deps: Params
): void {
  const dispatch = useDispatch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cb(dispatch, ...deps), [cb, dispatch, ...explicitDeps])
}