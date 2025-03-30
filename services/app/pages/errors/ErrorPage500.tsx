import { ErrorLayout } from "@sections/layout/ErrorLayout.tsx";
import { Text, Title } from "@comp/atoms/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { Flex } from "@comp/atoms/layout/index.ts";

export const ErrorPage500 = () => {
  return (
    <ErrorLayout title="500 - Server Error">
      <Flex direction="col" align="center" gap="md">
        <Title level="h1">500 - Server Error</Title>
        <Text variant="body" alignment="center">
          Something went wrong on our end. Please try again later.
        </Text>
        <ButtonLink href="/">
          Return Home
        </ButtonLink>
      </Flex>
    </ErrorLayout>
  );
};
