import { ErrorLayout } from "@sections/layout/ErrorLayout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { Flex } from "@comp/layout/Flex.tsx";

export const ErrorPage500 = () => {
  return (
    <ErrorLayout title="500 - Server Error">
      <Flex direction="col" align="center" gap="md">
        <Text variant="h1">500 - Server Error</Text>
        <Text variant="body" alignment="center">
          Something went wrong on our end. Please try again later.
        </Text>
        <ButtonLink href="/" variant="primary">
          Return Home
        </ButtonLink>
      </Flex>
    </ErrorLayout>
  );
};
