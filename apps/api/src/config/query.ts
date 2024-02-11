import { registerAs } from "@nestjs/config";
import { QUERY_CONFIG_NAME, IConfigQuery } from "@owl/server-core";

export default registerAs(QUERY_CONFIG_NAME, (): IConfigQuery => {
    return {
        pagination: {
            default_limit: 10,
        },
    }
})