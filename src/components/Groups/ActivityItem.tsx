import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useUser } from "../../hooks/useUser";
import { ActivityInfo, ExpenseInfo } from "../../types";

const ActivityItem = ({ id, end }: { id: string; end: boolean }) => {
  const { user } = useUser();
  const [activityInfo, setActivityInfo] = useState<ActivityInfo>({
    id: "",
    paidByEmail: "",
    paidByName: "",
    amount: 0,
    type: "borrowed",
    date: "",
    borrowed: 0,
    lent: 0,
  });
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "expenses", id), (expense) => {
      if (expense.exists()) {
        const data: ExpenseInfo = expense.data() as ExpenseInfo;
        setActivityInfo({
          id: id,
          paidByEmail: data.paidByEmail,
          paidByName: data.paidByName,
          amount: data.amount,
          type: !Object.keys(data.split).includes(user?.email as string)
            ? "uninvolved"
            : user?.email !== data.paidByEmail
            ? "borrowed"
            : "lent",
          date: "",
          borrowed: data.split[user?.email as string].totalShare,
          lent: data.split[user?.email as string].totalShare,
        });
      }
    });

    return unsub;
  }, []);

  return (
    <li>
      <div className="relative pb-8">
        {!end && (
          <span
            className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-red-700"
            aria-hidden="true"
          ></span>
        )}
        <div className="relative flex space-x-3">
          <div>
            <span
              className={`h-8 w-8 rounded-full ${
                activityInfo.type === "borrowed"
                  ? "bg-red-400"
                  : activityInfo.type === "uninvolved"
                  ? "bg-cyan-200"
                  : "bg-green-400"
              } flex items-center justify-center`}
            >
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
            <div>
              <p className="text-sm text-gray-500">
                {activityInfo.paidByName} paid {activityInfo.amount}
                {", "}
                <a
                  href="#"
                  className={`font-medium ${
                    activityInfo.type === "borrowed"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  You {activityInfo.type} 50
                </a>
              </p>
            </div>
            <div className="whitespace-nowrap text-right text-sm text-gray-500">
              <time dateTime="2020-09-20">Sep 20</time>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ActivityItem;
