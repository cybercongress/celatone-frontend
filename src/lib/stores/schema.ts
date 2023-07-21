import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { Dict, Option } from "lib/types";

type JsonSchema = Dict<string, unknown>;

// TODO: this is derived from an example schema, ensure that the properties are comprehensively defined
export enum SchemaProperties {
  CONTRACT_NAME = "contract_name",
  CONTRACT_VERSION = "contract_version",
  IDL_VERSION = "idl_version",
  INSTANTIATE = "instantiate",
  EXECUTE = "execute",
  QUERY = "query",
  MIGRATE = "migrate",
  SUDO = "sudo",
  RESPONSES = "responses",
}

export class SchemaStore {
  /**
   * @remarks code hash as key and json schema as value (annotated as Dict<string, unknown>>)
   * e.g.
   * {
   *   "ad5b2af9a177ffc": {
   *        "contract_name": ...,
   *        "instantiate": { ... },
   *        ...
   *      }
   * }
   */
  jsonSchemas: Dict<string, JsonSchema>;

  constructor() {
    this.jsonSchemas = {};

    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "SchemaStore",
      properties: ["jsonSchemas"],
    });
  }

  saveNewSchema(codeHash: string, schema: JsonSchema) {
    this.jsonSchemas[codeHash] = schema;
  }

  getSchemaByCodeHash(codeHash: string): Option<JsonSchema> {
    return this.jsonSchemas[codeHash];
  }

  getSchemaProperty(codeHash: string, property: SchemaProperties) {
    return this.jsonSchemas[codeHash]?.[property];
  }
}
