Guide pour lancer le projet : 

 	exécution local classique : 
	
Pour lancer le back-end :
 uvicorn app:app --reload

Pour lancer front-end : 	
				npm start 


pour lancer le projet avec docker :  

	Sur le répertoire du back : docker run -p 3000:3000 react-image

	Sur le répertoire du front : docker run -p 8000:8000 python-fastapi

	Sur le fichier docker-compose.yaml : docker-compose up 
			
