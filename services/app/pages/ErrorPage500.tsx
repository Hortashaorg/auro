import { ErrorLayout } from "@kalena/components/layouts";
import { Text } from "@kalena/components/content";
import { ButtonLink } from "@kalena/components/navigation";
import { Flex } from "@kalena/components/layouts";

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
