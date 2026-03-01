/**
 *
 * Course Routes
 *
 */

const prisma = require("../config/database");

/**
 * Create a new course
 * Only accessible by instructors
 */
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail_url } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newCourse = await prisma.courses.create({
      data: {
        title,
        description,
        thumbnail_url:
          thumbnail_url ||
          "https://dummyimage.com/600x400/ebebeb/000000&text=Course",
        instructor_id: req.user.id,
      },
    });

    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    // Prisma code for unique constraint violation (e.g., duplicate course title)
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "A course with this title already exists" });
    }
    res
      .status(500)
      .json({ message: "Failed to create course", error: error.message });
  }
};

/**
 * Get all courses
 * Publicly accessible (or authenticated users only)
 */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.courses.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve courses", error: error.message });
  }
};
