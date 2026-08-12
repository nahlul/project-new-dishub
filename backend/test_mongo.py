import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
from datetime import datetime, timezone

MONGO_URL = "mongodb+srv://cirocina6_db_user:u4pvm6YqxWDCbWqX@cluster0.r2vm25i.mongodb.net/?retryWrites=true&w=majority"

async def test():
    try:
        client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=10000)
        db = client['transkoetaradja']
        
        # Test ping
        result = await db.command('ping')
        print(f'Ping OK: {result}')
        
        # Check existing admins
        admins = await db.admins.find({}).to_list(length=10)
        print(f'Found {len(admins)} admin(s)')
        for a in admins:
            print(f'  - {a.get("username")}')
            
    except Exception as e:
        print(f'Error: {e}')

asyncio.run(test())
