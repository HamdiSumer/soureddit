FROM python:3.9

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /code

COPY ./requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

COPY ./soureddit/ /code/soureddit/

RUN ls -R /code

EXPOSE 8000

CMD ["python", "soureddit/manage.py", "runserver", "0.0.0.0:8000"]