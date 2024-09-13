import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import KanbanBoard from './pages/KanbanBoard/KanbanBoard';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/products" exact>
        <ProductsPage />
      </Route>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      <Route path="/signup" exact>
        <SignupPage />
      </Route>
      <Route path="/" exact>
        <KanbanBoard />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
