import { ErrorLayout } from "@sections/layout/ErrorLayout.tsx";
import { Text } from "@comp/typography/index.ts";
import { ButtonLink } from "@comp/atoms/buttons/index.ts";
import { Flex } from "@comp/wrappers/index.ts";

export const ErrorPage500 = () => {
  return (
    <ErrorLayout title="500 - Server Error">
      <Flex direction="col" align="center" gap="md">
        <Text variant="h1">500 - Server Error</Text>
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
