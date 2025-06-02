# Utiliser l'image Nginx officielle depuis Docker Hub
FROM nginx:alpine

# Supprimer la configuration par défaut de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre fichier de configuration Nginx personnalisé
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 (HTTP)
EXPOSE 80

# La commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"] 