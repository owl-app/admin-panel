import { registerAs } from "@nestjs/config";
import { IJwtConfig, JWT_CONFIG_NAME } from "@owl/api-auth";

export default registerAs(JWT_CONFIG_NAME, (): IJwtConfig => {
    return {
        secret: process.env.JWT_SECRET,
        expiration_time: parseInt(process.env.JWT_EXPIRATION_TIME),
        refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        refresh_token_expiration_time: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME)
    }
})