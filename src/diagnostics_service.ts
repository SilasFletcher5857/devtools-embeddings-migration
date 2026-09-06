import { createServer } from "node:http";
import { developerDocuments } from "./content_fixture.js";
import { chooseDocuments, SearchRequest, embedQuery } from "./embedding_search.js";

const server = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/search") {
    response.writeHead(404).end("Not found");
    return;
  }
  let body = "";
  for await (const chunk of request) body += chunk;
  try {
    const input = SearchRequest.parse(JSON.parse(body));
    await embedQuery(input);
    const results = chooseDocuments(input.query, developerDocuments, input.limit);
    response.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ results }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    response.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ error: message }));
  }
});

server.listen(3000, () => console.log("diagnostics search listening on http://localhost:3000"));
