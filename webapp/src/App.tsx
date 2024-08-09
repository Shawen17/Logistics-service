import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/products" exact>
        <ProductsPage />
      </Route>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      <Route path="/signup" exact>
        <SignupPage />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
