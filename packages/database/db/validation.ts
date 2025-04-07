export type ActionLogType = {
  resource: {
    type: "reward" | "cost";
    resourceId: string;
    amount: number;
  }[];
};
