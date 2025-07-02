FROM python:3.12-alpine

WORKDIR /app
RUN pip install flask

COPY app.py /app/app.py
RUN mkdir /lockdata

EXPOSE 61337

CMD ["python", "/app/app.py"]
