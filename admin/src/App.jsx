import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';
import Department from './pages/dashboard/Department';
import SideNav from './components/SideNav';
import User from './pages/dashboard/User';
import { getAllUser } from './redux/slices/user.slice';
import { useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    const companyId = localStorage.getItem("companyId")
    if (companyId) {
      dispatch(getAllUser(companyId))
    }
  }, [])
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<Register />} />
      <Route path="/*" element={<PrivateRoute element={<SideNav >

        <Routes>
          <Route path="department" element={<PrivateRoute element={<Department />} />} />
          <Route path="user" element={<PrivateRoute element={<User />} />} />
        </Routes>
      </SideNav>} />}>

      </Route>
    </Routes>
  );
};

export default App;
