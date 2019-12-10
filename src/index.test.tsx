import React from 'react'
import { create, act, ReactTestRenderer } from 'react-test-renderer'
import { Provider } from 'react-redux'
import { createStore, Store, Dispatch } from 'redux'
import { useShallowEqualSelector, useDispatchHandler, useDispatchEffect, useDispatchEffectManualDeps } from '.'

// You can re-render using a returned function
const renderWithStore = (store: Store, element: React.ReactNode): ((element: React.ReactNode) => void) => {
  let instance: ReactTestRenderer
  act(() => {
    instance = create(<Provider store={store}>{element}</Provider>)
  })
  return (updatedElement: React.ReactNode) => {
    act(() => {
      instance.update(<Provider store={store}>{updatedElement}</Provider>)
    })
  }
}

describe('useShallowEqualSelector', () => {
  it('should not re-render if the value is reference equality', () => {
    let count = 0
    const store = createStore(() => ({ bar: 'bar' }))
    const App = () => {
      count += 1
      useShallowEqualSelector((state: any) => state)
      return null
    }

    renderWithStore(store, <App />)
    expect(count).toBe(1)

    act(() => {
      store.dispatch({ type: 'FOO' })
    })

    expect(count).toBe(1)
  })

  it('should not re-render if shallowEqual returns true', () => {
    let count = 0
    const store = createStore(() => ({ ...{ bar: 'bar' } }))
    const App = () => {
      count += 1
      useShallowEqualSelector((state: any) => ({ ...state }))
      return null
    }

    renderWithStore(store, <App />)
    expect(count).toBe(1)

    act(() => {
      store.dispatch({ type: 'FOO' })
    })

    expect(count).toBe(1)
  })
  it('should re-render if shallowEqual returns false', () => {
    let count = 0
    const store = createStore(() => ({ bar: 'bar', count }))

    const App = () => {
      count += 1
      useShallowEqualSelector((state: any) => ({ ...state }))
      return null
    }
    renderWithStore(store, <App />)
    expect(count).toBe(1)

    act(() => {
      store.dispatch({ type: 'FOO' })
    })

    expect(count).toBe(2)
  })
})

describe('useDispatchHandler', () => {
  type Props = {
    args: [string, string]
  }
  let store: Store
  let dispatchHandler: (...args1: [Dispatch, string, string]) => (...args2: string[]) => void
  let args: any[]
  let handlers: any[]
  let App: React.FC<Props>

  beforeEach(() => {
    store = createStore(() => ({}))
    dispatchHandler = (...args1: [Dispatch, string, string]) => (...args2: string[]) => {
      args = [args1, args2]
    }
    handlers = []
    App = (props: Props) => {
      const handler = useDispatchHandler(dispatchHandler, ...props.args)
      handler('bar1', 'bar2')
      handlers.push(handler)
      return null
    }
  })

  it('should create a callback using 2nd arguments and dispatch', () => {
    renderWithStore(store, <App args={['foo1', 'foo2']} />)

    expect(args).toEqual([
      [store.dispatch, 'foo1', 'foo2'],
      ['bar1', 'bar2'],
    ])
  })

  it('should create a reference equalit handler if the deps has not been changed', () => {
    const update = renderWithStore(store, <App args={['foo1', 'foo2']} />)
    update(<App args={['foo1', 'foo2']} />)

    expect(handlers[0]).toBe(handlers[1])
  })

  it('should create a new handler if the deps has been changed', () => {
    const update = renderWithStore(store, <App args={['foo1', 'foo2']} />)
    update(<App args={['foo1', 'foo3']} />)

    expect(handlers[0]).not.toBe(handlers[1])
  })
})

describe('useDispatchEffect', () => {
  type Props = {
    args: [string, string]
  }
  let store: Store
  let count: number
  let App: React.FC<Props>

  beforeEach(() => {
    store = createStore(() => ({}))
    count = 0
    const effect = (_dispatch: Dispatch, _foo: string, _bar: string) => {
      count += 1
    }
    App = (props: Props) => {
      useDispatchEffect(effect, ...props.args)
      return null
    }
  })

  it('should not run the effect if the deps has not been changed', () => {
    const update = renderWithStore(store, <App args={['foo', 'bar']} />)
    expect(count).toBe(1)

    update(<App args={['foo', 'bar']} />)

    expect(count).toBe(1)
  })

  it('should run the effect if the deps has been changed', () => {
    const update = renderWithStore(store, <App args={['foo', 'bar']} />)
    expect(count).toBe(1)

    update(<App args={['foo', 'bar2']} />)

    expect(count).toBe(2)
  })
})

describe('useDispatchEffectManualDeps', () => {
  type Props = {
    args: [string, string]
    deps: string[]
  }
  let store: Store
  let count: number
  let App: React.FC<Props>

  beforeEach(() => {
    store = createStore(() => ({}))
    count = 0
    const effect = (_dispatch: Dispatch, _foo: string, _bar: string) => {
      count += 1
    }
    App = (props: Props) => {
      useDispatchEffectManualDeps(effect, props.deps, ...props.args)
      return null
    }
  })

  it('should not run the effect if the deps has not been changed', () => {
    const update = renderWithStore(store, <App args={['foo', 'bar']} deps={['foo']} />)
    expect(count).toBe(1)

    // the args has been changed, but the deps hasn't been changed
    update(<App args={['foo', 'bar2']} deps={['foo']} />)

    expect(count).toBe(1)
  })

  it('should run the effect if the deps has been changed', () => {
    const update = renderWithStore(store, <App args={['foo', 'bar']} deps={['foo']} />)
    expect(count).toBe(1)

    // the args has not been changed, but the deps has been changed
    update(<App args={['foo', 'bar']} deps={['fo2']} />)

    expect(count).toBe(2)
  })
})