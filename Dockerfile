FROM jupyter/scipy-notebook:610bb8b938db
USER root
COPY ./requirements.txt /home/jovyan/requirements.txt
WORKDIR /home/jovyan
RUN pip install --upgrade pip 
RUN pip install -U -r requirements.txt
