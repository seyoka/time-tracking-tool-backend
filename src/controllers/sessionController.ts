import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Session from '../models/session';

class SessionController {
  client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  async getAllSessions() {
    console.log('=== Getting all sessions ===');
    console.log('About to query session table...');

    const result = await this.client
      .from("session")
      .select("*");

    console.log('Raw result from getAllSessions:', JSON.stringify(result, null, 2));

    return result;
  }

  async getAllSessionsByUserId(userId: number) {
    const result = await this.client
      .from("user_to_session")
      .select(`
      *,
      session!inner(*)
    `)
      .eq('user_id', userId);

    console.log('Raw result', JSON.stringify(result));
    return result;
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
      throw new Error("Update Session failed");
    }
  }

  async getActiveSession(id: number) {
    try {
      return await this.client
        .from("user_to_session")
        .select(`
            *,
            session!inner(*)
          `)
        .eq("id", id)
        .eq("session.active", true);
    } catch (error) {

    }
  }
}

export default SessionController;

