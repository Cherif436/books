import AddBookForm from "@/components/add-book/AddBookForm";
import React from "react";

const AddBook = () => {
  return (
    <div className="py-5 min-h-screen px-4">
      <h1 className="text-5xl! md:text-3xl font-bold text-foreground text-center">
        Add a New Book
      </h1>

      <p className="text-base text-[#847062] leading-relaxed text-center">
        Share a literary treasure with our community
      </p>

      {/* Form */}
      <AddBookForm />
    </div>
  );
};

export default AddBook;