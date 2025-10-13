#!/bin/bash

# Arrête le script si une commande échoue
set -e

# --- Configuration ---
# Votre nom d'utilisateur Docker Hub ou l'adresse de votre registre privé (ex: registry.votre-domaine.com)
DOCKER_REGISTRY="oxow"

# Le nom de base pour vos images
BACKEND_IMAGE_NAME="mediavault-backend"
FRONTEND_IMAGE_NAME="mediavault-frontend"
BACKOFFICE_IMAGE_NAME="mediavault-backoffice"

# La version pour vos images Docker. Utiliser le hash court du commit git est une bonne pratique pour la traçabilité.
VERSION=$(git rev-parse --short HEAD)

# --- Script ---

echo "🚀 Lancement du processus de déploiement VPS pour la version $VERSION..."

# Optionnel : Assurez-vous d'être connecté à votre registre Docker
# docker login $DOCKER_REGISTRY

# --- Build et Push du Backend ---
echo "
🔨 Construction et push de l'image du backend..."
cd backend
docker build -t $DOCKER_REGISTRY/$BACKEND_IMAGE_NAME:$VERSION .
docker push $DOCKER_REGISTRY/$BACKEND_IMAGE_NAME:$VERSION
cd ..

# --- Build et Push du Frontend ---
echo "
🎨 Construction et push de l'image du frontend..."
cd frontend
# On passe VITE_API_URL comme argument de build. Pour une configuration Kubernetes, ce sera simplement /api
docker build --build-arg VITE_API_URL=/api -t $DOCKER_REGISTRY/$FRONTEND_IMAGE_NAME:$VERSION .
docker push $DOCKER_REGISTRY/$FRONTEND_IMAGE_NAME:$VERSION
cd ..

# --- Build et Push du Backoffice ---
echo "
🖥️ Construction et push de l'image du backoffice..."
cd backoffice
# Le backoffice se connecte également au chemin /api
docker build --build-arg VITE_API_URL=/api -t $DOCKER_REGISTRY/$BACKOFFICE_IMAGE_NAME:$VERSION .
docker push $DOCKER_REGISTRY/$BACKOFFICE_IMAGE_NAME:$VERSION
cd ..

echo "
🔄 Mise à jour des fichiers de déploiement Kubernetes avec la version d'image $VERSION..."

# Utilise sed pour remplacer le placeholder de l'image. L'option -i est pour l'édition sur place.
# La regex est conçue pour être flexible avec différents chemins de registre.
sed -i "s|image: .*/$BACKEND_IMAGE_NAME:.*|image: $DOCKER_REGISTRY/$BACKEND_IMAGE_NAME:$VERSION|g" k8s/backend-deployment.yml
sed -i "s|image: .*/$FRONTEND_IMAGE_NAME:.*|image: $DOCKER_REGISTRY/$FRONTEND_IMAGE_NAME:$VERSION|g" k8s/frontend-deployment.yml
sed -i "s|image: .*/$BACKOFFICE_IMAGE_NAME:.*|image: $DOCKER_REGISTRY/$BACKOFFICE_IMAGE_NAME:$VERSION|g" k8s/backoffice-deployment.yml

echo "
🚢 Application des manifestes Kubernetes..."

# Sur un serveur K3s, 'k3s kubectl' est la commande la plus explicite.
# Nous l'utilisons pour garantir la compatibilité.
k3s kubectl apply -f k8s/

echo "
✅ Déploiement réussi !"
echo "
Pour accéder à l'application, utilisez l'adresse IP publique de votre VPS ou le nom de domaine que vous avez configuré pour votre Ingress.

  - Frontend: http://<VOTRE_IP_VPS_OU_DOMAINE>/
  - Backoffice: http://<VOTRE_IP_VPS_OU_DOMAINE>/admin/

Cela peut prendre quelques instants pour que tous les pods soient opérationnels. Vous pouvez vérifier le statut avec :
  kubectl get pods -w

Pour voir la configuration de l'ingress et l'adresse à laquelle il est lié, exécutez :
  kubectl get ingress
"
