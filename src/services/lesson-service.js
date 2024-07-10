import { Lesson } from '../models/lesson.js';
import { ObjectId } from 'mongodb'; // Import ObjectId

export async function createLesson(lessonData) {
  try {
    let { day, startTime } = lessonData;
    const existingLesson = await Lesson.findOne({ day: day, startTime: startTime });
    const lesson = new Lesson(lessonData);
    const savedLesson = await lesson.save();
    return savedLesson;
  } catch (error) {
    if (error.message === 'שיעור כבר קבוע בשעה ויום זה') {
      throw error;
    } else {
      throw new Error(error);
    }
  }
}

export async function createWeeklyLessons(lessonData, repeatEndDate) {
  const createdLessons = [];
  let currentLessonDate = new Date(lessonData.day);
  const repeatedIndex = lessonData.repeatedIndex || new ObjectId(); 

  if (!(repeatEndDate instanceof Date) || isNaN(repeatEndDate)) {
    throw new Error('Invalid repeatEndDate');
  }

  currentLessonDate.setDate(currentLessonDate.getDate() + 7);

  while (currentLessonDate <= repeatEndDate) {
    const lesson = { ...lessonData, day: new Date(currentLessonDate), repeatedIndex };
    const createdLesson = new Lesson(lesson);
    await createdLesson.save();
    createdLessons.push(createdLesson);

    currentLessonDate.setDate(currentLessonDate.getDate() + 7);
  }

  return createdLessons;
}

export async function checkRepeatedLesson(lessonData, repeatEndDate) {
  const lessonDayOfWeek = new Date(lessonData.day).toLocaleString('en-us', { weekday: 'short' });
  const startTime = lessonData.startTime;
  const endTime = lessonData.endTime;

  if (repeatEndDate) {
    const existingLesson = await Lesson.findOne({
      dayOfWeek: lessonDayOfWeek,
      startTime,
      endTime,
      day: { $gte: lessonData.day, $lte: repeatEndDate },
      isApproved: true
    });
  
    return existingLesson;
  }

  const existingLesson = await Lesson.findOne({
    dayOfWeek: lessonData.day,
    startTime,
    endTime,
    isApproved: true

  });

  console.log('existing lesson: ',existingLesson)


  return existingLesson;
}

export async function doesApprovePossible(lessonId) {

  const existingLesson = await Lesson.findOne({ _id: lessonId });

  if (existingLesson) {
    const { startTime, endTime, day } = existingLesson;

    const existingLessonDate = new Date(day);
    const existingYear = existingLessonDate.getFullYear();
    const existingMonth = existingLessonDate.getMonth() + 1; 
    const existingDate = existingLessonDate.getDate();

    const duplicateLesson = await Lesson.findOne({
      startTime,
      endTime,
      isApproved: true,
      $expr: {
        $and: [
          { $eq: [{ $year: "$day" }, existingYear] },
          { $eq: [{ $month: "$day" }, existingMonth] },
          { $eq: [{ $dayOfMonth: "$day" }, existingDate] }
        ]
      }
    });

    if (duplicateLesson) {
      return false
    } else {
      console.log(true)

      return true
    }
  }
}

export async function updateLesson(id, updatedLessonData) {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(id, updatedLessonData, { new: true });
    return updatedLesson;
  } catch (error) {
    throw new Error('Could not update lesson');
  }
}
export async function deleteLesson(lessonId, deleteAll) {
  try {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      throw new Error('Lesson not found');
    }


    if (deleteAll) {
      await Lesson.deleteMany({
        repeatedIndex: lesson.repeatedIndex, 
      });
    } else {
      await Lesson.findByIdAndDelete(lessonId);
    }
  } catch (error) {
    console.log(error)
    throw new Error('Could not delete lesson');
  }
}

export async function getLessonsForWeek(startOfWeek) {
  if (!(startOfWeek instanceof Date)) {
    startOfWeek = new Date(startOfWeek);
  }

  try {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfWeekUTC = new Date(Date.UTC(
      startOfWeek.getFullYear(), 
      startOfWeek.getMonth(), 
      startOfWeek.getDate()
    ));
    const endOfWeekUTC = new Date(Date.UTC(
      endOfWeek.getFullYear(), 
      endOfWeek.getMonth(), 
      endOfWeek.getDate()
    ));

    const lessons = await Lesson.find({
      day: { $gte: startOfWeekUTC, $lte: endOfWeekUTC }
    });

    lessons.sort((a, b) => {
      const dateA = new Date(a.day);
      const dateB = new Date(b.day);
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      const dateTimeA = new Date(dateA.setHours(timeA[0], timeA[1]));
      const dateTimeB = new Date(dateB.setHours(timeB[0], timeB[1]));
      return dateTimeA - dateTimeB;
    });

    return lessons;
  } catch (error) {
    console.log('service error: ', error);
    throw new Error('Could not fetch lessons for the week');
  }
}



export async function approveLessonById(lessonId) {
  console.log(lessonId)
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedLesson) {
      throw new Error('Lesson not found');
    }

    console.log('updated lesson: ',updatedLesson)

    return updatedLesson;
  } catch (error) {
    console.error('Error approving lesson:', error);
    throw error;
  }
}


