import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from utils.auth_utils import hash_password, verify_password
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

async def check():
    client = AsyncIOMotorClient(os.environ['MONGO_URL'], serverSelectionTimeoutMS=5000)
    db = client[os.environ['DB_NAME']]
    
    admin = await db.admins.find_one({'username': 'admin'})
    print(f'Admin exists: {admin is not None}')
    
    if admin:
        print(f'Admin ID: {admin.get("id")}')
        print(f'Password hash exists: {"password_hash" in admin}')
        print(f'Can verify password: {verify_password("admin", admin["password_hash"])}')
    else:
        print('Creating admin user...')
        admin_doc = {
            'id': 'admin-001',
            'username': 'admin',
            'password_hash': hash_password('admin'),
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        }
        result = await db.admins.insert_one(admin_doc)
        print(f'Admin created')

asyncio.run(check())
