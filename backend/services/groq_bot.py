from groq import Groq
from services.groq_api import API_KEY

client = Groq(api_key=API_KEY)

def get_bot_response(history):
    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=history,
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,    
        stream=True,
        stop=None,
    )

    response = []
    for chunk in completion:
        content = chunk.choices[0].delta.content
        if content:
            response.append(content)
    return "".join(response)