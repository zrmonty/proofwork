const required = (env, key) => {
  if (typeof env[key] !== 'string' || !env[key].trim()) throw new Error('invalid required release setting');
  return env[key];
};
const portFrom = env => {
  const value = required(env, 'PORT');
  if (!/^[0-9]+$/.test(value) || Number(value) < 1 || Number(value) > 65535) throw new Error('invalid port');
  return Number(value);
};
export function releaseConfig(env) {
  return {port:portFrom(env),databasePath:required(env,'DATABASE_PATH'),secretKey:required(env,'SECRET_KEY'),
    publicConfig:{appName:env.PUBLIC_APP_NAME ?? 'Invoices'}};
}
