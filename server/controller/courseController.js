/**
 * 
 * Course Routes
 * 
 */

const prisma = require("../config/database");

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const { title, description, thumbnail_url } = req.body;
        const newCourse = await prisma.courses.create({
            data: {
                title,
                description,
                thumbnail_url,
                instructor_id: req.user.id // Get instructor ID from passport session
            }
        });
        res.status(201).json(newCourse);
    }
    catch (error) {
        res.status(400).json({
            error: "Can't create course, please try again!"
        });
    }
}

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await prisma.courses.findMany({
            include: {
                instructor: {
                    select: {
                        full_name: true
                    }
                }
            }
        });
        res.json(allCourses);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}