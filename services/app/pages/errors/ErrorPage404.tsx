import { ErrorLayout } from "@sections/layout/ErrorLayout.tsx";
import { Text } from "@comp/atoms/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { Flex } from "@comp/wrappers/index.ts";

export const ErrorPage404 = () => {
  return (
    <ErrorLayout title="404 - Page Not Found">
      <Flex direction="col" align="center" gap="md">
        <Text variant="h1">404 - Page Not Found</Text>
        <Text variant="body" alignment="center">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <ButtonLink href="/">
          Return Home
        </ButtonLink>
      </Flex>
    </ErrorLayout>
  );
};
