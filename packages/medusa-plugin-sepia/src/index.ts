import { ModuleExports } from "@medusajs/modules-sdk";

import EmbeddingService from "./services/embedding";

const service = EmbeddingService;
const loaders = [];

const moduleDefinition: ModuleExports = {
  service,
  loaders,
};

export default moduleDefinition;
