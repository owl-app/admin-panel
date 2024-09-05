import { registerAs } from "@nestjs/config";

export default registerAs('db', () => ({
    type: process.env.DB_TYPE || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    synchronize: true,
    timezone: 'Z',
    // logger: 'advanced-console',
    // logging: true,
    autoLoadEntities: true
}))