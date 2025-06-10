// src/controllers/sessionController.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Session from '../models/session';

class SessionController {
  client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getAllSessions() {
    return await this.client
      .from("session")
      .select("*");
  }

  async createSession(session: Session) {
    try {
      return await this.client
        .from("session")
        .insert(session)
        .select();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSession(id: string) {
    try {
      return await this.client
        .from("session")
        .delete()
        .eq('id', id);
    } catch (error) {

    }
  }

  async updateSession(id: string, session: Session) {
    try {
      return await this.client
        .from("session")
        .update({ session })
        .eq('id', id);
    } catch (error) {

    }
  }
}

export default SessionController;

