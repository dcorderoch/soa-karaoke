pipeline {
	agent any

	stages {
		stage ('soa_build_from_github - DOCKER DEPLOY CODE') {
			steps {
				withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
					sh '''
					rsync -e "ssh -i ~/.ssh/id_ed25519" -rt -q docker-compose.yml $USER@$SERVER:
					'''
				}
			}
		}
		stage ('soa_build_from_github - REST DEPLOY CODE') {
			steps {
				withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
					sh '''
					rsync -e "ssh -i ~/.ssh/id_ed25519" -rt -q restAPI $USER@$SERVER:
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER "sudo docker-compose up -d restapi"
					'''
				}
			}
		}
		stage ('soa_build_from_github - APP BUILD') {
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
						'''
					}
				}
			}
		}
		stage ('soa_build_from_github - APP DEPLOY CODE') {
			steps {
				withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
					sh '''
          cd UI
          rsync -e "ssh -i ~/.ssh/id_ed25519" -rt -q dist/KaraokeSOA $USER@$SERVER:
          rsync -e "ssh -i ~/.ssh/id_ed25519" -rt -q nginx.conf Dockerfile $USER@$SERVER:KaraokeSOA
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER "sudo docker-compose up -d webapp"
          '''
				}
			}
		}
	}
}
