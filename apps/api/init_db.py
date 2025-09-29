import asyncio
from database import engine, Base

# 👇 import models so Base knows them
import models

async def init_db():
    async with engine.begin() as conn:
        # optional: await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created successfully")

if __name__ == "__main__":
    asyncio.run(init_db())
