FROM python:3.11.4-alpine
ENV TZ=Asia/Bangkok
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN apk add curl
RUN apk update && apk add gcc g++ unixodbc unixodbc-dev
RUN pip install --no-cache-dir -r /code/requirements.txt
COPY ./app /code/app
# COPY ./.env /code/.env

CMD ["uvicorn", "app.main:app","--host","0.0.0.0","--port","8000"]
