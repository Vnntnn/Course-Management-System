/*
  Warnings:

  - You are about to drop the `student_progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "student_progress";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserProgress_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_courses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "instructor_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "courses_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_courses" ("created_at", "description", "id", "instructor_id", "thumbnail_url", "title") SELECT "created_at", "description", "id", "instructor_id", "thumbnail_url", "title" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE UNIQUE INDEX "courses_title_key" ON "courses"("title");
CREATE TABLE "new_enrollments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,
    "enrolled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_enrollments" ("course_id", "enrolled_at", "id", "student_id") SELECT "course_id", "enrolled_at", "id", "student_id" FROM "enrollments";
DROP TABLE "enrollments";
ALTER TABLE "new_enrollments" RENAME TO "enrollments";
CREATE UNIQUE INDEX "enrollments_student_id_course_id_key" ON "enrollments"("student_id", "course_id");
CREATE TABLE "new_exam_results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "student_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    "taken_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exam_results_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exam_results_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_exam_results" ("exam_id", "id", "score", "student_id", "taken_at") SELECT "exam_id", "id", "score", "student_id", "taken_at" FROM "exam_results";
DROP TABLE "exam_results";
ALTER TABLE "new_exam_results" RENAME TO "exam_results";
CREATE TABLE "new_exams" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "total_questions" INTEGER NOT NULL,
    CONSTRAINT "exams_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_exams" ("course_id", "id", "title", "total_questions") SELECT "course_id", "id", "title", "total_questions" FROM "exams";
DROP TABLE "exams";
ALTER TABLE "new_exams" RENAME TO "exams";
CREATE TABLE "new_lessons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    CONSTRAINT "lessons_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_lessons" ("course_id", "id", "order_index", "title") SELECT "course_id", "id", "order_index", "title" FROM "lessons";
DROP TABLE "lessons";
ALTER TABLE "new_lessons" RENAME TO "lessons";
CREATE TABLE "new_questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exam_id" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "option_a" TEXT NOT NULL,
    "option_b" TEXT NOT NULL,
    "option_c" TEXT NOT NULL,
    "option_d" TEXT NOT NULL,
    "correct_option" TEXT NOT NULL,
    CONSTRAINT "questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_questions" ("correct_option", "exam_id", "id", "option_a", "option_b", "option_c", "option_d", "question_text") SELECT "correct_option", "exam_id", "id", "option_a", "option_b", "option_c", "option_d", "question_text" FROM "questions";
DROP TABLE "questions";
ALTER TABLE "new_questions" RENAME TO "questions";
CREATE TABLE "new_topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lesson_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "content_body" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    CONSTRAINT "topics_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_topics" ("content_body", "content_type", "id", "lesson_id", "order_index", "title") SELECT "content_body", "content_type", "id", "lesson_id", "order_index", "title" FROM "topics";
DROP TABLE "topics";
ALTER TABLE "new_topics" RENAME TO "topics";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_user_id_topic_id_key" ON "UserProgress"("user_id", "topic_id");
