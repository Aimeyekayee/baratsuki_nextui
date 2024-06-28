from pydantic import BaseModel
from typing import Optional, List, Dict, Any, Union
import datetime


class SearchInputParams(BaseModel):
    section_code: int
    line_id: int
    machine_no: str
    working_date: str


class RawDataEachRow(BaseModel):
    ct_actual: float
    prod_actual: int


class MachineDataRaw(BaseModel):
    id: int
    section_code: int
    line_id: int
    machine_no: str
    machine_name: str
    data: RawDataEachRow
    date: Optional[datetime.datetime]
    duration: int
    hour_no: int
    period: str
    actual_this_period: int
    ct_target: float
    working_date: Optional[datetime.datetime]
    shift: int
    shift_no: int
    plan_type: str
    plan_id: int
    exclusion_time: int


class BaratsukiResponse(BaseModel):
    shift: int
    data: List[MachineDataRaw]


class SearchRequestDataAreaParams(BaseModel):
    section_code: int
    line_id: int
    machine_no: str
    date: Optional[datetime.datetime]
    interval: str
    period: str
    ct_target: int
    challenge_rate: int
    accummulate_target: int
    accummulate_upper: int
    accummulate_lower: int
    duration: int
    exclusion_time: int
    target_challege_lower: int
    target_challege_target: int
    target_challege_upper: int


class RawDataEachRow(BaseModel):
    ct_actual: int
    prod_actual: int


class DataResponseHour(BaseModel):
    section_code: int
    line_id: int
    machine_no: str
    date: Optional[datetime.datetime]
    data: dict
    period: str
    machine_name: str
    ct_target: float
    challenge_rate: float
    accummulate_target: int
    accummulate_upper: int
    accummulate_lower: int
    duration: int
    exclusion_time: int
    target_challege_lower: int
    target_challege_target: int
    target_challege_upper: int
