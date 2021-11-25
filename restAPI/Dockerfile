FROM python:3-alpine
COPY . /app
WORKDIR /app
RUN pip install --no-cache --upgrade pip
RUN pip install --no-cache -r requirements.txt
EXPOSE 8888
ENTRYPOINT ["python"]
CMD ["main.py"]
