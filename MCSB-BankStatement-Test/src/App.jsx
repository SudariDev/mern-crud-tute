import { useState } from "react";
import GenerateBankStatement from "./formData/generateBankStatement ";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GenerateBankStatement />
    </>
  );
}

export default App;
