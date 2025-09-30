import re
from textblob import TextBlob
import nltk
from typing import Tuple, Dict

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/brown')
except LookupError:
    nltk.download('brown', quiet=True)


class NLPEngine:
    CRISIS_KEYWORDS = [
        'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die',
        'hurt myself', 'self harm', 'no reason to live', 'better off dead',
        'end it all', 'take my life'
    ]

    MOOD_KEYWORDS = {
        'happy': ['happy', 'joy', 'great', 'wonderful', 'excited', 'amazing', 'fantastic',
                 'good', 'better', 'excellent', 'glad', 'cheerful', 'delighted'],
        'sad': ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'crying', 'tears',
               'lonely', 'empty', 'hopeless', 'worthless', 'broken'],
        'anxious': ['anxious', 'anxiety', 'nervous', 'worried', 'panic', 'fear', 'scared',
                   'overwhelmed', 'restless', 'uneasy', 'tense', 'stress'],
        'stressed': ['stressed', 'pressure', 'overworked', 'exhausted', 'tired', 'burnt out',
                    'overwhelmed', 'too much', 'cant cope', 'struggling'],
        'angry': ['angry', 'furious', 'mad', 'frustrated', 'irritated', 'annoyed', 'rage']
    }

    RESPONSES = {
        'happy': [
            "That's wonderful to hear! It's great that you're feeling positive. What's been making you feel this way?",
            "I'm so glad you're feeling happy! Positive emotions are precious. Would you like to share what's going well?",
            "Your happiness is contagious! Keep embracing these good feelings. What's bringing you joy today?"
        ],
        'sad': [
            "I'm sorry you're feeling this way. It's okay to feel sad, and your feelings are valid. Would you like to talk about what's on your mind?",
            "I hear you, and I'm here for you. Sadness is a natural emotion. Remember, it's okay to not be okay sometimes.",
            "Thank you for sharing how you feel. Your feelings matter. Is there something specific that's making you feel down?"
        ],
        'anxious': [
            "Anxiety can be really challenging. Let's take a moment together. Try taking a deep breath in for 4 counts, hold for 4, and exhale for 4. Would you like to talk about what's causing your anxiety?",
            "I understand that you're feeling anxious. Remember, you're not alone in this. Have you tried any grounding techniques like focusing on your five senses?",
            "Anxiety can feel overwhelming, but you're taking a positive step by reaching out. What's on your mind that's causing you worry?"
        ],
        'stressed': [
            "Stress can be really tough to handle. Remember to be kind to yourself. Have you been able to take any breaks today?",
            "I hear that you're feeling stressed. It's important to acknowledge when things feel like too much. What's been weighing on you?",
            "Managing stress is challenging. Consider taking small breaks and focusing on one thing at a time. Want to talk about what's causing the pressure?"
        ],
        'angry': [
            "I can sense you're feeling frustrated or angry. Those feelings are valid. Would you like to talk about what's upsetting you?",
            "Anger is a natural emotion. It's okay to feel this way. Taking a few deep breaths might help. What's triggering these feelings?",
            "I understand you're feeling angry. Let's work through this together. What happened that made you feel this way?"
        ],
        'neutral': [
            "I'm here to listen. How are you feeling today?",
            "Thank you for sharing with me. What's on your mind?",
            "I'm here to support you. How can I help you today?"
        ],
        'crisis': [
            "I'm really concerned about what you've shared. Your life matters, and help is available right now. Please reach out to a crisis helpline immediately:\n\n🆘 **EMERGENCY RESOURCES:**\n• National Suicide Prevention Lifeline: 988 (US)\n• Crisis Text Line: Text HOME to 741741\n• International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/\n\nPlease talk to someone who can provide immediate professional help. You don't have to go through this alone."
        ]
    }

    COPING_STRATEGIES = {
        'anxious': [
            "\n\n💡 **Coping Strategy**: Try the 5-4-3-2-1 grounding technique - Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
            "\n\n💡 **Coping Strategy**: Practice box breathing - Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat 4 times.",
            "\n\n💡 **Coping Strategy**: Write down your worries in a journal. Sometimes putting thoughts on paper can help reduce their power."
        ],
        'stressed': [
            "\n\n💡 **Coping Strategy**: Take a 5-minute break. Step away from what's stressing you, stretch, or take a short walk.",
            "\n\n💡 **Coping Strategy**: Make a to-do list and prioritize. Break large tasks into smaller, manageable steps.",
            "\n\n💡 **Coping Strategy**: Practice progressive muscle relaxation - Tense and relax each muscle group in your body."
        ],
        'sad': [
            "\n\n💡 **Coping Strategy**: Reach out to a friend or loved one. Connection can help when you're feeling down.",
            "\n\n💡 **Coping Strategy**: Do something kind for yourself - Listen to music you love, take a warm bath, or enjoy a favorite snack.",
            "\n\n💡 **Coping Strategy**: Try gentle movement like a short walk or stretching. Physical activity can help improve mood."
        ],
        'angry': [
            "\n\n💡 **Coping Strategy**: Take a timeout. Step away from the situation and give yourself space to cool down.",
            "\n\n💡 **Coping Strategy**: Try physical release - Go for a run, punch a pillow, or do some vigorous exercise.",
            "\n\n💡 **Coping Strategy**: Write an angry letter (but don't send it). Express your feelings freely on paper."
        ]
    }

    @staticmethod
    def detect_crisis(text: str) -> bool:
        """Detect crisis keywords in text"""
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in NLPEngine.CRISIS_KEYWORDS)

    @staticmethod
    def detect_mood(text: str) -> Tuple[str, float]:
        """Detect mood from text using keyword matching and sentiment analysis"""
        if NLPEngine.detect_crisis(text):
            return 'crisis', 1.0

        text_lower = text.lower()
        mood_scores = {}

        for mood, keywords in NLPEngine.MOOD_KEYWORDS.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                mood_scores[mood] = score

        blob = TextBlob(text)
        sentiment_polarity = blob.sentiment.polarity

        if mood_scores:
            detected_mood = max(mood_scores, key=mood_scores.get)
            confidence = min(mood_scores[detected_mood] * 0.3, 1.0)
        elif sentiment_polarity > 0.3:
            detected_mood = 'happy'
            confidence = abs(sentiment_polarity)
        elif sentiment_polarity < -0.3:
            detected_mood = 'sad'
            confidence = abs(sentiment_polarity)
        else:
            detected_mood = 'neutral'
            confidence = 0.5

        return detected_mood, confidence

    @staticmethod
    def generate_response(mood: str, include_coping: bool = True) -> str:
        """Generate an empathetic response based on detected mood"""
        import random

        base_response = random.choice(NLPEngine.RESPONSES.get(mood, NLPEngine.RESPONSES['neutral']))

        if include_coping and mood in NLPEngine.COPING_STRATEGIES:
            coping = random.choice(NLPEngine.COPING_STRATEGIES[mood])
            return base_response + coping

        return base_response

    @staticmethod
    def analyze_message(text: str) -> Dict:
        """Complete analysis of a user message"""
        mood, confidence = NLPEngine.detect_mood(text)
        response = NLPEngine.generate_response(mood)

        return {
            'mood': mood,
            'confidence': confidence,
            'response': response,
            'is_crisis': mood == 'crisis'
        }