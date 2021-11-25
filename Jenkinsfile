pipeline {
	agent any

	stages {
		stage ('soa_build_from_github - REST DEPLOY') {
			steps {
				withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
					sh '''
					rsync -e "ssh -i ~/.ssh/id_ed25519" -rt -q restAPI $USER@$SERVER:
					'''
					sh '''
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER "sudo docker stop flask && sudo docker rm flask"
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER "cd restAPI && sudo docker build -t restapi:latest . && sudo docker -t -d -p 8888:8888 --name flask restpi:latest"
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER "sudo docker system prune -f"
					# TODO: use docker-compose
					'''
				}
			}
		}
		stage ('soa_build_from_github - APP') {
			steps {
				nvm(nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh',
				version: 'v16.8.0',
				nvmInstallDir: '$HOME/.nvm',
				nvmIoJsOrgMirror: 'https://iojs.org/dist',
				nvmNodeJsOrgMirror: 'https://nodejs.org/dist') {
					withCredentials([string(credentialsId: 'webapp-external-ip', variable: 'DEPLOYIP')]) {
						sh '''cd UI && sed -i -e s%172.19.232.88%${DEPLOYIP}%g src/app/services/auth.service.ts && cd ..'''
					}
					withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
						sh '''
						cd UI
						npm i
						npm run build
						ssh -i ~/.ssh/id_ed25519 $USER@$SERVER -f "rm -rf KaraokeSOA"
						rsync -e "ssh -i ~/.ssh/id_ed25519" -rt -q dist/KaraokeSOA $USER@$SERVER:
						'''
					}
				}
			}
		}
		stage ('soa_build_from_github - Deploy APP') {
			steps {
				withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
					sh '''
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER -f "cd KaraokeSOA && sudo rm -rf /var/www/html/* && sudo cp -r * /var/www/html && sudo systemctl restart apache2"
					'''
				}
			}
		}
	}
}
