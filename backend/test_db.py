import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path('.') / '.env')
mongo_url = os.environ['MONGO_URL']
print(f'MongoDB URL: {mongo_url[:50]}...')

async def test():
    try:
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = client[os.environ['DB_NAME']]
        admins = await db.admins.find_one({})
        print(f'Connection OK! Admin found: {admins is not None}')
        if admins:
            print(f'Admin username: {admins.get("username")}')
    except Exception as e:
        print(f'MongoDB Error: {e}')

asyncio.run(test())
