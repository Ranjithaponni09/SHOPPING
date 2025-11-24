import React from 'react';
import { CCard, CCardBody, CRow, CCol } from '@coreui/react';
import { useSelector } from 'react-redux';
import NavBar from './NavBar';

export default function AdminDashboard(){
  const user = useSelector(s => s.auth.user);
  return (
    <div>
      <NavBar/>
      <CCard className="mb-3">
        <CCardBody>
          <h1 className="mb-0">Welcome, {user ? user.name : 'Admin'}!</h1>
          <p className="text-muted">This is your admin dashboard — built with CoreUI.</p>
        </CCardBody>
      </CCard>

      <CRow>
        <CCol sm={6}>
          <CCard className="mb-3">
            <CCardBody>
              <h4>Quick Stats</h4>
              <p className="mb-0">You can display metrics, charts, and quick actions here.</p>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={6}>
          <CCard className="mb-3">
            <CCardBody>
              <h4>Recent Activity</h4>
              <p className="mb-0">Show admin notifications, logs or quick links.</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
}
