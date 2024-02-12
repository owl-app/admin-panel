import { registerAs } from "@nestjs/config";
import { QUERY_CONFIG_NAME, IConfigQuery } from "@owl-app/lib-api-bulding-blocks/domain/config";

export default registerAs(QUERY_CONFIG_NAME, (): IConfigQuery => {
    return {
        pagination: {
            default_limit: 10,
        },
    }
})