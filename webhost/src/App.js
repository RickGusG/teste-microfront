import React, { Suspense } from 'react';
import { loadComponent } from './util/load-component';

const App1 = React.lazy(
  loadComponent(
    'app1',
    'default',
    './App',
    'http://localhost:8081/index.bundle?platform=web'
  )
);

const App = () => {
  return (
    <div>
      <h1>Webhost!</h1>
      <Suspense fallback="Loading...">
        <App1/>
      </Suspense>
    </div>
  );
};

export default App;
