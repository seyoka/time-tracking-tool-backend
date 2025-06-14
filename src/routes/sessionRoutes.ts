import { Router, Request, Response } from "express";
import getAllSessions from "../controllers/sessionController";
import 'dotenv/config';
import Session from '../models/session';
import { createClient } from "@supabase/supabase-js";
import SessionController from "../controllers/sessionController";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const router = Router();

const sessionController = new SessionController(supabase);


router.get("/sessions", async (req: Request, res: Response) => {
  const result = await sessionController.getAllSessions();
  res.json(result);
});

router.post("/session", async (req: Request, res: Response) => {

  console.log(req.body.title);
  console.log(req.body.description);

  const session: Partial<Session> = {
    title: req.body.title || "",
    tag: req.body.tag || "",
    description: req.body.description || "",
    start_time: req.body.start_time ? new Date(req.body.start_time) : new Date(),
    end_time: req.body.end_time ? new Date(req.body.end_time) : new Date(),
  };

  console.dir(session);
  const result = await sessionController.createSession(session as Session);
  res.json(result);
},
);

router.delete("/session/:id", async (req: Request, res: Response) => {
  const sessionId = parseInt(req.params.id);
  const result = await sessionController.deleteSession(sessionId);
  res.json(result);
});

router.put("/session/:id", async (req: Request, res: Response) => {
  const sessionId = parseInt(req.params.id);

  const session: Partial<Session> = {
    title: req.body.title || "",
    tag: req.body.tag || "",
    description: req.body.description || "",
    start_time: req.body.start_time ? new Date(req.body.start_time) : new Date(),
    end_time: req.body.end_time ? new Date(req.body.end_time) : new Date(),
  };

  const result = await sessionController.updateSession(sessionId, session as Session);
  res.json(result);
});

router.get("/sessions/:id", async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  const response = await sessionController.getAllSessionsByUserId(userId);
  res.json(response.data);
});

router.get("/debug/connection", async (req: Request, res: Response) => {
  try {
    console.log('Testing Supabase connection...');

    // Test 1: Basic connection
    const { data, error } = await supabase
      .from('user_to_session')
      .select('count', { count: 'exact' });

    console.log('Connection test result:', { data, error });

    const allRecords = await supabase
      .from('user_to_session')
      .select('*');

    console.log('All user_to_session records:', allRecords);

    const userRecords = await supabase
      .from('user_to_session')
      .select('*')
      .eq('user_id', 5);

    console.log('User 5 records:', userRecords);

    res.json({
      connectionTest: { data, error },
      allRecords: allRecords,
      userRecords: userRecords,
    });

  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({ error: error });
  }
});

router.get("/active-session/:id", async (req: Request, res: Response) => {
  try {
    const user_id = parseInt(req.params.id);
    const response = await sessionController.getActiveSession(user_id);
    res.json(response?.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
export default router;  
