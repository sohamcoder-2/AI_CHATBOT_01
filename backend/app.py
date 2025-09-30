from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from database import Database
from nlp_engine import NLPEngine
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

db = Database()
nlp = NLPEngine()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Mental Health Chatbot API is running'}), 200


@app.route('/api/session/create', methods=['POST'])
def create_session():
    """Create a new chat session"""
    try:
        session_id = str(uuid.uuid4())
        user_ip = request.headers.get('X-Forwarded-For', request.remote_addr)

        session = db.create_session(session_id, user_ip)

        if session:
            return jsonify({
                'success': True,
                'session_id': session_id,
                'message': 'Session created successfully'
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to create session'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()

        if not data or 'message' not in data or 'session_id' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing required fields: message and session_id'
            }), 400

        user_message = data['message']
        session_id = data['session_id']

        session = db.get_session(session_id)
        if not session:
            return jsonify({
                'success': False,
                'error': 'Invalid session'
            }), 404

        session_uuid = session['id']

        db.update_session_activity(session_id)

        analysis = nlp.analyze_message(user_message)

        db.save_message(
            session_uuid=session_uuid,
            message_type='user',
            message_text=user_message,
            detected_mood=analysis['mood'],
            confidence_score=analysis['confidence']
        )

        db.update_mood_analytics(session_uuid, analysis['mood'])

        bot_response = analysis['response']

        db.save_message(
            session_uuid=session_uuid,
            message_type='bot',
            message_text=bot_response,
            detected_mood='neutral',
            confidence_score=0.0
        )

        return jsonify({
            'success': True,
            'response': bot_response,
            'mood': analysis['mood'],
            'confidence': analysis['confidence'],
            'is_crisis': analysis['is_crisis']
        }), 200

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({
            'success': False,
            'error': 'An error occurred processing your message'
        }), 500


@app.route('/api/history/<session_id>', methods=['GET'])
def get_history(session_id):
    """Get chat history for a session"""
    try:
        session = db.get_session(session_id)
        if not session:
            return jsonify({
                'success': False,
                'error': 'Invalid session'
            }), 404

        history = db.get_chat_history(session['id'])

        return jsonify({
            'success': True,
            'history': history
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/mood-analytics/<session_id>', methods=['GET'])
def get_mood_analytics(session_id):
    """Get mood analytics for a session"""
    try:
        session = db.get_session(session_id)
        if not session:
            return jsonify({
                'success': False,
                'error': 'Invalid session'
            }), 404

        moods = db.get_session_moods(session['id'])

        return jsonify({
            'success': True,
            'moods': moods
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)