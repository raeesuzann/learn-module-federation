import React, { Suspense, lazy } from "react";
import "./App.css";

const Header = lazy(() =>
  import("HeaderApp/Header").catch(() => {
    return { default: () => <>Service is down!</> };
  })
);

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading Header...</div>}>
        <Header />
      </Suspense>
      <div className="container">This is my home page</div>
    </div>
  );
}

export default App;
