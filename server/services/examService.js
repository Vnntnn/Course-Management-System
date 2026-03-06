const prisma = require("../config/database");

class ExamService {
  async createExam(courseId, title, totalQuestions) {
    return await prisma.exams.create({
      data: {
        course_id: parseInt(courseId),
        title,
        total_questions: parseInt(totalQuestions) || 0,
      },
    });
  }

  async createQuestions(examId, questionsData) {
    const examIdInt = parseInt(examId);

    // Filter valid questions
    const validQuestions = questionsData.filter(
      (q) =>
        q.question_text &&
        q.option_a &&
        q.option_b &&
        q.option_c &&
        q.option_d &&
        q.correct_option,
    );

    return await prisma.$transaction(
      validQuestions.map((q) =>
        prisma.questions.create({
          data: {
            exam_id: examIdInt,
            question_text: q.question_text,
            option_a: q.option_a,
            option_b: q.option_b,
            option_c: q.option_c,
            option_d: q.option_d,
            correct_option: q.correct_option,
          },
        }),
      ),
    );
  }

  async getExamById(examId) {
    return await prisma.exams.findUnique({
      where: { id: parseInt(examId) },
      include: {
        questions: {
          select: {
            id: true,
            question_text: true,
            option_a: true,
            option_b: true,
            option_c: true,
            option_d: true,
          },
        },
      },
    });
  }

  async submitExam(studentId, examId, answers) {
    const examIdInt = parseInt(examId);

    const questions = await prisma.questions.findMany({
      where: { exam_id: examIdInt },
    });

    let correctCount = 0;

    answers.forEach((answer) => {
      const question = questions.find(
        (q) => q.id === parseInt(answer.question_id),
      );
      if (question && question.correct_option === answer.selected_option) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length;
    const score =
      totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    const record = await prisma.exam_results.create({
      data: {
        student_id: parseInt(studentId),
        exam_id: examIdInt,
        score: score,
      },
    });

    return {
      result: record,
      summary: {
        score: correctCount,
        total: totalQuestions,
        percentage: Math.round(score),
      },
    };
  }

  async getStudentResults(studentId) {
    return await prisma.exam_results.findMany({
      where: { student_id: parseInt(studentId) },
      include: {
        exam: {
          select: { title: true, course_id: true },
        },
      },
      orderBy: { taken_at: "desc" },
    });
  }
}

module.exports = new ExamService();
