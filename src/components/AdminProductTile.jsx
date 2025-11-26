import React from "react";
import { CCard, CCardBody, CCardTitle, CButton } from "@coreui/react";

export default function AdminProductTile({ product, onEdit, onDelete }) {
  // Construct image URL for the product
  const imageUrl = product?.image
    ? `http://localhost:5005/uploads/${product.image.replace(/^\/+/, "")}`
    : "/placeholder.png";  // Default image if no product image

  return (
    <CCard className="mb-3" style={{ maxWidth: 320 }}>
      <img
        src={imageUrl}
        alt={product.title}
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />

      <CCardBody>
        <CCardTitle>{product.title}</CCardTitle>

        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          ₹{product.price}
          {product.salePrice && (
            <span style={{ marginLeft: 8, color: "green" }}>
              → ₹{product.salePrice}
            </span>
          )}
        </div>

        <div className="d-flex justify-content-between mt-3">
          <CButton color="info" size="sm" onClick={onEdit}>Edit</CButton>
          <CButton color="danger" size="sm" onClick={onDelete}>Delete</CButton>
        </div>
      </CCardBody>
    </CCard>
  );
}
