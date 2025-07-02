
# --- Helper: Retrieve user profile (name, birthday) directly from DB ---
def get_user_profile_db(user_id: int):
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT id, user_name, user_birthday, blood_type, user_email, join_date, health_conditions, profile_picture_url, dark_mode, font_size
                FROM users
                WHERE id = %s
            """, (user_id,))
            return cur.fetchone()
    except Exception as e:
        print(f"User profile DB error: {e}")
        return None

import requests as pyrequests  # avoid conflict with langchain requests


# --- Helper: Retrieve today's health tracker data directly from DB ---
def get_today_health_tracker_db(user_id: int):
    import datetime
    today = datetime.date.today().isoformat()
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT sleep_hours, water_intake, steps
                FROM health_tracking
                WHERE user_id = %s AND track_date = %s
            """, (user_id, today))
            data = cur.fetchone()
            if not data:
                return None
            if (
                data.get("sleep_hours", 0) == 0.0 and
                data.get("water_intake", 0) == 0.0 and
                data.get("steps", 0) == 0
            ):
                return None
            return data
    except Exception as e:
        print(f"Health tracker DB error: {e}")
        return None

# --- Helper: Generate casual health tip if needed ---
def casual_health_tip(user_id: int):
    data = get_today_health_tracker_db(user_id)
    if not data:
        return ""
    tips = []
    if data.get("water_intake", 0) < 5.0:
        tips.append("💧 Remember to drink some water today!")
    if data.get("sleep_hours", 0) < 6.0:
        tips.append("😴 Try to get some rest if you can.")
    if data.get("steps", 0) < 2000:
        tips.append("🚶‍♀️ A short walk might help you feel better.")
    if not tips:
        return ""
    return "\n\n---\n" + "\n".join(tips)
def should_lookup(query: str) -> bool:
    """Use the LLM to decide if a web lookup is needed for this query."""
    prompt = (
        "You are an expert assistant. Decide if the following user question requires looking up external sources or if you can answer it from your own knowledge. "
        "Answer ONLY 'YES' or 'NO'.\n\n"
        f"User question: {query}"
    )
    resp = llm.invoke([
        SystemMessage(content=DETAILED_SYSTEM_PROMPT),
        HumanMessage(content=prompt)
    ])
    return "YES" in resp.content.upper()
"""
chat.py – LLM + helper utilities for BabyGuardAI
Only language / search / memory logic lives here.
"""
import os, re, collections, requests
from typing import Dict

from better_profanity import profanity
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# LangChain / Groq
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from langchain.memory import ConversationBufferMemory
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains.summarize import load_summarize_chain

# ── NLTK one-time setup ────────────────────────────────────────────────
from collections import Counter

# A simple list of common stopwords
STOPWORDS = {
    'the', 'is', 'in', 'and', 'to', 'a', 'of', 'that', 'it', 'on', 'for', 'you',
    'with', 'as', 'this', 'are', 'was', 'but', 'be', 'at', 'or', 'not', 'have',
    'from', 'an', 'by', 'they', 'we', 'can', 'if', 'about', 'your', 'more',
    'what', 'my', 'do', 'me', 'so', 'how', 'i', 'just', 'like', 'up', 'out', 'now'
}

def naive_topic(conversation: str) -> str:
    words = re.findall(r'\b[a-z]{3,}\b', conversation.lower())  # words longer than 2 chars
    filtered = [word for word in words if word not in STOPWORDS]
    top = Counter(filtered).most_common(3)
    topic = ' '.join(word for word, _ in top)
    return topic.title() if topic else "New Chat"

# ── Groq LLM & embeddings ───────────────────────────────────────────────
load_dotenv()
llm = ChatGroq(model="llama3-70b-8192", temperature=0)

embedding_function = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)
chroma_db = Chroma(persist_directory="chroma_db",
                   embedding_function=embedding_function)


