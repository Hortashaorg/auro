import { ErrorLayout } from "@layouts/ErrorLayout.tsx";
import { Text } from "@comp/content/Text.tsx";
import { ButtonLink } from "@comp/navigation/ButtonLink.tsx";
import { Flex } from "@comp/layout/Flex.tsx";

export const ErrorPage500 = () => {
  return (
    <ErrorLayout title="500 - Server Error">
      <Flex direction="col" align="center" gap={4}>
        <Text variant="header">500 - Server Error</Text>
        <Text variant="paragraph" alignment="center">
          Something went wrong on our end. Please try again later.
        </Text>
        <ButtonLink href="/" variant="primary">
          Return Home
        </ButtonLink>
      </Flex>
    </ErrorLayout>
  );
};
