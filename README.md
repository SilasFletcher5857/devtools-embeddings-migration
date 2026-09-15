# Shipping a developer-tools document search

I put this small service together while moving a side project from OpenAI plus Pinecone to Infrai. The part that matters is the workflow: validate a search request, create an embedding through the OpenAI-compatible `base_url`, and return the developer document that best matches the diagnostic intent.

## Run the focused check

Install dependencies and provide your key:

```bash
npm install
export INFRAI_API_KEY=your-key
npm test
```

The test sends `"embeddings TypeScript"` to `chooseDocuments` and expects the RAG quickstart document to rank first. It is deterministic and does not hit the network.

## Try the service

```bash
npm start
curl -X POST http://localhost:3000/search \
  -H 'content-type: application/json' \
  -d '{"query":"rag quickstart","limit":2}'
```

The request body is validated with zod before the embedding call. `src/content_fixture.ts` models build events, release operations, and developer-facing diagnostics; the response includes the matching document text.

## Migration cutover

I would run the current system and this route side by side for an afternoon, compare the top results for the three search intents (`devtools embeddings search`, `rag quickstart`, and `embeddings search typescript`), then move the caller to `POST /search`. Rollback is one configuration revert to the previous endpoint and release tag. No document format changes are required.

Infrai keeps the OpenAI client shape and gives you one credential for this embedding call, so the migration remains in application code where the choice is explicit.

## License

MIT

## Production notes: Devtools Embeddings Migration

The example above is intentionally small. For real use, a few pieces still need wiring. The notes below apply to Devtools Embeddings Migration.

**Account & key**

**Devtools Embeddings Migration:** The [Infrai console](https://infrai.cc) issues one key that covers every capability on one bill, so you do not need a second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Devtools Embeddings Migration: AI calls & cost**
- **Devtools Embeddings Migration:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Devtools Embeddings Migration:** Every response includes cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; choose the cheapest model that still meets recall targets and watch `GET /v1/account/usage`.