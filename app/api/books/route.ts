/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDatabase } from "@/lib/connectToDB";
import { UploadImage } from "@/lib/upload-image";
import Book from "@/models/book";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Add book to DB
export async function POST(req: Request) {
  try {
    const { isAuthenticated } = await auth();
    if (!isAuthenticated) {
      return Response.json({ error: "Unauthorised" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await currentUser();

    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const author = formData.get("author")?.toString() || "";
    const genre = formData.get("genre")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const publishedYearRaw = formData.get("publishedYear")?.toString() || "";
    const publishedYear = publishedYearRaw
      ? Number(publishedYearRaw)
      : undefined;
    const cover = formData.get("cover") as File;

    if (!title || !author || !cover || !genre || !description) {
      return Response.json(
        {
          error:
            "Title, author, cover image, genre, and description are required",
        },
        { status: 400 }
      );
    }

    // Cover upload feature
    let uploadResult: any;

    if (cover) {
      uploadResult = await UploadImage(cover, "zbooks");
    }

    console.log("Upload Result:", uploadResult);

    const book = await Book.create({
      title,
      author,
      cover: uploadResult?.secure_url || cover.name,
      genre,
      description,
      publishedYear,
      addedBy: { id: user?.id, firstName: user?.firstName },
    });

    return Response.json({ book }, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return Response.json({ error: "Failed to create book" }, { status: 500 });
  }
}

// Get all books from DB
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const genreParam = request.nextUrl.searchParams.get("genre");

    const query: any = {};

    if (genreParam) {
      const genreUnquoted = genreParam.replace(/^"(.*)"$/, "$1");
      if (genreUnquoted && genreUnquoted !== "All") {
        query.genre = genreUnquoted;
      }
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return Response.json({ books }, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return Response.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}