# ── Dynamic Prompt & Formatting ------------------------------------------
DETAILED_SYSTEM_PROMPT = (
    "You are a highly knowledgeable, caring nurse assistant specializing in pregnancy and postpartum care. "
    "Always assume the user is pregnant or recently gave birth. "
    "Provide detailed, step-by-step, and empathetic medical explanations. "
    "Format your answers with clear sections, bullet points, and headings for readability. "
    "Never refuse unless its unrelated to answer medical questions, but always include a gentle disclaimer that your advice does not replace professional medical consultation."
)

DISCLAIMER = (
    "\n\n*Disclaimer: This advice is for informational purposes only and does not replace professional medical consultation. "
    "Always consult your healthcare provider for personal medical advice.*"
)

def format_pretty(text: str) -> str:
    # Simple formatting: add markdown headings and bullet points
    text = text.replace('\n\n', '\n')  # Remove excessive newlines
    lines = text.split('\n')
    formatted = []
    for line in lines:
        if line.strip().startswith('- '):
            formatted.append(f"• {line.strip()[2:]}")
        elif ':' in line and not line.startswith('http'):
            key, val = line.split(':', 1)
            formatted.append(f"**{key.strip()}**: {val.strip()}")
        else:
            formatted.append(line)
    return '\n'.join(formatted)

# ── Session memories -----------------------------------------------------
session_memories: Dict[str, ConversationBufferMemory] = {}

def _get_mem(session_uuid: str) -> ConversationBufferMemory:
    if session_uuid not in session_memories:
        session_memories[session_uuid] = ConversationBufferMemory(
            memory_key="chat_history", return_messages=True
        )
    return session_memories[session_uuid]

# ── Helper utilities (profanity, fetch, soften etc.) ---------------------
def profanity_filter(text: str) -> str:
    censored = profanity.censor(text)
    if censored != text:
        print("Warning: profanity censored")
    return censored

def fetch_page_content(url: str,
                       max_paragraphs: int = 5,
                       max_length: int = 500) -> str:
    try:
        html = requests.get(url, timeout=5).text
        soup = BeautifulSoup(html, "html.parser")
        paras = soup.find_all("p")[:max_paragraphs]
        text  = " ".join(p.get_text(" ", strip=True) for p in paras)
        return text[:max_length] or "No readable content found."
    except Exception as e:
        return f"Could not extract content: {e}"

def soften_text(raw: str) -> str:
    prompt = (
        DETAILED_SYSTEM_PROMPT + "\n\n" + raw
    )
    resp = llm.invoke(
        [SystemMessage(content=DETAILED_SYSTEM_PROMPT), HumanMessage(content=raw)]
    )
    return format_pretty(resp.content.strip())

# ── Core search / answer pipeline ---------------------------------------
def _retrieve_and_summarize(query: str) -> str:
    docs = chroma_db.similarity_search(query, k=3)
    if not docs:
        return "NO_RELEVANT_INFO"

    context = " ".join(d.page_content for d in docs)
    # Use detailed prompt for summarization
    chain = load_summarize_chain(llm, chain_type="stuff")
    raw   = chain.run(docs)
    answer = soften_text(raw)
    return answer + DISCLAIMER

