from fastapi import Depends, FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from . import crud
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from typing import Union, List
import datetime as dt
from fastapi import HTTPException
from typing import Optional, List, Dict, Any, Union

origins = ["*"]

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Data(BaseModel):
    date: dt.datetime
    actual: int
    target: int
    lower: int
    upper: int


class Section(BaseModel):
    section_name: Optional[str]


class SectionResponse(BaseModel):
    section: List[Section]


class LineNameByOverviewResponseDetail(BaseModel):
    line_id: int
    line_name: Optional[str]


class Machinename(BaseModel):
    machine_no: str
    machine_name: str


class DataParemeters(BaseModel):
    ct_actual: float
    prod_actual: int


class DataResponse(BaseModel):
    section_code: int
    line_id: int
    machine_no: str
    date: Optional[dt.datetime]
    data: dict


# @app.get("/get_data", response_model=List[Data])
# async def get_data(db: Session = Depends(get_db)):
#     data = crud.get_data(db=db)
#     return data


@app.get("/get_section", response_model=List[Section])
async def get_section(db: Session = Depends(get_db)):
    section = crud.get_section(db=db)
    return section


@app.get("/get_linename", response_model=List[LineNameByOverviewResponseDetail])
async def get_section(section_name: str, db: Session = Depends(get_db)):
    line_name = crud.get_linename(section_name=section_name, db=db)
    return line_name


@app.get("/get_machinename", response_model=List[Machinename])
async def get_machinename(section_code: int, db: Session = Depends(get_db)):
    machine_name = crud.get_machinename(section_code=section_code, db=db)
    return machine_name


@app.get("/get_dataparameter", response_model=List[DataResponse])
async def get_dataparameter(
    section_code: int,
    line_id: int,
    machine_no1: str,
    machine_no2: str,
    date_current: str,
    next_date: str,
    db: Session = Depends(get_db),
):
    print("fuas")
    data = crud.get_dataparameter(
        section_code=section_code,
        line_id=line_id,
        machine_no1=machine_no1,
        machine_no2=machine_no2,
        date_current=date_current,
        next_date=next_date,
        db=db,
    )
    return data
