# Use official kubectl image as base
FROM bitnami/kubectl:latest

# Copy your Kubernetes manifest files into the image
COPY k8s /k8s

# Set working directory inside container
WORKDIR /k8s