def smart_search(query: str) -> str:
    from langchain_google_community import GoogleSearchAPIWrapper
    # Decide if a lookup is needed
    if not should_lookup(query):
        db_ans = _retrieve_and_summarize(query)
        if db_ans == "NO_RELEVANT_INFO":
            # If no relevant info, respond conversationally but not off-topic, and in markdown
            # Special handling for medication safety questions
            medication_keywords = [
                "medication", "medicine", "drug", "paracetamol", "acetaminophen", "ibuprofen", "antibiotic", "pill", "tablet", "painkiller", "safe to take", "is it safe", "can i take"
            ]
            mental_health_keywords = [
                "depressed", "depression", "sad", "hopeless", "suicidal", "suicide", "kill myself", "ending my life", "worthless", "can't go on", "mental health", "anxious", "anxiety", "panic attack", "overwhelmed", "crying", "helpless", "lonely", "alone", "no one cares"
            ]
            q_lower = query.lower()
            if any(kw in q_lower for kw in medication_keywords):
                return (
                    "### Medication Safety\n\n" +
                    "I'm here to support you with information and guidance. While I can't provide a definitive answer on the safety of specific medications like paracetamol during pregnancy or postpartum, I encourage you to consult your healthcare provider for personalized advice.\n\n" +
                    "If you'd like, I can help you find general information from reputable sources, but always check with your provider before taking any medication.\n" +
                    DISCLAIMER
                )
            if any(kw in q_lower for kw in mental_health_keywords):
                return (
                    "# I'm Here for You\n\n" +
                    "I'm so sorry you're feeling this way. Your feelings are valid, and you are not alone.\n\n" +
                    "If you're having thoughts of self-harm or suicide, please know that you matter and your life is important. It can help to talk about what you're feeling.\n\n" +
                    "**Would you like to share more about what's on your mind? I'm here to listen and support you.**\n\n" +
                    "Here are a few things you can try right now that might help, even a little:\n" +
                    "- **Take a few deep breaths** and try to relax your shoulders.\n" +
                    "- **Reach out to someone you trust**—a friend, family member, or your healthcare provider.\n" +
                    "- **Go for a short walk** or step outside for some fresh air if you can.\n" +
                    "- **Write down your feelings** or talk to someone about them.\n" +
                    "- **Remember:** You are not alone, and things can get better.\n\n" +
                    "If you are in crisis or need someone to talk to immediately, please consider reaching out to a helpline:\n\n" +
                    "- **National Suicide Prevention Lifeline (US):** 1-800-273-8255\n" +
                    "- **Samaritans (UK):** 116 123\n" +
                    "- **Crisis Text Line:** Text HOME to 741741 (US/Canada/UK)\n" +
                    "- **Befrienders Worldwide:** https://www.befrienders.org/ (for international support)\n\n" +
                    "You are not a burden. If you'd like, I can stay with you and chat, suggest gentle self-care ideas, or help you find ways to talk to your provider about how you're feeling. Just let me know how I can support you.\n" +
                    DISCLAIMER
                )
            prompt = (
                f"You are a friendly nurse assistant. The user asked: '{query}'. "
                "You do not have relevant information to answer this directly. However, if the user is asking about food, meals, or nutrition, suggest healthy meal ideas and nutrition tips for pregnant or postpartum women. "
                "Otherwise, respond in a warm, concise, and supportive way, gently letting the user know you don't have information on that topic, and encourage them to ask about pregnancy, postpartum, or childcare. Do not go off-topic. Format your response in clear, concise markdown (use lists, headings, and bold where appropriate). Limit your response to 5-7 lines."
            )
            resp = llm.invoke([
                SystemMessage(content=DETAILED_SYSTEM_PROMPT),
                HumanMessage(content=prompt)
            ])
            return resp.content.strip() + DISCLAIMER
        return db_ans

    db_ans = _retrieve_and_summarize(query)
    if "NO_RELEVANT_INFO" not in db_ans:
        info = db_ans
        sources = []
    else:
        try:
            search  = GoogleSearchAPIWrapper()
            results = search.results(query, 2)
            if not results:
                prompt = (
                    f"You are a friendly nurse assistant. The user asked: '{query}'. "
                    "You do not have relevant information to answer this directly. However, if the user is asking about food, meals, or nutrition, suggest healthy meal ideas and nutrition tips for pregnant or postpartum women. "
                    "Otherwise, respond in a warm, concise, and supportive way, gently letting the user know you don't have information on that topic, and encourage them to ask about pregnancy, postpartum, or childcare. Do not go off-topic. Format your response in clear, concise markdown (use lists, headings, and bold where appropriate). Limit your response to 5-7 lines."
                )
                resp = llm.invoke([
                    SystemMessage(content=DETAILED_SYSTEM_PROMPT),
                    HumanMessage(content=prompt)
                ])
                return resp.content.strip() + DISCLAIMER

            outs = []
            links = []
            for res in results:
                snippet = soften_text(fetch_page_content(res["link"]))
                outs.append(snippet)
                links.append(res["link"])
            info = "\n\n".join(outs)
            sources = links
        except Exception:
            return "I’m having trouble accessing external sources right now." + DISCLAIMER

    # Always include sources if a lookup was performed, but warn user to consult their provider
    sources_text = "\n".join(f"- {link}" for link in sources) if sources else ""
    prompt = (
        f"You are a friendly nurse assistant. The user asked: '{query}'. "
        f"Here is some information I found: {info} "
        f"Here are the sources: {sources_text if sources_text else 'None'} "
        "Please answer the user's question in a conversational, supportive, and concise way, as if you are chatting with them directly. "
        "Always include a 'Sources:' section if a lookup was performed, and remind the user to consult their healthcare provider before acting on any information from external sources. Format your response in clear, concise markdown (use lists, headings, and bold where appropriate). Limit your response to 5-7 lines."
    )
    resp = llm.invoke([
        SystemMessage(content=DETAILED_SYSTEM_PROMPT),
        HumanMessage(content=prompt)
    ])
    answer = resp.content.strip()
    # Add extra warning if sources were included
    if sources:
        answer += "\n\n*Note: Information from external sources is for reference only. Always consult your healthcare provider before making decisions about medication or treatment.*"
    return answer + DISCLAIMER

