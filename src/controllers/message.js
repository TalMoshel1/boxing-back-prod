import {messageService} from '../services/message.js'

export async function sendMessageToAdmin(req,res) {
    const { name, email, subject, message, to } = req.body;
    if (!(name && email && subject && message && to)) {
        return res.status(400).json({ message: 'Fill in all required fields' });
    }
    try {
        const newMessage = await messageService(name, email, subject, message, to)
       return res.status(200).json(newMessage);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }

}