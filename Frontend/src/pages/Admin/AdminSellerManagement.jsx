import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInterceptor";

const AdminSellerManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const fetchSellers = async () => {
    setLoading(true); 
    try {
      const res = await axiosInstance.get("/admin/sellers");
      setSellers(res.data);
    } catch (err) {
      console.error("Error fetching sellers", err);
    } finally {
      setLoading(false);
    }
  };
  const handleApproval = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/sellers/${id}/approve`, {
        isApproved: status,
      });
      setMessage(`Seller ${status ? "approved" : "rejected"} successfully`);
      fetchSellers();
    } catch (err) {
      console.error("Approval error", err);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this seller?")) return;
    try {
      await axiosInstance.delete(`/admin/seller/${id}`);
      setMessage("Seller deleted successfully");
      fetchSellers();
    } catch (err) {
      console.error("Delete error", err);
    }
  };
  useEffect(() => {
    fetchSellers();
  }, []);
  return (
    <div className="container mt-1">
      <h2 className="mb-4 text-center">Seller Management</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading sellers...</p>
        </div>
      ) : sellers.length === 0 ? (
        <div className="alert alert-warning">No sellers found.</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Restaurant</th>
              <th>Approval</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s._id}>
                <td>{s.sellerName}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.restaurant?.name || "-"}</td>
                <td>
                  <span
                    className={`badge ${
                      s.isApproved ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {s.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td>
                  {!s.isApproved ? (
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleApproval(s._id, true)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleApproval(s._id, false)}
                    >
                      Revoke
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSellerManagement;
