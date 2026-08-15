import React, { useEffect, useState } from "react";

export default function ShopReviews({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token"); // adjust per your auth

  useEffect(() => {
    if (!restaurantId) return;
    fetchReviews();
  }, [restaurantId]);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`);
      const json = await res.json();
      if (json.success) setReviews(json.data || []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  }

  async function submitReview(e) {
    e.preventDefault();
    if (!token) {
      alert("Please log in to post a review.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const json = await res.json();
      if (json.success) {
        setComment("");
        setRating(5);
        fetchReviews();
      } else {
        alert(json.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Customer Reviews ({reviews.length})</h3>
      <div className="space-y-3 mb-4">
        {reviews.length === 0 && <div className="text-sm text-gray-500">No reviews yet — be the first to review.</div>}
        {reviews.map((r) => (
          <div key={r._id || Math.random()} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <strong>{r.user}</strong>
              <span className="text-yellow-500">{Array.from({ length: Math.round(r.rating || 0) }).map((_, i) => (<span key={i}>★</span>))}</span>
            </div>
            <div className="text-sm text-gray-700">{r.comment}</div>
          </div>
        ))}
      </div>

      <form onSubmit={submitReview} className="mt-3">
        <label className="block text-sm font-medium mb-1">Your rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border p-2 rounded mb-2">
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n>1?"s":""}</option>)}
        </select>

        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="w-full border p-2 rounded mb-2" rows={3} />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Posting..." : "Post review"}
        </button>
      </form>
    </div>
  );
}
