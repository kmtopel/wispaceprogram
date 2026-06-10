"use client";

import { useState, useTransition } from "react";
import { Card, Stack, Heading, Text, Button, Box, Flex } from "@sanity/ui";
import { RefreshIcon } from "@sanity/icons";
import { revalidateShowsAction } from "@/sanity/actions/revalidate-shows";

// Sanity Studio sidebar tool: gives editors a one-click button to bust the
// Bandsintown shows cache. Useful when shows were just published/edited in
// Bandsintown and editors don't want to wait the full ISR window for them
// to appear on the site.
export default function RefreshShowsTool() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  const onClick = () => {
    setResult(null);
    startTransition(async () => {
      try {
        const res = await revalidateShowsAction();
        setResult({
          ok: true,
          message: `Cache cleared at ${new Date(res.revalidatedAt).toLocaleTimeString()}. Refresh the site to see updated shows.`,
        });
      } catch (err) {
        setResult({
          ok: false,
          message: `Failed: ${err?.message || "unknown error"}`,
        });
      }
    });
  };

  return (
    <Box padding={4}>
      <Stack space={5} style={{ maxWidth: 640 }}>
        <Stack space={3}>
          <Heading as="h1" size={3}>
            Refresh Shows
          </Heading>
          <Text size={2} muted>
            Pulls the latest events from Bandsintown immediately, bypassing the
            cache. Use this after adding, editing, or removing a show in
            Bandsintown.
          </Text>
          <Text size={1} muted>
            Without this, new shows appear automatically — usually within an
            hour.
          </Text>
        </Stack>

        <Flex gap={3} align="center">
          <Button
            icon={RefreshIcon}
            text={pending ? "Refreshing…" : "Refresh now"}
            tone="primary"
            disabled={pending}
            onClick={onClick}
          />
        </Flex>

        {result && (
          <Card
            padding={3}
            radius={2}
            tone={result.ok ? "positive" : "critical"}
          >
            <Text size={1}>{result.message}</Text>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
