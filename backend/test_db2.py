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
        print('Connecting to MongoDB...')
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=10000)
        db = client[os.environ['DB_NAME']]
        print('Checking admins collection...')
        admins = await db.admins.find({}).to_list(length=10)
        print(f'Found {len(admins)} admin(s)')
        for admin in admins:
            print(f'  - Username: {admin.get("username")}, ID: {admin.get("id")}')
    except Exception as e:
        print(f'MongoDB Error: {e}')

asyncio.run(test())
