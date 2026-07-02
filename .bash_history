mkdir public
firebase deploy --project tuapunte-cd94a
echo '{"hosting": {"public": "public"}}' > firebase.json
firebase deploy --project tuapunte-cd94a
mkdir -p public
nano cors.json
gcloud storage buckets update gs://tuapunte-cd94a.firebasestorage.app --cors-file=cors.json
gcloud storage buckets list
gcloud storage buckets update gs://tuapunte-cd94a.appspot.com --cors-file=cors.json
echo '[
  {
    "origin": [
      "https://frolicking-sorbet-935acd.netlify.app",
      "http://localhost:3000",
      "http://localhost:5173"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "Authorization", "x-firebase-storage-version"],
    "maxAgeSeconds": 3600
  }
]' > cors.json
gcloud storage buckets update gs://tuapunte-cd94a.firebasestorage.app --cors-file=cors.json
gcloud storage buckets list
Regional Access Boundary HTTP request failed after retries: response_data={'error': {'code': 404, 'message': 'Account not found for email: 7e04c91f44|facundogonzalezsolanoyt@gmail.com', 'status': 'NOT_FOUND'}}, retryable_error=False
Listed 0 items.gcloud auth login
gcloud auth login
4/0AdkVLPyWa_ycivWRs6QuJVDLZsRwMNd-D0A_K6qhD86etju3io2s5EfgF7t4MXaCQQ4c1g
gcloud storage buckets list
gsutil cors set cors.json gs://EL_NOMBRE_DE_TU_BUCKET_AQUI
gsutil cors set cors.json gs://tuapunte-cd94a.firebasestorage.app/
firebase login
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// Endpoint: POST /process_payment
export const process_payment = onRequest({ cors: true }, (request, response) => {
});
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
// Endpoint: POST /process_payment
export const process_payment = onRequest({ cors: true }, (request, response) => {
});
firebase deploy --only functions
node -v
npm install -g firebase-tools
git init
git add 
git add .
git commit -m "primer deploy con funciones"
git config --global user.name "Facundo Gonzalez"
git config --global user.email "facundogonzalezsolano2@gmail.com"
git commit -m "primer deploy con funciones"
ls
ls netlify
find . -name "*.js"
mkdir -p netlify/functions
nano netlify/functions/create-preference.js
nano netlify.toml
git add .
git commit -m "agrego backend Mercado Pago"
git push
git status
find ~ -name "create-preference.js"
mkdir -p netlify/functions
nano netlify/functions/create-preference.js
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git branch -M main
git push -u origin main
no changes added to commit (use "git add" and/or "git commit -a")
papu
git branch -M main
git push -u origin main
git branch -M main
git push -u origin main
echo "hola"
git remote add origin TU_URL
git push -u origin main
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git push -u origin main
git remote remove origin
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git remote remove origin
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git remote remove origin
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git branch -M main
git add .
git commit -m "backend mercado pago listo"
git push -u origin main
git remote remove origin
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git push -u origin main
git remote remove origin
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git push -u origin main
git remote remove origin
git remote add origin https://github.com/facundogonzalezsolano2-source/papu.git
git push -u origin main
ls -a
git rm -r --cached .gemini
