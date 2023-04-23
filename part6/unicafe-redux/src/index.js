import React from 'react'
import ReactDOM from 'react-dom/client'

import { legacy_createStore as createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const handleGoodClick = () => {
    store.dispatch({
      type: "GOOD"
    });
  };

  const handleOkClick = () => {
    store.dispatch({
      type: "OK"
    });
  };

  const handleBadClick = () => {
    store.dispatch({
      type: "BAD"
    });
  };

  const handleResetClick = () => {
    store.dispatch({
      type: "ZERO"
    });
  };

  return (
    <div>
      <button onClick={handleGoodClick}>good</button> 
      <button onClick={handleOkClick}>ok</button> 
      <button onClick={handleBadClick}>bad</button>
      <button onClick={handleResetClick}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