def _can_answer(q: str) -> bool:
    # Always answer, but add disclaimer in the prompt/response
    return True

def _gentle_refusal() -> str:
    # Should not be used, but kept for compatibility
    return (
        "I'm here to help with any pregnancy or postpartum questions you have." + DISCLAIMER
    )


# ── External API: process_query -----------------------------------------

# --- Helper: Detect appointment queries ---
import datetime
import re
from utils.db import create_db_connection

def is_today_appointment_query(msg: str) -> bool:
    # Simple keyword/intent detection
    msg_lower = msg.lower()
    patterns = [
        r"today.*appointment",
        r"appointment.*today",
        r"today.*schedule",
        r"schedule.*today",
        r"what.*appointment.*today",
        r"do i have.*appointment.*today",
        r"any.*appointment.*today",
        r"what.*events.*today",
        r"today.*events",
        r"calendar.*today",
        r"today.*calendar",
    ]
    return any(re.search(p, msg_lower) for p in patterns)

def get_todays_appointments(user_id: int) -> str:
    today = datetime.date.today().isoformat()
    try:
        with create_db_connection() as conn, conn.cursor(dictionary=True) as cur:
            cur.execute("""
                SELECT title, event_time, description
                FROM calendar_events
                WHERE user_id = %s AND event_date = %s
                ORDER BY event_time
            """, (user_id, today))
            events = cur.fetchall()
        if not events:
            return (
                "### Today's Appointments\n\n" +
                "You have no appointments scheduled for today.\n\n" +
                DISCLAIMER
            )
        lines = ["### Today's Appointments\n"]
        for ev in events:
            lines.append(f"- **{ev['title']}** at {ev['event_time']}\n  {ev['description'] or ''}")
        return "\n".join(lines) + "\n\n" + DISCLAIMER
    except Exception as e:
        return f"Could not retrieve today's appointments: {e}"

def extract_user_id_from_session(session_uuid: str) -> int:
    # Placeholder: Replace with actual session-to-user-id logic
    # For now, assume session_uuid is user_id if it's an int string
    try:
        return int(session_uuid)
    except Exception:
        return 1  # fallback user id for testing

