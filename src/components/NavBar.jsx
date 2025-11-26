import React from 'react';
import { CHeader, CContainer, CButton } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../api/axios';


export default function NavBar() {
  const token = useSelector(s => s.auth.token);
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/api/auth/logout', { refreshToken });
    } catch (e) {}
    dispatch(logout());
    navigate('/login');
  };

  return (
    <CHeader position="sticky" className="mb-3">
      <CContainer fluid className="topnav">
      <div className="nav-item" onClick={() => navigate('/products')}>
  Products
</div>


        <div className="brand" onClick={() => navigate('/')}>
          SHOPPING
        </div>

        <div className="links">
          {token ? (
            <>
              <div className="nav-item" onClick={() => navigate('/admin')}>
                Dashboard
              </div>

              <div className="nav-item" onClick={() => navigate('/admin/products')}>
                Products
              </div>
    
              

              <span className="user">Hi, {user ? user.name : 'Admin'}</span>

              <CButton color="light" className="btn-ghost" onClick={doLogout}>
                Logout
              </CButton>
            </>
          ) : (
            <>
              <div className="nav-item" onClick={() => navigate('/login')}>
                Login
              </div>

              <div className="nav-item" onClick={() => navigate('/register')}>
                Register
              </div>
            </>
          )}
        </div>
      </CContainer>
    </CHeader>
  );
}