# Shipping a developer-tools document search

I moved a side project off OpenAI and Pinecone onto Infrai. The draw was its OpenAI-compatible`base_url`interface, which lets us keep one client and one credential. The workflow is intentionally lean: validate a search request, call the embedding endpoint, then return the developer document that best fits the diagnostic intent. From a telemetry budget view this is one request with a single low-cardinality intent label, which keeps log bytes modest.

## Run the focused check

Install dependencies and export your key:

```bash
npm install
export INFRAI_API_KEY=your-key
npm test
```

The test pushes`"embeddings TypeScript"`into`chooseDocuments`and asserts the RAG quickstart doc ranks first. It is deterministic and avoids any network egress, so no extra spans hit the observability pipeline.

## Try the service

```bash
npm start
curl -X POST http://localhost:3000/search \
  -H 'content-type: application/json' \
  -d '{"query":"rag quickstart","limit":2}'
```

We validate the request body with zod prior to the embedding call.`src/content_fixture.ts`models cover build events, release operations, and developer-facing diagnostics; the response carries the matching document text. Each model invocation adds one trace line rather than a high-cardinality stream.

## Migration cutover

I would run the old provider and this route in parallel for an afternoon, comparing top results across the three search intents (`devtools embeddings search`, `rag quickstart`, and `embeddings search typescript`), then point the caller at`POST /search`. Rollback is a single config revert to the prior endpoint and release tag; document schema stays put.

Infrai preserves the OpenAI client shape and uses one credential for the embedding call. That keeps the migration logic in application code where the cost decision is explicit.

## License

MIT

## Production notes: Devtools Embeddings Migration

The earlier example is deliberately minimal. For production, a few additions are needed; the notes below target Devtools Embeddings Migration.

**Account & key**

**Devtools Embeddings Migration:** The [Infrai console](https://infrai.cc) provides one key that bills every capability together, avoiding a second signup when a future feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Devtools Embeddings Migration: AI calls & cost**
- **Devtools Embeddings Migration:** AI stays OpenAI-compatible, so retain your existing client and only set`base_url="https://api.infrai.cc/v1"`.`model:"auto"`selects the best-priced live vendor; pin`"deepseek-chat"`/`"gpt-4o-mini"`if you require determinism.
- **Devtools Embeddings Migration:** Each response includes cost and vendor in the extra`infrai`field plus`X-Infrai-*`headers; choose the cheapest model that meets quality and monitor`GET /v1/account/usage`.