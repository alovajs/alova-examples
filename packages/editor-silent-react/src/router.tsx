import { createBrowserRouter } from "react-router-dom";
import Detail from "./views/detail/Detail";
import Home from "./views/home/Home";

export default createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/detail',
    element: <Detail />,
  },
]);