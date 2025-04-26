import { AgentMemory } from "../Agent";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  BufferMemory,
  ConversationSummaryMemory,
  ConversationTokenBufferMemory,
  VectorStoreRetrieverMemory,
  CombinedMemory,
  MotorheadMemory,
} from "langchain/memory";
import { createClient } from "redis";
import { MongoClient, Collection } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RedisVectorStore } from "@langchain/redis";

export type MemoryType =
  | "buffer"
  | "summary"
  | "buffer-window"
  | "vector-store"
  | "combined"
  | "token-buffer"
  | "mongodb"
  | "redis"
  | "motorhead";

interface MemoryConfig {
  type: MemoryType;
  llm?: BaseChatModel;
  memoryKey?: string;
  inputKey?: string;
  outputKey?: string;
  returnMessages?: boolean;
  k?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vectorStore?: any;
  // Database configurations
  mongoUrl?: string;
  mongoCollectionName?: string;
  redisUrl?: string;
  redisPassword?: string;
  // Other configurations
  sessionId?: string;
  maxTokenLimit?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class MemoryFactory {
  static createMemory(config: MemoryConfig): AgentMemory {
    const {
      type,
      llm,
      memoryKey = "chat_history",
      inputKey = "input",
      outputKey = "output",
      returnMessages = true,
      k = 3,
      vectorStore: providedVectorStore,
      // Database configurations
      mongoUrl,
      mongoCollectionName = "chat_history",
      redisUrl,
      redisPassword,
      // Other configurations
      sessionId = "default-session",
      maxTokenLimit = 2000,
    } = config;

    switch (type) {
      case "buffer":
        return new BufferMemory({
          memoryKey,
          inputKey,
          outputKey,
          returnMessages,
        });

      case "summary":
        if (!llm) throw new Error("LLM is required for summary memory");
        return new ConversationSummaryMemory({
          llm,
          memoryKey,
          inputKey,
          outputKey,
          returnMessages,
        });

      case "buffer-window":
        if (!llm) throw new Error("LLM is required for buffer-window memory");
        return new ConversationTokenBufferMemory({
          llm,
          memoryKey,
          inputKey,
          outputKey,
          returnMessages,
          maxTokenLimit: k,
        });

      case "vector-store":
        if (!providedVectorStore) {
          throw new Error("Vector store is required for vector-store memory");
        }
        return new VectorStoreRetrieverMemory({
          vectorStoreRetriever: providedVectorStore.asRetriever(k),
          memoryKey,
          inputKey,
          outputKey,
        });

      case "combined":
        if (!llm) throw new Error("LLM is required for combined memory");
        return new CombinedMemory({
          memories: [
            new BufferMemory({
              memoryKey: "buffer",
              inputKey,
              outputKey,
              returnMessages,
            }),
            new ConversationSummaryMemory({
              llm,
              memoryKey: "summary",
              inputKey,
              outputKey,
              returnMessages,
            }),
          ],
        });

      case "token-buffer":
        if (!llm) throw new Error("LLM is required for token-buffer memory");
        return new ConversationTokenBufferMemory({
          llm,
          memoryKey,
          inputKey,
          outputKey,
          returnMessages,
          maxTokenLimit,
        });

      case "mongodb": {
        if (!mongoUrl)
          throw new Error("MongoDB URL is required for MongoDB memory");
        const mongoClient = new MongoClient(mongoUrl);
        const collection: Collection = mongoClient
          .db()
          .collection(mongoCollectionName);
        const embeddings = new OpenAIEmbeddings();
        const mongoVectorStore = new MongoDBAtlasVectorSearch(embeddings, {
          collection,
        });
        return new VectorStoreRetrieverMemory({
          vectorStoreRetriever: mongoVectorStore.asRetriever(k),
          memoryKey,
          inputKey,
          outputKey,
        });
      }

      case "redis": {
        if (!redisUrl)
          throw new Error("Redis URL is required for Redis memory");
        const redisClient = createClient({
          url: redisUrl,
          password: redisPassword,
        });
        const redisEmbeddings = new OpenAIEmbeddings();
        const redisVectorStore = new RedisVectorStore(redisEmbeddings, {
          redisClient,
          indexName: "chat_history",
        });
        return new VectorStoreRetrieverMemory({
          vectorStoreRetriever: redisVectorStore.asRetriever(k),
          memoryKey,
          inputKey,
          outputKey,
        });
      }

      case "motorhead":
        return new MotorheadMemory({
          sessionId,
          memoryKey,
          inputKey,
          outputKey,
        });

      default:
        throw new Error(`Unsupported memory type: ${type}`);
    }
  }
}
