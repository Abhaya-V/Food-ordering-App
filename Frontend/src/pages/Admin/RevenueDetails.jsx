import React, { useEffect, useState } from "react";
import axios from "axios";

const RevenueDetails = () => {
  const [commissionReport, setCommissionReport] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/order/orders");
        if (res.data.commissionReport) {
          setCommissionReport(res.data.commissionReport);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) return <div className="p-4">Loading revenue data...</div>;

  return (
    <div className="container py-2">
      <h2 className="text-center mb-4">Restaurant Revenue Report</h2>
      {Object.keys(commissionReport).length === 0 ? (
        <p className="text-center">No revenue data available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Restaurant</th>
                <th>Total Revenue</th>
                <th>Admin Commission (10%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(commissionReport).map(([resId, data]) => (
                <tr key={resId}>
                  <td>{data.name}</td>
                  <td className="text-black">₹{data.revenue}</td>
                  <td className="text-black">₹{data.commission.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RevenueDetails;
