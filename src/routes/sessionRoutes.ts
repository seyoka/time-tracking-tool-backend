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
  res.json(sessionController.getAllSessions());
});

router.post("/session", async (req: Request, res: Response) => {
  const session: Partial<Session> = {
    title: req.body.title || "",
    tag: req.body.tag || "",
    description: req.body.description || "",
    start_time: req.body.start_time ? new Date(req.body.start_time) : new Date(),
    end_time: req.body.end_time ? new Date(req.body.end_time) : new Date(),
  };
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

export default router; 
