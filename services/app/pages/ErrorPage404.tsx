import { ErrorLayout } from "@kalena/components/layouts";
import { Text } from "@kalena/components/content";
import { ButtonLink } from "@kalena/components/navigation";
import { Flex } from "@kalena/components/layouts";

export const ErrorPage404 = () => {
  return (
    <ErrorLayout title="404 - Page Not Found">
      <Flex direction="col" align="center" gap={4}>
        <Text variant="header">404 - Page Not Found</Text>
        <Text variant="paragraph" alignment="center">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <ButtonLink href="/" variant="primary">
          Return Home
        </ButtonLink>
      </Flex>
    </ErrorLayout>
  );
};
