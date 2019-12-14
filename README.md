# react-redux-extended-hooks
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

TBA

```ts
```

### useDispatchEffect

TBA

```ts
```

### useDispatchEffectManualDeps

TBA

```ts
```
