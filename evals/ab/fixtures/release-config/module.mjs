export function releaseConfig(env) {
  return {port:Number(env.PORT)||3000,databasePath:env.DATABASE_PATH,
    secretKey:env.SECRET_KEY,publicConfig:{...env}};
}
