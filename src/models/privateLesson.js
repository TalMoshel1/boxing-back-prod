import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const privateLessonSchema = new Schema({
  day: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  costumerName: {type: String, required: true},
  costumerPhone: {type: String, required: true},
  customerMail: {type: String, required: true}
});

export const PrivateLesson = mongoose.model('PrivateLesson', privateLessonSchema);