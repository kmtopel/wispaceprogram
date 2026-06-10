"use client";

import { Card, Stack, Heading, Text, Button, Box } from "@sanity/ui";
import { ChartUpwardIcon, LaunchIcon } from "@sanity/icons";

// "Open Google Analytics" pane in the Studio sidebar — saves editors a
// trip to a bookmark or a separate search every time they want to peek
// at site traffic. Just a launch button; we don't try to embed GA4
// directly because Google sets X-Frame-Options on its dashboard.
export default function AnalyticsLink() {
  return (
    <Box padding={4}>
      <Stack space={5} style={{ maxWidth: 640 }}>
        <Stack space={3}>
          <Heading as="h1" size={3}>
            Analytics
          </Heading>
          <Text size={2} muted>
            View site traffic in Google Analytics — realtime visitors, top
            pages, referrers, and more.
          </Text>
        </Stack>

        <Button
          icon={LaunchIcon}
          text="Open Google Analytics"
          tone="primary"
          as="a"
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        />
      </Stack>
    </Box>
  );
}

// Re-export the icon so structure.js can reference it without adding
// another import.
export { ChartUpwardIcon };
