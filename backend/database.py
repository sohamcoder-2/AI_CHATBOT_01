import os
from supabase import create_client, Client
from dotenv import load_dotenv
import uuid
from datetime import datetime

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)


class Database:
    @staticmethod
    def create_session(session_id: str, user_ip: str = "") -> dict:
        """Create a new chat session"""
        try:
            response = supabase.table("chat_sessions").insert({
                "session_id": session_id,
                "user_ip": user_ip,
                "created_at": datetime.utcnow().isoformat(),
                "last_active_at": datetime.utcnow().isoformat()
            }).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating session: {e}")
            return None

    @staticmethod
    def get_session(session_id: str) -> dict:
        """Get session by session_id"""
        try:
            response = supabase.table("chat_sessions").select("*").eq("session_id", session_id).maybeSingle().execute()
            return response.data
        except Exception as e:
            print(f"Error getting session: {e}")
            return None

    @staticmethod
    def update_session_activity(session_id: str):
        """Update last active timestamp"""
        try:
            supabase.table("chat_sessions").update({
                "last_active_at": datetime.utcnow().isoformat()
            }).eq("session_id", session_id).execute()
        except Exception as e:
            print(f"Error updating session: {e}")

    @staticmethod
    def save_message(session_uuid: str, message_type: str, message_text: str,
                    detected_mood: str = "neutral", confidence_score: float = 0.0) -> dict:
        """Save a chat message"""
        try:
            response = supabase.table("chat_messages").insert({
                "session_id": session_uuid,
                "message_type": message_type,
                "message_text": message_text,
                "detected_mood": detected_mood,
                "confidence_score": confidence_score,
                "created_at": datetime.utcnow().isoformat()
            }).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error saving message: {e}")
            return None

    @staticmethod
    def get_chat_history(session_uuid: str, limit: int = 50) -> list:
        """Get chat history for a session"""
        try:
            response = supabase.table("chat_messages").select("*").eq(
                "session_id", session_uuid
            ).order("created_at", desc=False).limit(limit).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error getting chat history: {e}")
            return []

    @staticmethod
    def update_mood_analytics(session_uuid: str, mood: str):
        """Update mood analytics for session"""
        try:
            existing = supabase.table("mood_analytics").select("*").eq(
                "session_id", session_uuid
            ).eq("mood", mood).maybeSingle().execute()

            if existing.data:
                supabase.table("mood_analytics").update({
                    "count": existing.data["count"] + 1,
                    "updated_at": datetime.utcnow().isoformat()
                }).eq("id", existing.data["id"]).execute()
            else:
                supabase.table("mood_analytics").insert({
                    "session_id": session_uuid,
                    "mood": mood,
                    "count": 1,
                    "updated_at": datetime.utcnow().isoformat()
                }).execute()
        except Exception as e:
            print(f"Error updating mood analytics: {e}")

    @staticmethod
    def get_session_moods(session_uuid: str) -> list:
        """Get mood analytics for a session"""
        try:
            response = supabase.table("mood_analytics").select("*").eq(
                "session_id", session_uuid
            ).order("count", desc=True).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error getting mood analytics: {e}")
            return []