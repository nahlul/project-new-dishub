import logging
from datetime import datetime, timezone
from typing import Optional, Dict, List, Any
from utils.auth_utils import hash_password, verify_password

logger = logging.getLogger(__name__)

# In-memory database
_db = {
    'admins': {},
    'news': {},
    'gallery': {},
    'contact': {},
    'social_media': {},
    'about': {}
}

def init_db():
    """Initialize database with default data"""
    global _db
    
    # Create admin user
    admin_username = 'nahlul'
    admin_password = 'nahlul'
    _db['admins']['admin-001'] = {
        'id': 'admin-001',
        'username': admin_username,
        'password_hash': hash_password(admin_password),
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    # Create sample news
    news_data = [
        {
            'id': 'news-001',
            'title': 'Bus Trans Koetaradja Kembali Beroperasi',
            'excerpt': 'BANDA ACEH - Bus Trans Koetaradja kembali beroperasi melayani mobilitas masyarakat',
            'content': 'Bus Trans Koetaradja kembali beroperasi melayani mobilitas masyarakat di wilayah Banda Aceh dan Aceh Besar.',
            'date': '1 Januari 2024',
            'category': 'Berita',
            'image_url': 'https://via.placeholder.com/640x480',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'updated_at': datetime.now(timezone.utc).isoformat()
        }
    ]
    for news in news_data:
        _db['news'][news['id']] = news
    
    # Create contact info
    _db['contact']['contact_info'] = {
        'id': 'contact_info',
        'address': 'Jl. T. Panglima Nyak Makam No. 12, Banda Aceh',
        'phone': '+62 811 6712349',
        'email': 'info@transkutaraja.acehprov.go.id',
        'operational_hours': '06:00 - 18:00 WIB',
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    # Create social media
    _db['social_media']['social_media'] = {
        'id': 'social_media',
        'whatsapp': 'https://wa.me/6281167123490',
        'instagram': 'https://www.instagram.com/dishubaceh',
        'facebook': 'https://www.facebook.com/dishub.aceh',
        'twitter': 'https://twitter.com/dishubaceh',
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    # Create about content
    _db['about']['about_content'] = {
        'id': 'about_content',
        'content': 'Trans Koetaradja adalah sistem transportasi Bus Rapid Transit (BRT) yang melayani Kota Banda Aceh.',
        'updated_at': datetime.now(timezone.utc).isoformat()
    }
    
    logger.info('In-memory database initialized')

class MockCollection:
    """Mock MongoDB collection using in-memory dict"""
    
    def __init__(self, name: str):
        self.name = name
        self.data = _db[name]
    
    async def find_one(self, query: Dict, projection: Optional[Dict] = None) -> Optional[Dict]:
        """Find one document matching query"""
        for doc in self.data.values():
            match = True
            for key, value in query.items():
                if key not in doc or doc[key] != value:
                    match = False
                    break
            if match:
                result = doc.copy()
                if projection and '_id' in projection and projection['_id'] == 0:
                    result.pop('_id', None)
                return result
        return None
    
    async def find(self, query: Optional[Dict] = None):
        """Find all documents matching query"""
        results = []
        for doc in self.data.values():
            if query is None:
                results.append(doc.copy())
            else:
                match = True
                for key, value in query.items():
                    if key not in doc or doc[key] != value:
                        match = False
                        break
                if match:
                    results.append(doc.copy())
        return MockCursor(results)
    
    async def insert_one(self, document: Dict):
        """Insert one document"""
        doc_id = document.get('id', f'{self.name}-{len(self.data)+1:03d}')
        self.data[doc_id] = document.copy()
        return MockInsertResult(doc_id)
    
    async def update_one(self, query: Dict, update: Dict):
        """Update one document"""
        for doc_id, doc in self.data.items():
            match = True
            for key, value in query.items():
                if key not in doc or doc[key] != value:
                    match = False
                    break
            if match:
                if '' in update:
                    doc.update(update[''])
                return MockUpdateResult(1)
        return MockUpdateResult(0)
    
    async def delete_one(self, query: Dict):
        """Delete one document"""
        for doc_id, doc in list(self.data.items()):
            match = True
            for key, value in query.items():
                if key not in doc or doc[key] != value:
                    match = False
                    break
            if match:
                del self.data[doc_id]
                return MockDeleteResult(1)
        return MockDeleteResult(0)
    
    async def count_documents(self, query: Optional[Dict] = None) -> int:
        """Count documents matching query"""
        if query is None:
            return len(self.data)
        count = 0
        for doc in self.data.values():
            match = True
            for key, value in query.items():
                if key not in doc or doc[key] != value:
                    match = False
                    break
            if match:
                count += 1
        return count

class MockCursor:
    """Mock MongoDB cursor"""
    
    def __init__(self, results: List[Dict]):
        self.results = results
    
    async def to_list(self, length: Optional[int] = None) -> List[Dict]:
        """Convert cursor to list"""
        if length:
            return self.results[:length]
        return self.results

class MockInsertResult:
    """Mock MongoDB insert result"""
    
    def __init__(self, inserted_id: str):
        self.inserted_id = inserted_id

class MockUpdateResult:
    """Mock MongoDB update result"""
    
    def __init__(self, modified_count: int):
        self.modified_count = modified_count

class MockDeleteResult:
    """Mock MongoDB delete result"""
    
    def __init__(self, deleted_count: int):
        self.deleted_count = deleted_count

class MockDatabase:
    """Mock MongoDB database"""
    
    def __init__(self):
        self.admins = MockCollection('admins')
        self.news = MockCollection('news')
        self.gallery = MockCollection('gallery')
        self.contact = MockCollection('contact')
        self.social_media = MockCollection('social_media')
        self.about = MockCollection('about')
    
    async def command(self, cmd: str):
        """Mock database command"""
        if cmd == 'ping':
            return {'ok': 1.0}
        return None

# Global database instance
db = MockDatabase()
