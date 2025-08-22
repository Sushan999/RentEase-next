"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, User, Trash2 } from "lucide-react";
import { Review } from "@/types/component-props";
import { PropertiesReviewClientProps } from "@/types/component-props";
import LoadingSpinner from "./LoadingSpinner";
import { useSession } from "next-auth/react";

export default function PropertyReviewsClient({
  propertyId,
  canSubmit,
}: PropertiesReviewClientProps) {
  const { data: session } = useSession();
  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to delete review");
        return;
      }
      fetchReviews();
    } catch (error) {
      alert("Error deleting review");
    }
  };
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?propertyId=${propertyId}`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async () => {
    setApiError(null);
    if (rating < 1) {
      setApiError("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Failed to submit review");
        return;
      }
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      setApiError("An unknown error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (current: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer ${
          i < current ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
        onClick={() => setRating(i + 1)}
      />
    ));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
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
              {session?.user?.id &&
                review.tenantId === Number(session.user.id) && (
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    title="Delete Review"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
            </div>
            <div className="flex mt-1">{renderStars(review.rating)}</div>
            {review.comment && (
              <p className="text-gray-700 mt-1">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
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
          disabled={submitting}
        >
          {submitting ? <LoadingSpinner /> : "Submit Review"}
        </button>
        {apiError && <p className="text-red-500 mt-2">{apiError}</p>}
      </div>
    </div>
  );
}
