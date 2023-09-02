## docker build . --tag extending_airflow:latest

FROM apache/airflow:2.6.3
COPY airflow/requirements.txt /requirements.txt
COPY ./airflow_credentials.json /opt/airflow/airflow_credentials.json
RUN pip install --user --upgrade pip
RUN pip install --no-cache-dir --user -r /requirements.txt