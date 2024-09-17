FROM python:3.8-buster

ENV PYTHONUNBUFFERED 1

WORKDIR /api.orders

RUN apt-get update && \
    apt-get install -y libmariadb3 libmariadb-dev nano && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5001

COPY . .

CMD [ "python3", "-m", "app"]
