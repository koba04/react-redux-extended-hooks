# react-redux-extended-hooks
![npm](https://img.shields.io/npm/v/react-redux-extended-hooks)

A React Hooks for React Redux applications

## How to use

```
npm install react-redux-extended-hooks
// install peerDependencies
npm install react redux react-redux
```

## Motivation

`useSelector` and `useDispatcher` are great Hooks API `react-redux` has.
However, we sometimes have to define many handlers in render functions like the following.

```ts
const App = props => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.users[props.id], shallowEqual);
  const handlerA = useCallback(value => {
    dispatch(someAction(value, user);
  }, [dispatch, user]);
  
  useEffect(() => {
    fetchUsers().then(users => dispatch(loadUsers(users)));
  }, [dispatch]);
  
  // :
  // :

  // far from the component definition.
  return (
    <div>...</div>
  );
}
```

The above code includes many things not related to your domain logic itself and is not clear.
This library allows you not to write code not related to domain logic and to extract the logic from the render function, which makes code clear and testable.

```ts
const handleA = (dispatch, user) => (value) => {
  dispatch(someAction(value, user);
};

const loadUsers = (dispatch) => {
  fetchUsers().then(users => dispatch(loadUsers(users)));
}

const App = props => {
  const user = useShallowEqualSelector(state => state.users[props.id], shallowEqual);
  const handlerA = useDispatchHandler(handleA, user);
  useDispatchEffect(loadUsers);
    
  // :
  // :

  // far from the component definition.
  return (
    <div>...</div>
  );
}
```

## API

### useShallowEqualSelector

This is a custom hook for a selector, which uses `shallowEqual` for the comparison.
This is what `connect` does.
`useSelector` uses `===` for the comparison so it sometimes causes undesirable updates.

https://react-redux.js.org/api/hooks#recipe-useshallowequalselector

```ts
const state = useShallowEqualSelector((state: any) => state)
```

### useDispatchHandler

This is a custom hook to define a handler using closure values and its arguments.
This returns a memoized handler using `useCallback`.

- `(dispatch, ...closureVariables) => (...paramsOfHandler) => void`


```ts
const handlePagination = (dispatch, pagination) => (nextPage) => {
    //...
}

const App = () => {
    const pagination = usePagination();
    const onChangePagination = useDispatchHandler(handlePagination, pagination)
    return (
        <Pagination
            pagination={pagination}
            onClick={onChangePagination}
        />
    );
}
```

### useDispatchEffect

This is a custom hook to define a effect handler using `dispatch`.

```ts
const fetchNewData = (dispatch, userId) => {
    // ...
}

const App = () => {
    const user = useShallowEqualSelector(state => state.user);
    useDispatchEffect(fetchNewData, user.id);
    // ...
}
```

### useDispatchEffectManualDeps

TBA

```ts
```
