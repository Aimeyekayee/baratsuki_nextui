from fastapi import Depends, FastAPI
from pydantic import BaseModel
import uvicorn
import math
from fastapi.middleware.cors import CORSMiddleware
from . import crud
import requests
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from typing import Union, List
import datetime as dt
from fastapi import HTTPException
from typing import Optional, List, Dict, Any, Union
from paho.mqtt import client as mqtt_client
from .schemas import (
    SearchInputParams,
    BaratsukiResponse,
    SearchRequestDataAreaParams,
    DataResponseHour,
)
from collections import defaultdict
import logging

origins = ["*"]

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
    machine_name: str
    date: Optional[dt.datetime]
    data: dict


@app.get("/get_section", response_model=List[Section])
async def get_section(db: Session = Depends(get_db)):
    section = crud.get_section(db=db)
    return section


@app.post("/get_rawdata", response_model=List[List[dict]])
async def get_rawdata(params: List[SearchInputParams], db: Session = Depends(get_db)):
    try:
        data = []
        result = []

        # First loop to collect data_points for each item in params
        for item in params:
            databaratsuki = crud.get_planID(
                section_code=item.section_code,
                line_id=item.line_id,
                machine_no=item.machine_no,
                working_date=item.working_date,
                db=db,
            )
            result.extend(databaratsuki)

        # Second loop to collect data_points for each item in result
        for items in result:
            data_points = crud.get_data_point_period(
                section_code=items["section_code"],
                line_id=items["line_id"],
                machine_no=items["machine_no"],
                working_date=items["working_date"].strftime(
                    "%Y-%m-%d"
                ),  # Convert to string if necessary
                periods=items["period"],
                plan_id=items["plan_id"],
                db=db,
            )
            # Each item in data_points represents a distinct data set
            data.append(data_points)

        # Rearrange data into the desired format
        rearranged_data = []
        print("ahga", data)
        for dataset in data:
            shift_groups = defaultdict(list)
            previous_entry = None
            for entry in dataset:
                if previous_entry:
                    entry["actual_this_period"] = (
                        entry["data"]["prod_actual"]
                        - previous_entry["data"]["prod_actual"]
                    )
                else:
                    entry["actual_this_period"] = entry["data"]["prod_actual"]
                previous_entry = entry
                entry["oa"] = (
                    round((entry["actual_this_period"] / entry["target100"]) * 100, 2)
                    if entry["target100"] != 0
                    else 0
                )

                shift_groups[entry["shift"]].append(entry)

            # Convert defaultdict to list of dictionaries
            rearranged_shifts = [
                {"shift": shift, "data": shift_groups[shift]}
                for shift in sorted(shift_groups.keys())
            ]
            rearranged_data.append(rearranged_shifts)

        return rearranged_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during get_rawdata: {e}")


@app.get("/get_linename", response_model=List[LineNameByOverviewResponseDetail])
async def get_section(section_name: str, db: Session = Depends(get_db)):
    line_name = crud.get_linename(section_name=section_name, db=db)
    return line_name


@app.get("/get_machinename", response_model=List[Machinename])
async def get_machinename(section_code: int, db: Session = Depends(get_db)):
    machine_name = crud.get_machinename(section_code=section_code, db=db)
    return machine_name


@app.get("/get_data_area", response_model=List[DataResponseHour])
async def get_data_area(
    section_code: int,
    line_id: int,
    machine_no: str,
    interval: str,
    date: Optional[dt.datetime],
    period: str,
    ct_target: float,
    challenge_rate: float,
    accummulate_target: int,
    accummulate_upper: int,
    accummulate_lower: int,
    duration: int,
    exclusion_time: int,
    target_challege_lower: int,
    target_challege_target: int,
    target_challege_upper: int,
    db: Session = Depends(get_db),
):
    data_area = crud.get_data_area(
        section_code=section_code,
        line_id=line_id,
        machine_no=machine_no,
        date=date,
        interval=interval,
        period=period,
        ct_target=ct_target,
        challenge_rate=challenge_rate,
        accummulate_target=accummulate_target,
        accummulate_upper=accummulate_upper,
        accummulate_lower=accummulate_lower,
        duration=duration,
        exclusion_time=exclusion_time,
        target_challege_lower=target_challege_lower,
        target_challege_target=target_challege_target,
        target_challege_upper=target_challege_upper,
        db=db,
    )
    return data_area


@app.get("/get_dataparameter_day", response_model=List[DataResponse])
async def get_dataparameter_day(
    section_code: int,
    line_id: int,
    machine_no1: str,
    machine_no2: str,
    date_current: str,
    next_date: str,
    isOdd: bool,
    shift: str,
    db: Session = Depends(get_db),
):
    print("fuas")
    data = crud.get_dataparameter_day(
        section_code=section_code,
        line_id=line_id,
        machine_no1=machine_no1,
        machine_no2=machine_no2,
        date_current=date_current,
        next_date=next_date,
        isOdd=isOdd,
        shift=shift,
        db=db,
    )
    return data


@app.get("/get_dataparameter_night", response_model=List[DataResponse])
async def get_dataparameter_night(
    section_code: int,
    line_id: int,
    machine_no1: str,
    machine_no2: str,
    date_current: str,
    next_date: str,
    isOdd: bool,
    shift: str,
    db: Session = Depends(get_db),
):
    print("fuas")
    data = crud.get_dataparameter_night(
        section_code=section_code,
        line_id=line_id,
        machine_no1=machine_no1,
        machine_no2=machine_no2,
        date_current=date_current,
        next_date=next_date,
        isOdd=isOdd,
        shift=shift,
        db=db,
    )
    return data


@app.get("/get_dataparameter_by_shift_column", response_model=List[DataResponse])
async def get_dataparameter_by_shift_column(
    section_code: int,
    line_id: int,
    machine_no1: str,
    machine_no2: str,
    date_current: str,
    next_date: str,
    db: Session = Depends(get_db),
):
    print("fuas")
    data = crud.get_dataparameter_by_shift_column(
        section_code=section_code,
        line_id=line_id,
        machine_no1=machine_no1,
        machine_no2=machine_no2,
        date_current=date_current,
        next_date=next_date,
        db=db,
    )
    return data


@app.post("/send")
async def send_to_line_notify(message: str):
    line_notify_token = "i3OfFdxy7kdqOesvoCFqjwrRjtYKO3ucCdbIdU86OsB"
    line_notify_api = "https://notify-api.line.me/api/notify"

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Bearer {line_notify_token}",
    }

    payload = {"message": message}

    response = requests.post(line_notify_api, headers=headers, data=payload)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail="Failed to send message to Line Notify",
        )

    return {"message": "Message sent successfully"}
