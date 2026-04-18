export interface Celebrity {
  id: string;
  name: string;
  photo: string;
  bio: string;
  category: string;
  nationality?: string | null;
  avgRating: number;
  totalVotes: number;
}
