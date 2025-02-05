# Message model for the chatbot

from enum import Enum
from pydantic import BaseModel
from datetime import datetime

class Sender(Enum):
    USER = 'USER'
    AI = 'AI'


class Message(BaseModel):
    id: int
    sender: Sender
    receiver: str
    content: str
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()