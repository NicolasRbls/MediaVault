#!/bin/bash

# Fail on any error
set -e

# --- Configuration ---
# The version for your Docker images. 
VERSION="1.0.7"

# Your Docker Hub username
DOCKER_HUB_USERNAME="oxow"

# --- Script ---

echo "🚀 Starting deployment process for version $VERSION..."

# Ensure you are logged in to Docker Hub
# docker login

# --- Build and Push Backend ---
echo "
🔨 Building and pushing backend image..."
cd backend
docker build -t $DOCKER_HUB_USERNAME/mediavault-backend:$VERSION .
docker push $DOCKER_HUB_USERNAME/mediavault-backend:$VERSION
cd ..

# --- Build and Push Frontend ---
echo "
🎨 Building and pushing frontend image..."
cd frontend
# We pass the VITE_API_URL as a build argument. For Kubernetes, it will be just /api
docker build --build-arg VITE_API_URL=/api -t $DOCKER_HUB_USERNAME/mediavault-frontend:$VERSION .
docker push $DOCKER_HUB_USERNAME/mediavault-frontend:$VERSION
cd ..

# --- Build and Push Backoffice ---
echo "
🖥️ Building and pushing backoffice image..."
cd backoffice
# The backoffice also connects to the /api path
docker build --build-arg VITE_API_URL=/api -t $DOCKER_HUB_USERNAME/mediavault-backoffice:$VERSION .
docker push $DOCKER_HUB_USERNAME/mediavault-backoffice:$VERSION
cd ..


echo "
🔄 Updating Kubernetes deployment files with image version $VERSION..."

# Use sed to replace the image placeholder. -i is for in-place editing.
sed -i "s|image: $DOCKER_HUB_USERNAME/mediavault-backend:.*|image: $DOCKER_HUB_USERNAME/mediavault-backend:$VERSION|g" k8s/backend-deployment.yml
sed -i "s|image: $DOCKER_HUB_USERNAME/mediavault-frontend:.*|image: $DOCKER_HUB_USERNAME/mediavault-frontend:$VERSION|g" k8s/frontend-deployment.yml
sed -i "s|image: $DOCKER_HUB_USERNAME/mediavault-backoffice:.*|image: $DOCKER_HUB_USERNAME/mediavault-backoffice:$VERSION|g" k8s/backoffice-deployment.yml

echo "
🚢 Applying Kubernetes manifests..."

# Apply all the configurations in the k8s directory
kubectl apply -f k8s/

echo "
✅ Deployment successful!"
echo "

To access the application, you need to get your Minikube IP:

  minikube ip

Then, access the following URLs in your browser:
  - Frontend: http://<MINIKUBE_IP>/
  - Backoffice: http://<MINIKUBE_IP>/admin/

It might take a few moments for all the pods to be up and running. You can check the status with:

  kubectl get pods -w

To see the ingress setup, run:

  kubectl get ingress

"