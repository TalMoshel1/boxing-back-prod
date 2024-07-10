import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  name: { type: String },
  trainer: { type: String},
  description: { type: String },
  day: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  repeatsWeekly: { type: Boolean, default: false },
  repeatEndDate: {type: Date},
  repeatedIndex: {type: String},
  studentName: {type: String}, /* only required for private */
  studentPhone: {type: String}, /* only required for private */
  studentMail: {type: String}, /* only required for private */
  type: {type: String, default:'private'},
  isApproved: {type: Boolean, default: false }
});

export const Lesson = mongoose.model('Lesson', lessonSchema);

