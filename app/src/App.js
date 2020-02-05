import React from "react";
import { Drizzle } from "@drizzle/store";
import { drizzleReactHooks } from "@drizzle/react-plugin";

import "./App.css";

import drizzleOptions from "./drizzleOptions";
import LoadingContainer from "./LoadingContainer";
import MyComponent from "./MyComponent";

const drizzle = new Drizzle(drizzleOptions);
const { DrizzleProvider } = drizzleReactHooks;

function App () {
  
  return (
    <DrizzleProvider drizzle={drizzle}>
      <LoadingContainer>
        <MyComponent/>
      </LoadingContainer>
    </DrizzleProvider>
  );
}

export default App;
