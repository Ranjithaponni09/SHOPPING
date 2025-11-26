import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { CCard, CCardBody, CRow, CCol } from "@coreui/react";

export default function UserProductList() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Products</h2>

      <CRow>
        {products.map((p) => (
          <CCol key={p._id} sm={4}>
            <CCard className="mb-3">
              <CCardBody>
                <img
                  src={`http://localhost:5005/uploads/${p.image}`}
                  style={{ width: "100%", borderRadius: "10px" }}
                  alt={p.title}
                />

                <h5 className="mt-2">{p.title}</h5>

                <p className="fw-bold">
                  ₹{p.salePrice ? p.salePrice : p.price}
                  {p.salePrice && (
                    <span
                      className="text-muted"
                      style={{ textDecoration: "line-through", marginLeft: "8px" }}
                    >
                      ₹{p.price}
                    </span>
                  )}
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  );
}
