import { ErrorLayout } from "@sections/layout/ErrorLayout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { Flex } from "@comp/layout/Flex.tsx";

export const ErrorPage404 = () => {
  return (
    <ErrorLayout title="404 - Page Not Found">
      <Flex direction="col" align="center" gap="md">
        <Text variant="h1">404 - Page Not Found</Text>
        <Text variant="body" alignment="center">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <ButtonLink href="/" variant="primary">
          Return Home
        </ButtonLink>
      </Flex>
    </ErrorLayout>
  );
};
