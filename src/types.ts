// Group activity types
interface BaseGroupInfo {
  id: string;
  userName: string;
  amount: number;
  type: "borrowed" | "lent";
  date: string;
}

interface BorrowedActivity extends BaseGroupInfo {
  borrowed: number;
  lent?: never;
}

interface LentActivity extends BaseGroupInfo {
  lent: number;
  borrowed?: never;
}

export type ActivityInfo = BorrowedActivity | LentActivity;
