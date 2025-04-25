import { Text } from "@comp/atoms/typography/index.ts";
import type { FC } from "@kalena/framework";
import type { InferSelectModel, schema } from "@package/database";
import { selectUserByEmail } from "@queries/selects/user/selectUserByEmail.ts";
import { selectGameById } from "@queries/selects/games/selectGameById.ts";

interface Props {
  gameId: string;
  email: string;
}

const calculateTimeUntilNextAction = (
  actionRecoveryInterval: InferSelectModel<
    typeof schema.game
  >["actionRecoveryInterval"],
) => {
  const current = Temporal.Now.plainDateTimeISO();

  const minutes: Record<typeof actionRecoveryInterval, number> = {
    "5min": 5,
    "15min": 15,
    "30min": 30,
    "1hour": 60,
    "2hour": 120,
    "4hour": 240,
    "8hour": 480,
    "12hour": 720,
    "1day": 1440,
  } as const;

  const minUntilNextAction = minutes[actionRecoveryInterval] -
    current.minute % minutes[actionRecoveryInterval];

  const timeLeft = Temporal.Now.plainDateTimeISO().until(
    Temporal.Now.plainDateTimeISO().add({
      minutes: minUntilNextAction,
    }),
  );

  if (timeLeft.hours > 1) {
    return `${timeLeft.hours} hours`;
  }

  if (timeLeft.hours === 1 && timeLeft.minutes > 0) {
    return `${timeLeft.hours} hour`;
  }

  if (timeLeft.minutes > 1) {
    return `${timeLeft.minutes} minutes`;
  }

  return "less than a minute";
};

export const TimeUntilNextActionText: FC<Props> = async (props) => {
  const { gameId, email } = props;

  const [user, game] = await Promise.all([
    selectUserByEmail(email),
    selectGameById(gameId),
  ]);

  const timeString = calculateTimeUntilNextAction(
    game.actionRecoveryInterval,
  );

  return (
    <div
      id="time-until-next-action"
      hx-get={`/api/games/${game.id}/actions/time-until-next-action`}
      hx-trigger="every 1m"
      hx-swap="outerHTML"
    >
      <Text>
        You have{" "}
        <strong className="dark:text-on-primary-dark text-on-primary">
          {user.availableActions} available actions
        </strong>
      </Text>
      <Text>
        More available actions in:{" "}
        <strong className="dark:text-on-primary-dark text-on-primary">
          {timeString}
        </strong>
      </Text>
    </div>
  );
};
