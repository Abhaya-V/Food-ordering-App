import React, { useState } from 'react';

const ReviewModal = ({ show, onClose, onSubmit, foodName, type }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide rating and comment.");
      return;
    }
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    onClose();
  };
  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Review {type === "restaurant" ? "Restaurant" : foodName}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label>Rating (1 to 5):</label>
            <input
              type="number"
              min={1}
              max={5}
              className="form-control mb-3"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            />
            <label>Comment:</label>
            <textarea
              className="form-control"
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
