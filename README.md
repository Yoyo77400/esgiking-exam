# esgiking-exam

Réalisation d’une API Node.JS permettant de réaliser des commandes aux bornes, sur un téléphone, ou
en ligne pour une chaine de fast food et de gérer aussi les commandes en cuisine.

Il doit IMPERATIVEMENT avoir 3 modes :
- Le mode BigBoss permet de gerer l'ensemble des restaurants de la chaine, d'en ajouter et d'en
supprimer. Le BigBoss peut aussi cré er des comptes Admin et de les affecter aux restaurant. Un
utilisateur admin peut accé der qu'a un seul restaurant. L’utilisateur bigboss doit obligatoirement être
connecté à l’aide d’un token de session

- Le mode Admin permet de gérer les produits, menu, promotions, mises en avant, ainsi que la possibilité
de récupérer et de traiter les commandes. L’utilisateur admin doit obligatoirement être connecté à l’aide d’
un token de session

- Le mode Customer permet de voir les produits, menu, promotions, ainsi que de passer des commandes
en magasin et il doit obligatoirement se connecter pour passer commande s'il est a distance.

- Le mode Préparateur permet de voir les les commandes et de les traiter. L’utilisateur préparateur doit
obligatoirement être connecté à l’aide d’un token de session

- Le mode Livreur: Permet de recevoir une commande et de le livrer à un client à domicile. Un suivi du
livreur en temps réel doit être ajouté dans l'API pour le client. Un chat avec le livreur doit être aussi prévu.
Le livreur choisi par l'application est celui le plus proche du restaurant. L’utilisateur livreur doit
obligatoirement être connecté à l’aide d’un token de session
Vous devrez réaliser la base de données en relation avec votre API, une documentation de l’ensemble de
vos services web est attendue (pour chaque : méthode, url, entrée, sortie, cas d’erreur, etc...)
Bonus: un back-office, un front pour les bornes, un front pour la cuisine, une application mobile pour
passer commande, le suivie de livraison depuis une tablette ? une visualisation des produits disponible en
restaurant en VR ?
