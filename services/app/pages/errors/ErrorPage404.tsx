import { ErrorLayout } from "@sections/layout/ErrorLayout.tsx";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";

export const ErrorPage404 = () => {
  return (
    <ErrorLayout title="404 - Page Not Found">
      <Flex direction="col" align="center" gap="md">
        <Title level="h1">404 - Page Not Found</Title>
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
