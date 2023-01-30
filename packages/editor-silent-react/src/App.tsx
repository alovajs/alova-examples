import './App.css';
import QueueConsole from './components/QueueConsole';
import { RouterProvider } from "react-router-dom";
import router from './router';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <div className="app">
      <SnackbarProvider maxSnack={10}>
        <div className="page-container">
          <RouterProvider router={router} />
        </div>
        <QueueConsole />
      </SnackbarProvider>
    </div>
  )
}

export default App