def process_query(user_msg: str, session_uuid: str) -> str:
    try:
        mem = _get_mem(session_uuid)
        clean = profanity_filter(user_msg)

        # You must pass the user_token to this function from your frontend/session
        # For now, try to get it from an environment variable for testing

        user_id = extract_user_id_from_session(session_uuid)
        user_profile = get_user_profile_db(user_id)
        # Check for today's appointment queries
        if is_today_appointment_query(clean):
            reply = get_todays_appointments(user_id)
        else:
            # Always answer, with detailed, formatted, and empathetic response
            # Pass user profile info to the prompt for context, but do not prepend greeting in reply
            name = user_profile["user_name"] if user_profile and user_profile.get("user_name") else None
            birthday = user_profile["user_birthday"] if user_profile and user_profile.get("user_birthday") else None
            user_context = ""
            if name:
                user_context += f"The user's name is {name}. "
            if birthday:
                user_context += f"The user's birthday is {birthday}. "
            system_prompt = DETAILED_SYSTEM_PROMPT
            if user_context:
                system_prompt = user_context + system_prompt
            # Use the custom system prompt in smart_search
            reply = smart_search(clean) if not user_context else smart_search_with_prompt(clean, system_prompt)
            # Casually add health tip if relevant
            tip = casual_health_tip(user_id)
            if tip:
                reply += tip

        mem.chat_memory.add_user_message(clean)
        mem.chat_memory.add_ai_message(reply)
        return reply
    except Exception as e:
        return f"Error processing query: {e}"
