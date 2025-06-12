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

  async getAllSessionsByUserId(userId: number) {
    return await this.client
      .from("user_to_session")
      .select("session:session_id!user_to_session_session_id_fkey(*)")
      .eq('user_id', userId);
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

  async deleteSession(id: number) {
    try {
      return await this.client
        .from("session")
        .delete()
        .eq('id', id);
    } catch (error) {

    }
  }

  async updateSession(id: number, session: Session) {
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

