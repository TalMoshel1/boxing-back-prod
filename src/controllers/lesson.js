import * as lessonService from "../services/lesson-service.js";
import { ObjectId } from "mongodb";
import { messageService } from "../services/message.js";

export async function createLesson(req, res) {
  const {
    name,
    trainer,
    description,
    day,
    startTime,
    endTime,
    repeatsWeekly,
    repeatEndDate,
  } = req.body;

  const parsedRepeatEndDate = repeatsWeekly
    ? repeatEndDate
      ? new Date(repeatEndDate)
      : null
    : null;

  const lessonData = {
    name,
    trainer,
    description,
    day: new Date(day),
    startTime,
    endTime,
    repeatsWeekly,
    type: "group",
    isApproved: true,
  };

  try {
    if (!(name && trainer && day && startTime && endTime)) {
      console.log('great!!!')

      return res.status(400).json({ message: "Fill in all required fields" });
    }

    let createdLesson;
    let additionalLessons = [];

    if (repeatsWeekly) {
      const repeatedIndex = new ObjectId();

      if (parsedRepeatEndDate) {
        const isConflict = await lessonService.checkRepeatedLesson(
          { ...lessonData, repeatedIndex },
          parsedRepeatEndDate
        );
        if (isConflict) {
          throw new Error("כבר קבועים שיעורים באחד ממועדים אלו");
        }
      }
      additionalLessons = await lessonService.createWeeklyLessons(
        { ...lessonData, repeatedIndex },
        parsedRepeatEndDate
      );
      createdLesson = await lessonService.createLesson({
        ...lessonData,
        repeatedIndex,
      });
    } else {
      const isConflict = await lessonService.checkRepeatedLesson({
        ...lessonData,
      });
      if (isConflict) {
        console.log(isConflict)
        throw new Error("קבוע לך שיעור במועד זה");
      }
      createdLesson = await lessonService.createLesson(lessonData);
    }

    if (repeatsWeekly) {
      return res.status(201).json([createdLesson, ...additionalLessons]);
    }

    res.status(201).json(createdLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function requestPrivateLesson(req, res) {
  const { day, startTime, endTime, studentName, studentPhone, studentMail } =
    req.body;
  const lessonData = {
    day,
    startTime,
    endTime,
    studentName,
    studentPhone,
    studentMail,
  };

  if (
    !(day && startTime && endTime && studentName && studentPhone && studentMail)
  ) {
    return res.status(400).json({ message: "Fill in all required fields" });
  }
  const createRequest = await lessonService.createLesson(lessonData);

  if (createRequest) {
    const emailBody = `
    <p>נשלחה בקשה לאימון אישי ע"י:<br/>
    ${studentName}, <br/>
    ${studentMail}, <br/>
    ${studentPhone}.<br/>
    אם אתה רוצה לאשר את האימון,
    פתח את הלינק הבא:</p>
    <a href="http://localhost:3001/api/lessons/approveLink/${createRequest._id}" style="color: blue;">http://localhost:3001/approveLink/${createRequest._id}</a>
  `;

    const sendEmailToApprove = await messageService(
      studentName,
      studentMail,
      "בקשה לאימון אישי",
      emailBody,
      'davidaboxing@gmail.com'
    );

    return res.status(201).json(createRequest);
  }
}

export async function getWeeklyLessons(req, res) {
  const { startOfWeek } = req.body;

  try {
    const lessons = await lessonService.getLessonsForWeek(
      new Date(startOfWeek)
    );
    res.status(200).json(lessons);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error.message });
  }
}

export async function updateLesson(req, res) {
  const { lessonId } = req.params;
  const updatedLessonData = req.body;
  try {
    const updatedLesson = await lessonService.updateLesson(
      lessonId,
      updatedLessonData
    );
    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.status(200).json(updatedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteLesson(req, res) {
  const { lessonId } = req.params;
  const { deleteAll } = req.body;

  try {
    await lessonService.deleteLesson(lessonId, deleteAll);
    res.status(200).json({
      message: `${deleteAll ? "Lessons" : "Lesson"} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function approvePrivateLesson(req, res) {
  const { lessonId } = req.params;

  try {
    const doesPossibleToApprove = await lessonService.doesApprovePossible(lessonId)
    if (doesPossibleToApprove) {
    const approvedLesson = await lessonService.approveLessonById(lessonId);
    res.status(200).json({ message: 'Lesson approved successfully', lesson: approvedLesson });
    } else {
      res.status(500).json({message: 'כבר יש לך שיעור במועד זה'})
    }

  } catch (error) {
    console.error('Error approving lesson:', error);
    res.status(500).json({ message: 'Error approving lesson', error: error.message });
  }
}
