import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CCard, CCardBody, CFormInput, CButton, CListGroup, CListGroupItem } from '@coreui/react';
import NavBar from './NavBar';

export default function ProductsAdmin(){
  const [title,setTitle] = useState('');
  const [price,setPrice] = useState('');
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await api.get('/api/products');
      setList(res.data);
    } catch(e) {
      console.error(e);
      alert('Failed to load products');
    }
  };

  useEffect(()=>{ fetchList(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', { title, price: Number(price) });
      setTitle(''); setPrice('');
      fetchList();
    } catch(e) {
      alert('Create failed: ' + (e.response?.data?.msg || e.message));
    }
  };

  return (
    <div>
      <CCard className="mb-3">
        <NavBar/>
        <CCardBody>
          <h3>Products Admin</h3>
          <form onSubmit={save} className="d-flex gap-2">
            <CFormInput placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <CFormInput placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
            <CButton type="submit">Create</CButton>
          </form>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardBody>
          <h5>All products</h5>
          <CListGroup>
            {list.map(p => (
              <CListGroupItem key={p._id}>
                {p.title} — ₹{p.price}
              </CListGroupItem>
            ))}
          </CListGroup>
        </CCardBody>
      </CCard>
    </div>
  );
}
