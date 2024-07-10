import express from 'express';
import {authenticateToken} from '../middlewares/auth.js';
import {sendMessageToAdmin} from '../controllers/message.js'


const router = express.Router();

router.post('/', authenticateToken , sendMessageToAdmin);



export default router;
