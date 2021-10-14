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
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER -f "cd restAPI && rm -rf venv && virtualenv -p python3.8 venv && . venv/bin/activate && pwd && python -m pip install --upgrade pip wheel && python -m pip install -r requirements.txt && sudo systemctl restart restapi"
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
					withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'),
					string(credentialsId: 'webapp-server-username', variable: 'USER'),
					string(credentialsId: 'webapp-external-ip', variable: 'SERVERIP')]) {
						sh '''
						cd UI
						sed -i 's/172.19.232.88:8888/$SERVERIP:8888/g' src/app/services/auth.service.ts
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
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER -f "cd KaraokeSOA && pwd && sudo rsync -r * /var/www/html && sudo systemctl restart apache2"
					'''
				}
			}
		}
	}
}
