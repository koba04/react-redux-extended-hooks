# react-redux-extended-hooks
![npm](https://img.shields.io/npm/v/react-redux-extended-hooks)

A React Hooks for React Redux applications

## How to use

```
npm install react-redux-extended-hooks
// install peerDependencies
npm install react redux react-redux
```

## API

### useShallowEqualSelector

This is a custom hooks for a selector, which uses `shallowEqual` for the comparison.
This is what `connect` does.
`useSelector` uses `===` for the comparison so it sometimes causes undesirable updates.

https://react-redux.js.org/api/hooks#recipe-useshallowequalselector

```ts
const state = useShallowEqualSelector((state: any) => state)
```

### useDispatchHandler

This is a custom hook to define a handler using closure values and its arguments.

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
