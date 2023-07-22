import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";

const RootRouter = () => {
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RootRouter;
