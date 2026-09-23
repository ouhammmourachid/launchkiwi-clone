/** Central React Query keys so invalidation stays consistent. */
export const queryKeys = {
  votes: (userId: string | undefined) => ["votes", userId] as const,
  upvoteCount: (productId: string) => ["upvote-count", productId] as const,
  favorites: (userId: string | undefined) => ["favorites", userId] as const,
  comments: (productId: string) => ["comments", productId] as const,
  myProducts: (userId: string | undefined) => ["my-products", userId] as const,
};
