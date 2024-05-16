from fastapi import Depends, FastAPI
from pydantic import BaseModel
import uvicorn
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
import random

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
    machine_name: str
    date: Optional[dt.datetime]
    data: dict


class DataResponseHour(BaseModel):
    section_code: int
    line_id: int
    machine_no: str
    date: Optional[dt.datetime]
    data: dict


broker = "broker.emqx.io"
port = 8083
topic = "6de4ca0a64e44ce3941edaadf1f31635/rotor/linenotify"
client_id = f"python-mqtt-{random.randint(0, 1000)}"


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print(f"Failed to connect, return code {rc}")

    client = mqtt_client.Client(client_id)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def run():
    print("here")
    client = connect_mqtt()
    client.loop_start()
    client.loop_stop()


if __name__ == "__main__":
    run()


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


@app.get("/get_data_area", response_model=List[DataResponseHour])
async def get_data_area(
    section_code: int,
    line_id: int,
    machine_no: str,
    interval: str,
    date: Optional[dt.datetime],
    db: Session = Depends(get_db),
):
    data_area = crud.get_data_area(
        section_code=section_code,
        line_id=line_id,
        machine_no=machine_no,
        date=date,
        interval=interval,
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
