/** Script is run using ts-node, with yargs for command line arguments */

/** ------------------------------ */
const version = '1.0.0';
/** ------------------------------ */

const { writeFile, existsSync, mkdirSync } = require("fs");
const { argv } = require('yargs');

require('dotenv').config(); // Charge le contenu de '.env' dans process.env
const envDirectory = './src/environments'; // Emplacement du dossier par défaut

// Crée le dossier si non présent
if(!existsSync(envDirectory)) {
  mkdirSync(envDirectory);
}

let targetPath: string = '';
// Récupère la valeur de l'option passée en ligne de commande
switch(argv.env) {
  case 'prod':
    targetPath = `${envDirectory}/environment.prod.ts`;
    break;
  case 'dev':
  default:
    targetPath = `${envDirectory}/environment.ts`;
     break;
}

// Definition
const envFileContent =
`// This file was autogenerated dynamically using dotenv for managing environment variables

export const environment = {
  production: ${argv.env === 'prod'},
  VERSION: '${version}',
  apiUrl: 'http://localhost:4000/api',
  degiroUser: '${process.env['DEGIRO_USER']}',
  degiroPassword: '${process.env['DEGIRO_PASSWORD']}'
};

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as 'zone.run', 'zoneDelegate.invokeTask'.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
`;

// Copie les variables générées dans le fichier env correspondant à l'env de déploiement, et crée le fichier s'il n'existe pas
copyToFile(targetPath, envFileContent);

function copyToFile(targetPath: string, envFileContent: string): void {

  writeFile(targetPath, envFileContent, function(error: any) {
    if(error) {
      console.log(error);
    }
    if(envFileContent !== '') {
      console.log(`wrote variables to ${targetPath}`);
    }
  });
}