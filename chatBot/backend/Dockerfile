FROM pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime

# Install dependencies
RUN apt-get update && apt-get install -y git

# Copy and install Python requirements
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend code
COPY . /app
WORKDIR /app


CMD ["python", "run.py"]
