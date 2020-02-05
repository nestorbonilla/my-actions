import React from "react";

import { Switch, Route, BrowserRouter } from 'react-router-dom';

import DashboardPage from './components/dashboard/dashboard.component';
import Navbar from "./components/layout/navbar.component";
import Footer from "./components/layout/footer.component";
import OpportunityDetails from "./components/opportunity/opportunityDetails.component";
import OpportunityCreate from "./components/opportunity/opportunityCreate.component";

export default () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/' component={DashboardPage} />
          <Route path='/opportunity/:id' render={(props) => <OpportunityDetails {...props} />} /> />
          <Route path='/create' component={OpportunityCreate} />
        </Switch>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
