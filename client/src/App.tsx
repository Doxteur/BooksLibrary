import React from 'react';
import './App.css';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './app/store';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './router';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
      <ToastContainer />
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppRoutes />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
