import React, { useState } from "react";
import { addAddress } from "../../services/Api";

const AddAddressModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        province: "",
        ward: "",
        detail: "",
        is_default: false,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.province || !formData.ward || !formData.detail) {
            setError("All fields are required");
            return;
        }

        if (formData.detail.length < 5) {
            setError("Address detail must be at least 5 characters");
            return;
        }

        try {
            setLoading(true);
            const result = (await addAddress(formData)).data;

            if (result.status === "success") {
                onSuccess(result.data);
            } else {
                setError(result.message || "Failed to add address");
            }
        } catch (err) {
            setError("Error adding address");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Address</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="modal-form-group">
                            <label htmlFor="province">Province / City *</label>
                            <input
                                type="text"
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                placeholder="e.g., Hồ Chí Minh"
                                disabled={loading}
                            />
                        </div>

                        <div className="modal-form-group">
                            <label htmlFor="ward">Ward / District *</label>
                            <input
                                type="text"
                                id="ward"
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                placeholder="e.g., District 1"
                                disabled={loading}
                            />
                        </div>

                        <div className="modal-form-group">
                            <label htmlFor="detail">Address Details *</label>
                            <input
                                type="text"
                                id="detail"
                                name="detail"
                                value={formData.detail}
                                onChange={handleChange}
                                placeholder="Street, building number, apartment..."
                                disabled={loading}
                            />
                        </div>

                        <div className="modal-form-group">
                            <label htmlFor="is_default" style={{ display: "flex", alignItems: "center", marginBottom: 0 }}>
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleChange}
                                    disabled={loading}
                                    style={{ width: "auto", marginRight: "8px", cursor: "pointer" }}
                                />
                                Set as default address
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add Address"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAddressModal;
