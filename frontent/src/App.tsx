import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/FrontentRoutes'
import { AuthProvider } from './context/authContext'
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
    </Provider>
    
  )
}

export default App
