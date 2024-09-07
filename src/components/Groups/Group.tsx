import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";
import Activity from "./Activity";
import { ActivityInfo } from "../../types";

type GroupInfo = {
  name: string;
  activities: ActivityInfo[];
};

const Group = () => {
  const groupInfo: GroupInfo = {
    name: "Group name",
    activities: [
      {
        id: "1",
        userName: "User1",
        amount: 100,
        type: "borrowed",
        date: "2020-09-20",
        borrowed: 50,
      },
      {
        id: "2",
        userName: "User2",
        amount: 300,
        type: "lent",
        date: "2020-10-04",
        lent: 150,
      },
    ],
  };
  return (
    <div className="w-full rounded-lg shadow-xl bg-white p-8">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Avatar
            size="md"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
          <p className="mx-4">{groupInfo.name}</p>
        </div>
        <div className="text-left">
          <p>You are owed</p>
          <p>&#8377; 3583.00</p>
        </div>
      </div>
      <div>
        <Activity activities={groupInfo.activities.slice(0, 2)} />
      </div>
      <div className="text-left pl-4 max-w-max">
        <Link
          to="/friends"
          className="text-slate-500 hover:text-slate-400 cursor-pointe"
        >
          View all
        </Link>
      </div>
    </div>
  );
};

export default Group;
