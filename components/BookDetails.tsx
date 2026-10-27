import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  BookMinus,
  BookPlus,
  Calendar,
  Dot,
  Edit,
  Loader2,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

const BookDetails = ({
  _id,
  title,
  author,
  cover,
  genre,
  description,
  publishedYear,
  addedBy,
  createdAt,
}: Book) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isCheckingLibrary, setIsCheckingLibrary] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  const router = useRouter();

  const formatDate = (d?: string) => {
    if (!d) return "";

    try {
      const date = new Date(d);
      if (isNaN(date.getTime())) return d;
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/books/${_id}`);
      console.log("Book deleted successfully");
      router.push("/explore");
    } catch (error) {
      console.error("Failed to delete book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddToLibrary = async () => {
    if (!_id) {
      console.log("Missing book id");
      return;
    }

    try {
      setIsAdding(true);
      const res = await axios.post("/api/library", { bookId: _id });
      console.log(res);

      if(res.data?.added){
        setIsInLibrary(true);
      }
    } catch (error) {
      console.error("Failed to add to library", error);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const checkLibray = async () => {
      if (!_id) {
        if (mounted) {
          setIsCheckingLibrary(false);
          return;
        }
      }

      try {
        setIsCheckingLibrary(true);

        const res = await axios.get("/api/library");
        console.log("response: ", res);
        const books = res.data?.library?.books || [];
        console.log("Books: ", books);
        const found = books.some((b: Book) => {
          if (!b) return false;
          if (b._id) {
            return b._id === _id;
          }
          return false;
        });

        console.log("Found: ", found);
        if (mounted) {
          setIsInLibrary(found);
        }
      } catch (error) {
        console.error("Failed to check library:", error);
      } finally {
        if (mounted) setIsCheckingLibrary(false);
      }
    };

    checkLibray();

    return () => {
      mounted = false;
    };
  }, [_id]);

  const handleRemoveFromLibrary = async () => {
    if (!_id) {
      return;
    }

    try {
      setIsRemoving(true);
      const res = await axios.delete("/api/library", { data: { bookId: _id } });

      if (res.data?.removed) {
        setIsInLibrary(false);
      }
    } catch (error) {
      console.error("Failed to remove from library", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row items-start">
        {/* Left: Image + Button */}
        <div className="w-full md:w-1/4 flex flex-col items-start">
          <div className="relative w-full h-[420px] overflow-hidden rounded-sm">
            {cover ? (
              <Image
                src={cover}
                alt="cover"
                className="w-full h-full object-contain"
                fill
              />
            ) : (
              <div>No cover available</div>
            )}
          </div>

          <div className="pt-4 w-full">
            {isCheckingLibrary ? (
              <Button className="w-full" disabled>
                <Loader2 className="w-4 h-4 animate-spin" />
              </Button>
            ) : isInLibrary ? (
              <>
                <Button
                  className="w-full"
                  onClick={handleRemoveFromLibrary}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <BookMinus />
                      Remove from Library
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={handleAddToLibrary}>
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <BookPlus />
                    Add to My Library
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Right: Metadata and description */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-start">
            {genre && <Badge variant="secondary">{genre}</Badge>}
            {isLoaded &&
            isSignedIn &&
            addedBy?.id &&
            user?.id === addedBy.id ? (
              <div>
                <Button variant={"ghost"} size="icon" asChild>
                  <Link href={`/book/${_id}/edit`}>
                    <Edit />
                  </Link>
                </Button>
                <Button variant={"ghost"} size="icon" onClick={handleDelete}>
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-destructive" />
                  )}
                </Button>
              </div>
            ) : null}
          </div>

          <h1 className="font-semibold text-2xl md:text-4xl lg:text-6xl!">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground mt-3">
            {author && (
              <div className="flex gap-1 items-center font-medium!">
                <User className="w-4 h-4" /> {author}
              </div>
            )}

            {publishedYear && (
              <div className="flex gap-1 items-center font-medium!">
                <Calendar className="w-4 h-4" />
                {publishedYear}
              </div>
            )}
          </div>

          <hr className="my-4" />

          <h2 className="font-semibold text-2xl pt-3">About This Book</h2>
          <p className="text-muted-foreground mt-2 whitespace-pre-line">
            {description}
          </p>

          <hr className="my-4" />

          <p className="flex items-center text-sm text-muted-foreground">
            {addedBy && (
              <span>
                Added by <span className="text-black">{addedBy.firstName}</span>
              </span>
            )}

            <Dot />

            {createdAt && <span>{formatDate(createdAt)}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;