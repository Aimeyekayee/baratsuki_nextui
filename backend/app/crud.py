from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from sqlalchemy import func
from datetime import datetime
from fastapi import HTTPException
import json
from typing import Optional, List, Dict, Any, Union
import datetime as dt


def convert_result(res):
    return [{c: getattr(r, c) for c in res.keys()} for r in res]


# def get_data(db: Session):
#     stmt = f"""
#         SELECT * FROM data_counter
#     """
#     try:
#         result = db.execute(text(stmt)).mappings().all()
#         return result
#     except Exception as e:
#         raise HTTPException(400,"Error get data :"+str(e))


def get_section(db: Session):
    stmt = f"""
        SELECT DISTINCT section_name FROM organizes WHERE line_name IS NOT NULL AND section_name IS NOT NULL
    """
    try:
        result = db.execute(text(stmt)).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(400, "Error get section :" + str(e))


def get_linename(section_name: str, db: Session):
    stmt = f"""
        SELECT DISTINCT line_id, section_code, line_name from organizes
        WHERE section_name = '{section_name}'
    """
    try:
        result = db.execute(text(stmt)).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(400, "Error get section :" + str(e))


def get_machinename(section_code: int, db: Session):
    stmt = f"""
        SELECT machine_no,machine_name FROM machines
        WHERE registered_section_code = {section_code}
        AND (machine_no LIKE '6%' OR machine_no LIKE 'T6%')
    """
    try:
        result = db.execute(text(stmt)).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(400, "Error get section :" + str(e))


def get_data_area(
    section_code: int,
    line_id: int,
    machine_no: str,
    date: Optional[dt.datetime],
    interval: str,
    db: Session,
):
    stmt = f"""
        SELECT section_code, line_id, machine_no, date, data FROM data_baratsuki
        WHERE section_code = {section_code}
        AND line_id = {line_id}
        AND machine_no = '{machine_no}'
        AND date BETWEEN TIMESTAMP '{date}' - INTERVAL '{interval}' 
        AND TIMESTAMP '{date}';
    """
    try:
        result = db.execute(text(stmt)).mappings().all()
        return result
    except Exception as e:
        raise HTTPException(400, "Error get section :" + str(e))


def get_dataparameter(
    section_code: int,
    line_id: int,
    machine_no1: str,
    machine_no2: str,
    date_current: str,
    next_date: str,
    isOdd: bool,
    db: Session,
    shift: str,
):
    minute_values_for_brake1_day = "30, 40" if isOdd else "20, 30"
    minute_values_for_brakemain_day = "15" if isOdd else "30"
    minute_values_for_brake2_day = "30, 40" if isOdd else "20, 30"

    minute_values_for_brakemain_night1 = "15" if isOdd else "30"
    minute_values_for_brakemain_night2 = "05" if isOdd else "20"
    stmt = f"""
        	SELECT db.id, db.section_code, db.line_id, db.machine_no, db.date, db.data,m.machine_name
            FROM public.data_baratsuki db
            JOIN public.machines m ON db.machine_no = m.machine_no
            WHERE (
                db.date::date = '{date_current}'
                AND (
                (EXTRACT(HOUR FROM db.date) = 7 AND EXTRACT(MINUTE FROM db.date) = 35)
                OR (EXTRACT(HOUR FROM db.date) = 8 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 9 AND EXTRACT(MINUTE FROM db.date) IN ({minute_values_for_brake1_day}))
                OR (EXTRACT(HOUR FROM db.date) = 10 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 11 AND EXTRACT(MINUTE FROM db.date) = {minute_values_for_brakemain_day})
                OR (EXTRACT(HOUR FROM db.date) = 12 AND EXTRACT(MINUTE FROM db.date) = {minute_values_for_brakemain_day})
                OR (EXTRACT(HOUR FROM db.date) = 13 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 14 AND EXTRACT(MINUTE FROM db.date) IN ({minute_values_for_brake2_day}))
                OR (EXTRACT(HOUR FROM db.date) = 15 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 16 AND EXTRACT(MINUTE FROM db.date) IN (30, 50))
                OR (EXTRACT(HOUR FROM db.date) = 17 AND EXTRACT(MINUTE FROM db.date) = 50)
                OR (EXTRACT(HOUR FROM db.date) = 19 AND EXTRACT(MINUTE FROM db.date) IN (20, 35))
                OR (EXTRACT(HOUR FROM db.date) = 20 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 21 AND EXTRACT(MINUTE FROM db.date) IN (30, 40))
                OR (EXTRACT(HOUR FROM db.date) = 22 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 23 AND EXTRACT(MINUTE FROM db.date) = {minute_values_for_brakemain_night1})
                OR (EXTRACT(HOUR FROM db.date) = 0 AND EXTRACT(MINUTE FROM db.date) = {minute_values_for_brakemain_night2})
                OR (EXTRACT(HOUR FROM db.date) = 1 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 2 AND EXTRACT(MINUTE FROM db.date) IN (30, 50))
                OR (EXTRACT(HOUR FROM db.date) = 3 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 4 AND EXTRACT(MINUTE FROM db.date) IN (30, 50))
                OR (EXTRACT(HOUR FROM db.date) = 5 AND EXTRACT(MINUTE FROM db.date) = 50)
            )
            ) OR (
                db.date::date = '{next_date}'
                AND (
                (EXTRACT(HOUR FROM db.date) = 0 AND EXTRACT(MINUTE FROM db.date) = {minute_values_for_brakemain_night2})
                OR (EXTRACT(HOUR FROM db.date) = 1 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 2 AND EXTRACT(MINUTE FROM db.date) IN (30, 50))
                OR (EXTRACT(HOUR FROM db.date) = 3 AND EXTRACT(MINUTE FROM db.date) = 30)
                OR (EXTRACT(HOUR FROM db.date) = 4 AND EXTRACT(MINUTE FROM db.date) IN (30, 50))
                OR (EXTRACT(HOUR FROM db.date) = 5 AND EXTRACT(MINUTE FROM db.date) = 50)
                OR (EXTRACT(HOUR FROM db.date) = 7 AND EXTRACT(MINUTE FROM db.date) = 20)
            )
                AND db.section_code = {section_code} AND db.line_id = {line_id} AND db.machine_no in ('{machine_no1}','{machine_no2}')
            )
            ORDER BY db.id ASC;
	
    """
    try:
        result = db.execute(text(stmt)).mappings().all()
        parsed_result = []
        for row in result:
            parsed_row = dict(row)  # Convert RowMapping to dictionary
            parsed_row["data"] = parsed_row[
                "data"
            ]  # Convert JSONB to Python dictionary
            parsed_result.append(parsed_row)

        return parsed_result
    except Exception as e:
        raise HTTPException(400, "Error get dataparameter :" + str(e))
