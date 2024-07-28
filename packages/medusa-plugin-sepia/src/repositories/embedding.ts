import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Embedding } from "../models/embedding";

const EmbeddingRepository = dataSource.getRepository(Embedding);

export default EmbeddingRepository;
