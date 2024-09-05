import { Link } from "react-router-dom";

import { SummaryItem } from "./";

const FriendsSummary = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <p>Friends summary</p>
      <div className="grid grid-cols-3 mt-4">
        <div className="w-full border-r-1">
          <div className="w-max">
            <p className="mb-2">Friends you owe</p>
            <SummaryItem color="warning" />
            <SummaryItem color="warning" />
            <SummaryItem color="warning" />
            <div className="text-center py-2">
              <Link
                to="/friends"
                className="text-slate-500 hover:text-slate-400"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full border-r-1">
          <div className="w-max mx-auto">
            <p>Friends owe to you</p>
            <SummaryItem color="success" />
            <SummaryItem color="success" />
            <SummaryItem color="success" />
            <div className="text-center py-2">
              <Link
                to="/friends"
                className="text-slate-500 hover:text-slate-400"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="w-max mx-auto">
            <p>Friends outstanding balance</p>
            <SummaryItem color="success" />
            <SummaryItem color="warning" />
            <SummaryItem color="warning" />
            <div className="text-center py-2">
              <Link
                to="/friends"
                className="text-slate-500 hover:text-slate-400"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsSummary;
