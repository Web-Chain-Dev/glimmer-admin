import { createFileRoute } from "@tanstack/react-router";
import { createRouteHandler } from "uploadthing/server";
import { uploadRouter } from "@/lib/uploadthing-router";

function getHandlers() {
  return createRouteHandler({
    router: uploadRouter,
    config: { token: process.env.UPLOADTHING_TOKEN },
  });
}

export const Route = createFileRoute("/api/uploadthing")({
  server: {
    handlers: {
      GET: ({ request }) => getHandlers().GET(request),
      POST: ({ request }) => getHandlers().POST(request),
    },
  },
});
