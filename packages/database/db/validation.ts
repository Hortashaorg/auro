export type ActionLogType = {
  resource: {
    type: "reward";
    resourceId: string;
    amount: number;
  }[];
};
