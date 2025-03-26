import type { JSX } from "@kalena/framework";
import { Text } from "@comp/content/Text.tsx";
import { ServerName } from "./ServerName.tsx";

type Props = JSX.IntrinsicElements["div"] & {
  userServers: Array<{
    server: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      name: string | null;
    };
  }>;
  defaultNickname: string;
};

export const ServerNamesList = ({
  userServers,
  defaultNickname,
  ...props
}: Props) => {
  if (userServers.length === 0) {
    return (
      <div
        {...props}
      >
        <Text variant="body" className="text-sm">
          You haven't joined any servers yet. When you join a server, you'll be
          able to customize your display name here.
        </Text>
      </div>
    );
  }

  return (
    <div
      className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden"
      {...props}
    >
      {userServers.map((serverData) => (
        <ServerName
          key={serverData.server.id}
          id={`server-name-${serverData.server.id}`}
          serverData={serverData}
          defaultNickname={defaultNickname}
        />
      ))}
    </div>
  );
};
