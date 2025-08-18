"use client";

import { useState, useEffect } from "react";

import { Star, User } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  tenant: { name: string };
}

interface Props {
  propertyId: number;
  canReview: boolean; // If tenant is eligible to review
}

export default function PropertyReviewsClient({
  propertyId,
  canReview,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?propertyId=${propertyId}`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReview = async () => {
    if (rating < 1) {
      alert("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      alert("Review submitted successfully");
      setRating(0);
      setComment("");
      fetchReviews(); // Refresh reviews
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (current: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer ${
          i < current ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        onClick={() => canReview && setRating(i + 1)}
      />
    ));

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>

      {/* Existing reviews */}
      {reviews.length === 0 && <p className="text-gray-500">No reviews yet</p>}
      <div className="space-y-4 mb-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-3">
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{review.tenant.name}</span>
              <span className="text-gray-500">
                ({new Date(review.createdAt).toLocaleDateString()})
              </span>
            </div>
            <div className="flex mt-1">{renderStars(review.rating)}</div>
            {review.comment && (
              <p className="text-gray-700 mt-1">{review.comment}</p>
            )}
          </div>
        ))}
      </div>

      {/* Submit new review */}
      {canReview && (
        <div className="space-y-2">
          <h3 className="font-semibold">Submit Your Review</h3>
          <div className="flex">{renderStars(rating)}</div>
          <textarea
            className="w-full border border-gray-300 rounded p-2 mt-2"
            rows={3}
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={submitReview}
            disabled={loading}
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}
