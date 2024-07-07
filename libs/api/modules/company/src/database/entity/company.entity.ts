import { EntitySchema } from "typeorm"

import { Company } from "../../domain/model/company"

export const CompanyEntity = new EntitySchema<Company>({
    name: "Company",
    tableName: 'company',
    columns: {
        id: {
            type: String,
            generated: 'uuid',
            primary: true,
        },
        name: {
            type: String,
        },
    },
})