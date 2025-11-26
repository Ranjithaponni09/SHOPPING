import React, { useState, useEffect } from "react";
import {
  CModal, CModalHeader, CModalBody, CModalFooter,
  CButton, CForm, CFormInput,
  CImage
} from "@coreui/react";

import api from "../api/axios";

const ProductModal = ({ visible, setVisible, editData, refresh }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [oldImage, setOldImage] = useState("");

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setPrice(editData.price);
      setSalePrice(editData.salePrice || "");
      setOldImage(editData.image);
    } else {
      setTitle("");
      setPrice("");
      setSalePrice("");
      setOldImage("");
    }
    setImageFile(null);
  }, [editData, visible]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("price", price);
    fd.append("salePrice", salePrice);
    if (imageFile) fd.append("image", imageFile);

    try {
      if (editData) {
        await api.put(`/api/products/${editData._id}`, fd);
      } else {
        await api.post(`/api/products/add`, fd);
      }

      refresh();
      setVisible(false);

    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>{editData ? "Edit Product" : "Create Product"}</CModalHeader>

      <CModalBody>
        <CForm>

          <CFormInput label="Title" value={title}
            onChange={(e) => setTitle(e.target.value)} />

          <CFormInput type="number" label="Price" value={price}
            onChange={(e) => setPrice(e.target.value)} />

          <CFormInput type="number" label="Sale Price" value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)} />

          <CFormInput type="file" label="Image"
            onChange={(e) => setImageFile(e.target.files[0])} />

          {imageFile && (
            <>
              <p>New Image Preview:</p>
              <CImage src={URL.createObjectURL(imageFile)} height={120} />
            </>
          )}

          {!imageFile && oldImage && (
            <>
              <p>Current Image:</p>
              <CImage
                src={`http://localhost:5005/${oldImage}`}
                height={120}
              />
            </>
          )}

        </CForm>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
        <CButton color="primary" onClick={onSubmit}>
          {editData ? "Update" : "Create"}
        </CButton>
      </CModalFooter>

    </CModal>
  );
};

export default ProductModal;
