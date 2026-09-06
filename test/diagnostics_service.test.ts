import assert from "node:assert/strict";
import { chooseDocuments } from "../src/embedding_search.js";

const docs = [
  { text: "RAG quickstart for embeddings search in TypeScript" },
  { text: "Release rollback checklist" },
];

const result = chooseDocuments("embeddings TypeScript", docs, 1);
assert.deepEqual(result, ["RAG quickstart for embeddings search in TypeScript"]);
console.log("search decision test passed");