def smart_search_with_prompt(query: str, system_prompt: str) -> str:
    """Same as smart_search, but allows passing a custom system prompt."""
    from langchain_google_community import GoogleSearchAPIWrapper
    # Decide if a lookup is needed
    # Try/except block for the whole function
    try:
        if not should_lookup(query):
            db_ans = _retrieve_and_summarize(query)
            if db_ans == "NO_RELEVANT_INFO":
                medication_keywords = [
                    "medication", "medicine", "drug", "paracetamol", "acetaminophen", "ibuprofen", "antibiotic", "pill", "tablet", "painkiller", "safe to take", "is it safe", "can i take"
                ]
                mental_health_keywords = [
                    "depressed", "depression", "sad", "hopeless", "suicidal", "suicide", "kill myself", "ending my life", "worthless", "can't go on", "mental health", "anxious", "anxiety", "panic attack", "overwhelmed", "crying", "helpless", "lonely", "alone", "no one cares"
                ]
                q_lower = query.lower()
                if any(kw in q_lower for kw in medication_keywords):
                    return (
                        "### Medication Safety\n\n" +
                        "I'm here to support you with information and guidance. While I can't provide a definitive answer on the safety of specific medications like paracetamol during pregnancy or postpartum, I encourage you to consult your healthcare provider for personalized advice.\n\n" +
                        "If you'd like, I can help you find general information from reputable sources, but always check with your provider before taking any medication.\n" +
                        DISCLAIMER
                    )
                if any(kw in q_lower for kw in mental_health_keywords):
                    return (
                        "# I'm Here for You\n\n" +
                        "I'm so sorry you're feeling this way. Your feelings are valid, and you are not alone.\n\n" +
                        "If you're having thoughts of self-harm or suicide, please know that you matter and your life is important. It can help to talk about what you're feeling.\n\n" +
                        "**Would you like to share more about what's on your mind? I'm here to listen and support you.**\n\n" +
                        "Here are a few things you can try right now that might help, even a little:\n" +
                        "- **Take a few deep breaths** and try to relax your shoulders.\n" +
                        "- **Reach out to someone you trust**—a friend, family member, or your healthcare provider.\n" +
                        "- **Go for a short walk** or step outside for some fresh air if you can.\n" +
                        "- **Write down your feelings** or talk to someone about them.\n" +
                        "- **Remember:** You are not alone, and things can get better.\n\n" +
                        "If you are in crisis or need someone to talk to immediately, please consider reaching out to a helpline:\n\n" +
                        "- **National Suicide Prevention Lifeline (US):** 1-800-273-8255\n" +
                        "- **Samaritans (UK):** 116 123\n" +
                        "- **Crisis Text Line:** Text HOME to 741741 (US/Canada/UK)\n" +
                        "- **Befrienders Worldwide:** https://www.befrienders.org/ (for international support)\n\n" +
                        "You are not a burden. If you'd like, I can stay with you and chat, suggest gentle self-care ideas, or help you find ways to talk to your provider about how you're feeling. Just let me know how I can support you.\n" +
                        DISCLAIMER
                    )
                prompt = (
                    f"You are a friendly nurse assistant. The user asked: '{query}'. "
                    "You do not have relevant information to answer this directly. However, if the user is asking about food, meals, or nutrition, suggest healthy meal ideas and nutrition tips for pregnant or postpartum women. "
                    "Otherwise, respond in a warm, concise, and supportive way, gently letting the user know you don't have information on that topic, and encourage them to ask about pregnancy, postpartum, or childcare. Do not go off-topic. Format your response in clear, concise markdown (use lists, headings, and bold where appropriate). Limit your response to 5-7 lines."
                )
                resp = llm.invoke([
                    SystemMessage(content=system_prompt),
                    HumanMessage(content=prompt)
                ])
                return resp.content.strip() + DISCLAIMER
            return db_ans

        db_ans = _retrieve_and_summarize(query)
        if "NO_RELEVANT_INFO" not in db_ans:
            info = db_ans
            sources = []
        else:
            try:
                search  = GoogleSearchAPIWrapper()
                results = search.results(query, 2)
                if not results:
                    prompt = (
                        f"You are a friendly nurse assistant. The user asked: '{query}'. "
                        "You do not have relevant information to answer this directly. However, if the user is asking about food, meals, or nutrition, suggest healthy meal ideas and nutrition tips for pregnant or postpartum women. "
                        "Otherwise, respond in a warm, concise, and supportive way, gently letting the user know you don't have information on that topic, and encourage them to ask about pregnancy, postpartum, or childcare. Do not go off-topic. Format your response in clear, concise markdown (use lists, headings, and bold where appropriate). Limit your response to 5-7 lines."
                    )
                    resp = llm.invoke([
                        SystemMessage(content=system_prompt),
                        HumanMessage(content=prompt)
                    ])
                    return resp.content.strip() + DISCLAIMER

                outs = []
                links = []
                for res in results:
                    snippet = soften_text(fetch_page_content(res["link"]))
                    outs.append(snippet)
                    links.append(res["link"])
                info = "\n\n".join(outs)
                sources = links
            except Exception:
                return "I’m having trouble accessing external sources right now." + DISCLAIMER

        sources_text = "\n".join(f"- {link}" for link in sources) if sources else ""
        prompt = (
            f"You are a friendly nurse assistant. The user asked: '{query}'. "
            f"Here is some information I found: {info} "
            f"Here are the sources: {sources_text if sources_text else 'None'} "
            "Please answer the user's question in a conversational, supportive, and concise way, as if you are chatting with them directly. "
            "Always include a 'Sources:' section if a lookup was performed, and remind the user to consult their healthcare provider before acting on any information from external sources. Format your response in clear, concise markdown (use lists, headings, and bold where appropriate). Limit your response to 5-7 lines."
        )
        resp = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=prompt)
        ])
        answer = resp.content.strip()
        if sources:
            answer += "\n\n*Note: Information from external sources is for reference only. Always consult your healthcare provider before making decisions about medication or treatment.*"
        return answer + DISCLAIMER
    except Exception as e:
        return f"Error processing request: {e}"

# Exported symbols for import in other modules
__all__ = [
    "llm",
    "process_query",
    "naive_topic"
]
