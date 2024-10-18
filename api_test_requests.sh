#!/bin/bash

BASE_URL="http://127.0.0.1:3333/api"

# Définition des couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les titres de section
print_section() {
    echo -e "\n${BLUE}==== $1 ====${NC}"
}

# Fonction pour l'authentification et la récupération du token
get_token() {
    local email=$1
    local password=$2
    local response=$(curl -s -X POST "${BASE_URL}/auth/login" \
         -H "Content-Type: application/json" \
         -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    echo $response | grep -o '"token":"[^"]*' | sed 's/"token":"//'
}

# Authentification pour deux utilisateurs
print_section "Connexion des utilisateurs"
TOKEN1=$(get_token "admin@admin.com" "admin")
TOKEN2=$(get_token "admin2@admin.com" "admin2")

echo -e "${GREEN}Token 1 obtenu: ${NC}$TOKEN1"
echo -e "${GREEN}Token 2 obtenu: ${NC}$TOKEN2"

print_section "Récupération des informations de l'utilisateur connecté"
curl -X GET "${BASE_URL}/auth/me" \
     -H "Authorization: Bearer $TOKEN1"

# Gestion des livres
print_section "Création d'un nouveau livre"
curl -X POST "${BASE_URL}/books" \
     -H "Authorization: Bearer $TOKEN1" \
     -H "Content-Type: application/json" \
     -d '{"title":"Le Petit Prince","author":"Antoine de Saint-Exupéry","publicationYear":1943}'
curl -X POST "${BASE_URL}/books" \
     -H "Authorization: Bearer $TOKEN1" \
     -H "Content-Type: application/json" \
     -d '{"title":"La Comédie Humaine","author":"Honoré de Balzac","publicationYear":1835}'

print_section "Récupération de tous les livres"
curl -X GET "${BASE_URL}/books" \
     -H "Authorization: Bearer $TOKEN1"

print_section "Récupération d'un livre spécifique "
curl -X GET "${BASE_URL}/books/1" \
     -H "Authorization: Bearer $TOKEN1"

print_section "Mise à jour d'un livre "
curl -X PUT "${BASE_URL}/books/1" \
     -H "Authorization: Bearer $TOKEN1" \
     -H "Content-Type: application/json" \
     -d '{"title":"Le Petit Prince (Édition révisée)","publicationYear":1945}'

print_section "Suppression d'un livre "
curl -X DELETE "${BASE_URL}/books/2" \
     -H "Authorization: Bearer $TOKEN1"

# Test d'emprunt de livre déjà emprunté
print_section "Test d'emprunt de livre déjà emprunté"
echo "Utilisateur 1 emprunte le livre 1"
curl -X POST "${BASE_URL}/loans/borrow" \
     -H "Authorization: Bearer $TOKEN1" \
     -H "Content-Type: application/json" \
     -d '{"bookId":1}' && print_result

echo "Utilisateur 2 tente d'emprunter le même livre"
curl -X POST "${BASE_URL}/loans/borrow" \
     -H "Authorization: Bearer $TOKEN2" \
     -H "Content-Type: application/json" \
     -d '{"bookId":1}' && print_result

# Gestion des emprunts
print_section "Emprunt d'un livre "
curl -X POST "${BASE_URL}/loans/borrow" \
     -H "Authorization: Bearer $TOKEN1" \
     -H "Content-Type: application/json" \
     -d '{"bookId":1}'
echo "\n\nEmprunt d'un livre "
curl -X POST "${BASE_URL}/loans/borrow" \
     -H "Authorization: Bearer $TOKEN1" \
     -H "Content-Type: application/json" \
     -d '{"bookId":2}'

print_section "Retour d'un livre emprunté "
curl -X POST "${BASE_URL}/loans/1/return" \
     -H "Authorization: Bearer $TOKEN1"

print_section "Récupération des emprunts de l'utilisateur"
curl -X GET "${BASE_URL}/loans/user" \
     -H "Authorization: Bearer $TOKEN1"

# Ajoutez cette fonction à la fin du fichier
print_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Succès${NC}"
    else
        echo -e "${RED}Échec${NC}"
    fi
}

# Utilisez cette fonction après chaque appel curl, par exemple :
# curl ... && print_result
