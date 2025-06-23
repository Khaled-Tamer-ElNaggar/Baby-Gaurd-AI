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
        "Rewrite in a softer, friendlier tone for a caring nurse:\n\n" + raw
    )
    resp = llm.invoke(
        [SystemMessage(content="Tone rewriter"), HumanMessage(content=prompt)]
    )
    return resp.content.strip()

# ── Core search / answer pipeline ---------------------------------------
def _retrieve_and_summarize(query: str) -> str:
    docs = chroma_db.similarity_search(query, k=3)
    if not docs:
        return "NO_RELEVANT_INFO"

    context = " ".join(d.page_content for d in docs)
    chk = llm.invoke(
        [SystemMessage(content="Answer YES/NO if context answers query"),
         HumanMessage(content=f"Q: {query}\nContext: {context}")]
    )
    if "NO" in chk.content.upper():
        return "NO_RELEVANT_INFO"

    chain = load_summarize_chain(llm, chain_type="stuff")
    raw   = chain.run(docs)
    return soften_text(raw)

def smart_search(query: str) -> str:
    from langchain_google_community import GoogleSearchAPIWrapper
    db_ans = _retrieve_and_summarize(query)
    if "NO_RELEVANT_INFO" not in db_ans:
        return db_ans

    try:
        search  = GoogleSearchAPIWrapper()
        results = search.results(query, 2)
        if not results:
            return "I couldn’t find info on that topic."

        outs = []
        for res in results:
            snippet = soften_text(fetch_page_content(res["link"]))
            outs.append(
                f"• {res['title']}\n  {res['snippet'][:120]}...\n"
                f"  🔗 {res['link']}\n  📄 {snippet}\n"
            )
        return "\n\n".join(outs)
    except Exception:
        return "I’m having trouble accessing external sources right now."

def _can_answer(q: str) -> bool:
    prompt = (
        "You are a caring nurse assistant for pregnancy & postpartum.\n"
        "Answer ONLY YES if you can safely answer the question below.\n"
        "Otherwise answer NO.\n\nQuestion: "
        + q
    )
    resp = llm.invoke([SystemMessage(content=prompt), HumanMessage(content=q)])
    return "YES" in resp.content.upper()

def _gentle_refusal() -> str:
    return (
        "I’m sorry, I’m not the best resource for that. "
        "I can help with pregnancy, postpartum or childcare questions."
    )

# ── External API: process_query -----------------------------------------
def process_query(user_msg: str, session_uuid: str) -> str:
    try:
        mem = _get_mem(session_uuid)
        clean = profanity_filter(user_msg)

        if not _can_answer(clean):
            reply = _gentle_refusal()
        else:
            reply = smart_search(clean)

        mem.chat_memory.add_user_message(clean)
        mem.chat_memory.add_ai_message(reply)
        return reply
    except Exception as e:
        return f"Error processing request: {e}"
