import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getProfile, updateEmail, updatePhone, deleteAddress } from "../../services/Api";
import "./profile.css";
import ChangePasswordModal from "./ChangePasswordModal";
import AddAddress from "../../shared/components/Address/AddAddress";
import EditAddress from "../../shared/components/Address/EditAddress";

const Profile = () => {
    const auth = useAuth();
    const [userData, setUserData] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showEditAddress, setShowEditAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const axiosResponse = await getProfile();
            // axios wraps response in data property
            const result = axiosResponse.data;
            if (result && result.status === "success" && result.data) {
                setUserData(result.data);
                setEditEmail(result.data.email || "");
                setEditPhone(result.data.phone || "");
            } else {
                setError("Invalid response format");
            }
        } catch (err) {
            console.error("Profile loading error:", err);
            setError("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmail = async () => {
        try {
            setError(null);
            const result = (await updateEmail({ email: editEmail })).data;
            if (result.status === "success") {
                setUserData({ ...userData, email: editEmail });
                setIsEditingEmail(false);
                setSuccess("Email updated successfully");
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(result.message || "Failed to update email");
            }
        } catch (err) {
            setError("Error updating email");
        }
    };

    const handleUpdatePhone = async () => {
        try {
            setError(null);
            const result = (await updatePhone({ phone: editPhone })).data;
            if (result.status === "success") {
                setUserData({ ...userData, phone: editPhone });
                setIsEditingPhone(false);
                setSuccess("Phone updated successfully");
                setTimeout(() => setSuccess(null), 3000);
            } else {
                setError(result.message || "Failed to update phone");
            }
        } catch (err) {
            setError("Error updating phone");
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;

        try {
            const result = await deleteAddress(addressId);
            if (result.status === "success") {
                setUserData({
                    ...userData,
                    addresses: userData.addresses.filter((a) => a._id !== addressId),
                });
                setSuccess("Address deleted successfully");
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setError("Error deleting address");
        }
    };

    const handleEditAddress = (address) => {
        setSelectedAddress(address);
        setShowEditAddress(true);
    };

    const handleAddressAdded = (newAddress) => {
        let addresses = [...userData.addresses];
        // If new address is default, remove default flag from others
        if (newAddress.is_default) {
            addresses = addresses.map((a) => ({ ...a, is_default: false }));
        }
        addresses.push(newAddress);
        setUserData({
            ...userData,
            addresses,
        });
        setShowAddAddress(false);
        setSuccess("Address added successfully");
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleAddressUpdated = (updatedAddress) => {
        let addresses = userData.addresses.map((a) =>
            a._id === updatedAddress._id ? updatedAddress : a
        );
        // If updated address is default, remove default flag from others
        if (updatedAddress.is_default) {
            addresses = addresses.map((a) =>
                a._id === updatedAddress._id ? a : { ...a, is_default: false }
            );
        }
        setUserData({
            ...userData,
            addresses,
        });
        setShowEditAddress(false);
        setSuccess("Address updated successfully");
        setTimeout(() => setSuccess(null), 3000);
    };

    if (loading) {
        return <div className="profile-container"><p>Loading...</p></div>;
    }

    if (!userData) {
        return <div className="profile-container"><p>No profile data found</p></div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Personal Information */}
                <section className="profile-section">
                    <h2>Personal Information</h2>
                    <div className="profile-info">
                        <div className="info-group">
                            <label>Full Name</label>
                            <p>{userData.full_name || "Not provided"}</p>
                        </div>

                        {/* Email Section */}
                        <div className="info-group">
                            <label>Email</label>
                            {isEditingEmail ? (
                                <div className="edit-field">
                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="form-control"
                                    />
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={handleUpdateEmail}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            setIsEditingEmail(false);
                                            setEditEmail(userData.email);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="view-field">
                                    <p>{userData.email}</p>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => setIsEditingEmail(true)}
                                    >
                                        Change Email
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Phone Section */}
                        <div className="info-group">
                            <label>Phone Number</label>
                            {isEditingPhone ? (
                                <div className="edit-field">
                                    <input
                                        type="tel"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="form-control"
                                    />
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={handleUpdatePhone}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => {
                                            setIsEditingPhone(false);
                                            setEditPhone(userData.phone);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="view-field">
                                    <p>{userData.phone || "Not provided"}</p>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => setIsEditingPhone(true)}
                                    >
                                        Change Phone
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Change Password */}
                        <div className="info-group">
                            <button
                                className="btn btn-warning"
                                onClick={() => setShowChangePassword(true)}
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </section>

                {/* Address Management */}
                <section className="profile-section">
                    <div className="section-header">
                        <h2>Manage Addresses</h2>
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => setShowAddAddress(true)}
                        >
                            + Add Address
                        </button>
                    </div>

                    {userData.addresses && userData.addresses.length > 0 ? (
                        <div className="addresses-list">
                            {userData.addresses.map((address) => (
                                <div key={address._id} className="address-card">
                                    <div className="address-info">
                                        <p className="address-detail">
                                            {address.detail}
                                        </p>
                                        <p className="address-location">
                                            {address.ward}, {address.province}
                                        </p>
                                        {address.is_default && (
                                            <span className="badge bg-primary">
                                                Default Address
                                            </span>
                                        )}
                                    </div>
                                    <div className="address-actions">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleEditAddress(address)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteAddress(address._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-addresses">No addresses added yet</p>
                    )}
                </section>
            </div>

            {/* Modals */}
            {showChangePassword && (
                <ChangePasswordModal
                    onClose={() => setShowChangePassword(false)}
                    onSuccess={() => {
                        setShowChangePassword(false);
                        setSuccess("Password changed successfully");
                        setTimeout(() => setSuccess(null), 3000);
                    }}
                />
            )}

            {showAddAddress && (
                <AddAddress
                    onClose={() => setShowAddAddress(false)}
                    onSuccess={handleAddressAdded}
                />
            )}

            {showEditAddress && selectedAddress && (
                <EditAddress
                    address={selectedAddress}
                    onClose={() => {
                        setShowEditAddress(false);
                        setSelectedAddress(null);
                    }}
                    onSuccess={handleAddressUpdated}
                />
            )}
        </div>
    );
};

export default Profile;