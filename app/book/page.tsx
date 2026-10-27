"use client";

import BookDetails from "@/components/BookDetails";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BookPage = () => {
  const params = useParams();
  const [bookDetails, setBookdetails] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axios.get(`/api/books/${params.bookId}`);
        setBookdetails(res.data);
      } catch (error) {
        console.error("Failed to fetch book details", error);
      }
    };

    if (params?.bookId) {
      fetchBookDetails();
    }
  }, [params?.bookId]);

  return (
    <div>
      {bookDetails ? (
        <BookDetails {...bookDetails} />
      ) : (
        <div className="py-5 px-5 min-h-screen flex items-center justify-center text-foreground">
          <Loader2 className="animate-spin mr-1" /> Loading books details...
        </div>
      )}
    </div>
  );
};

export default BookPage;