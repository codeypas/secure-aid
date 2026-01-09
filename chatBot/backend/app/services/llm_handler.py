from langchain.agents import initialize_agent, Tool
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.agents.agent_types import AgentType
import requests

# Setup LLM
llm = ChatOpenAI(
    model="openai/gpt-4o-mini",
    temperature=0.7,
    api_key="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",
    base_url="https://openrouter.ai/api/v1"
)

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Tool 1: Get current weather using email
def get_weather_tool(email_id: str):
    try:
        response = requests.post(
            "http://localhost:5000/api/current_weather/getdata",
            json={"email_id": email_id}
        )
        response.raise_for_status()
        return f"Weather data: {response.json()}"
    except Exception as e:
        return f"Failed to fetch weather data: {str(e)}"

# Tool 2: Send emergency alert to admin
def notify_admin_tool(message: str, email: str):
    try:
        payload = {
            "email": "admin@disasterwatch.org",
            "message": f"⚠️ Urgent Alert from {email}: {message}"
        }
        response = requests.post(
            "http://localhost:5000/api/inbox/",
            json=payload,
            headers={"Content-Type": "application/json; charset=utf-8"}
        )
        response.raise_for_status()
        return "Alert sent to admin successfully."
    except Exception as e:
        return f"Failed to notify admin: {str(e)}"

# Register Tools
tools = [
    Tool.from_function(
        func=lambda email: get_weather_tool(email),
        name="GetWeather",
        description="Fetch current weather using user email"
    ),
    Tool.from_function(
        func=lambda input_str: notify_admin_tool(*input_str.split("|")),
        name="SendDisasterAlert",
        description="Notify admin using message and email. Input should be 'message|email'"
    )
]


system_template = """
You are a disaster management AI assistant trained to respond to emergency situations with urgency and clarity.

When a user describes a potential disaster (e.g., fire, flood, earthquake, landslide, etc.), always follow **both steps below** in your response:

1. **Send an emergency alert** to the admin using the user's email and location. Acknowledge this action clearly.
2. **Provide clear, step-by-step survival instructions** based on the type of disaster. Do not assume the user already knows what to do.

Guidelines:
- Always do both (alert + survival steps) — never only one.
- Be concise, specific, and use numbered or bulleted steps for survival advice.
- Avoid vague or generic statements like "stay safe" without useful details.

Disaster-specific actions:

**For fire:**
- Stay low to avoid smoke.
- Check doors for heat before opening.
- Use stairs, not elevators.
- Evacuate immediately if safe, and call emergency services.

**For flood:**
- Move to higher ground immediately.
- Avoid walking or driving through floodwater.
- Disconnect electrical appliances.
- Stay updated via local alerts.

**For earthquake:**
- Drop, cover, and hold on.
- Stay indoors until the shaking stops.
- Avoid windows and heavy furniture.
- If outside, move to an open area away from buildings.

Always prioritize user safety by giving **practical survival steps**.
"""


prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(system_template),
    HumanMessagePromptTemplate.from_template("{input}")
])

# Initialize Agent
agent_executor = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# Run agent with user input
def chat_with_agent(user_prompt, user_email, lat, lon):
    full_input = f"{user_prompt}\nUser email: {user_email}\nLocation: {lat}, {lon}"
    return agent_executor.run(full_input)
