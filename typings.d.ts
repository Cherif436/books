interface Book {
  _id: string;
  title: string;
  author: string;
  cover: string;
  genre?: string;
  addedBy?: {
    id: string;
    firstName: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedYear: number;
  description: string;
}