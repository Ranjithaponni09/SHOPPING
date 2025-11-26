import React, { useEffect, useState } from "react";
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CSpinner,
} from "@coreui/react";

import api from "../api/axios";
import ProductModal from "./ProductModal";
import AdminProductTile from "./AdminProductTile";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Delete failed");
    }
  };

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h4 className="m-0">Products Admin</h4>

              <CButton
                color="primary"
                className="text-white fw-bold"
                onClick={() => {
                  setEditData(null);
                  setModalOpen(true);
                }}
              >
                + Add Product
              </CButton>
            </CCardHeader>

            <CCardBody>
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <CRow>
                  {products.length === 0 ? (
                    <h6>No products found</h6>
                  ) : (
                    products.map((p) => (
                      <CCol md={4} key={p._id}>
                        <AdminProductTile
                          product={p}
                          onEdit={() => {
                            setEditData(p);
                            setModalOpen(true);
                          }}
                          onDelete={() => handleDelete(p._id)}
                        />
                      </CCol>
                    ))
                  )}
                </CRow>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* PRODUCT MODAL */}
      <ProductModal
        visible={modalOpen}
        setVisible={setModalOpen}
        editData={editData}
        refresh={fetchProducts}
      />
    </>
  );
}
