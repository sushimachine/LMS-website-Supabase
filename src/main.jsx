import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Login from './Components/Login.jsx'
import Signup from './Components/Signup.jsx'
import CourseDetail from './Pages/CourseDetail.jsx'
import { Authprovider } from './Context/Authcontext.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import Browse from './Pages/browse.jsx'

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [
      {
        path : '/',
        element : <Home/>
      },
      {
        path : '/CourseDetail/:courseId',
        element : <CourseDetail/>
      },
      {
        path : '/courses',
        element : <Browse/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Authprovider>
        <RouterProvider router={router}/>
      </Authprovider>
    </Provider>
  </StrictMode>
)