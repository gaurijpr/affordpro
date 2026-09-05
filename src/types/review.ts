export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface ReviewBreakdown {
  averageRating: number;
  totalReviews: number;
  starsCount: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
