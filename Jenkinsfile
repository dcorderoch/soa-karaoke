pipeline {
	agent any

	stages {
		stage ('soa_build_from_github - REST DEPLOY CODE') {
			steps {
				withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
					sh '''
					rsync -e "ssh -i ~/.ssh/id_ed25519" -rt -q restAPI $USER@$SERVER:
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
          '''
				}
			}
		}
		stage ('soa_build_from_github - RESTART MICROSERVICES') {
			steps {
				withCredentials([string(credentialsId: 'webapp-server', variable: 'SERVER'), string(credentialsId: 'webapp-server-username', variable: 'USER')]) {
					sh '''
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER "sudo docker-compose down"
					ssh -i ~/.ssh/id_ed25519 $USER@$SERVER "sudo docker-compose up -d"
          '''
				}
			}
		}
		stage ('soa_build_from_github - REST tests') {
			steps {
				withCredentials([string(credentialsId: 'webapp-external-ip', variable: 'DEPLOYIP')]) {
					sh '''
					result=$(curl -s http://$DEPLOYIP:8888/songs/filter/name/null | jq .songs)
					if ! [ "$result" = "[]" ]; then
					return 1
					fi
					'''
					sh '''
					result=$(curl -s http://$DEPLOYIP:8888/songs/filter/artist/null | jq .songs)
					if ! [ "$result" = "[]" ]; then
					return 1
					fi
					'''
					sh '''
					result=$(curl -s http://$DEPLOYIP:8888/songs/filter/album/null | jq .songs)
					if ! [ "$result" = "[]" ]; then
					return 1
					fi
					'''
					sh '''
					result=$(curl -s http://$DEPLOYIP:8888/songs/filter/name/doppelkupplungsgetriebe | jq .songs)
					if ! [ "$result" = "[]" ]; then
					return 1
					fi
					'''
					sh '''
					result=$(curl -s http://$DEPLOYIP:8888/songs/filter/name/kingofthehill | jq .songs)
					if ! [ "$result" = "[]" ]; then
					return 1
					fi
					'''
				}
			}
		}
	}
}
