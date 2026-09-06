export type BuildEvent = { kind: "build" | "release" | "diagnostic"; text: string };

export const developerDocuments: BuildEvent[] = [
  { kind: "build", text: "TypeScript build passes after enabling strict mode." },
  { kind: "release", text: "Release 2026.09 uses a staged cutover and rollback tag." },
  { kind: "diagnostic", text: "RAG quickstart: inspect embedding dimensions before indexing." },
];
