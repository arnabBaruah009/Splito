import { ActivityInfo } from "../../types";

const ActivityItem = ({
  activity,
  end,
}: {
  activity: ActivityInfo;
  end: boolean;
}) => {
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
                activity.type === "borrowed" ? "bg-red-400" : "bg-green-400"
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
                {activity.userName} paid {activity.amount}
                {", "}
                <a
                  href="#"
                  className={`font-medium ${
                    activity.type === "borrowed"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  You {activity.type} 50
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
