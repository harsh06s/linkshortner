from fastapi.responses import RedirectResponse
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import Session 
from sqlalchemy.orm import sessionmaker, declarative_base  
import random , string
from fastapi.middleware.cors import CORSMiddleware

DB_URL = "sqlite:///./links.db"

engine = create_engine(DB_URL,connect_args={"check_same_thread":False}) 

# SessionLocal hamara wo "Pen" hai jisse hum DB mein entry karenge
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base for all the tables
Base = declarative_base()



class Link(Base):
    __tablename__ = "urls" # real table name in DB

    id = Column(Integer, primary_key=True)
    short_id = Column(String, unique=True)
    long_url = Column(String)


Base.metadata.create_all(bind=engine)

def save_links_to_db(s_id:str, l_url:str):

    db_session = SessionLocal()                                                   # pick ur pen
    new_entry = Link(short_id=s_id, long_url=l_url)                               # entry for table
    db_session.add(new_entry)                                                     # add it to table
    db_session.commit()                                                           # commit--> save
    db_session.close()                                                            # close session


def generate_short_id(length=6):
    
    chars = string.ascii_letters + string.digits

    result = "".join(random.choices(chars, k=length))

    return result



# 1. starting a server
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins =["*"],
    allow_methods =["*"],
    allow_headers =["*"]
)

# 2. dummy database
# db = {}

# # 3 . first route
@app.get("/")
def read_root():
    return {"status": "server chal rha hai!"}


# 4.for logic part (shortening url)
@app.get("/make-short")
def shorten_url(long_url: str):
    db = SessionLocal()


    existing_link = db.query(Link).filter(Link.long_url == long_url).first()

    if existing_link:
        db.close()

        return{
            "message":"already exist",
            "short_url": f"http://localhost:8000/{existing_link.short_id}",
            "orignal_url": long_url

        }
    
    unique_id = generate_short_id()

    save_links_to_db(unique_id, long_url)
    
    db.close()

    return{
        "message": "Sucess!",
        "short_url": f"http://localhost:8000/{unique_id}",
        "orignal_url": long_url

    }

@app.get("/{short_id}")
def redirect_to_url(short_id:str):

    db = SessionLocal()

    link_record = db.query(Link).filter(Link.short_id == short_id).first()

    db.close()

    if link_record:
        return RedirectResponse(url =link_record.long_url)

    return {"error" :"doesnot exist in my notebook"}
    

