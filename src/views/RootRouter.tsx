import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Sex from "./Sex";

const RootRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sex" element={<Sex />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RootRouter;
