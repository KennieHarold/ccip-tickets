import fs from 'fs';

export function updateEnv(key: string, value: string) {
  const envFilePath = './.env';
  const envContents = fs.readFileSync(envFilePath, 'utf-8');
  const updatedEnvKey = envContents.replace(new RegExp(`^${key}=.*`, 'gm'), `${key}=${value}`);
  fs.writeFileSync(envFilePath, updatedEnvKey);
}
