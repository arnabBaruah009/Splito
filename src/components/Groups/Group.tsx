import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";
import Activity from "./Activity";
import { GroupInfo } from "../../types";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Group = ({ id }: { id: string }) => {
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    groupName: "",
    createdBy: "",
    summary: [],
    groupSpending: 0,
    members: [],
    totalSpent: 0,
    activities: [],
  });
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "groups", id), (group) => {
      group.exists() && setGroupInfo(group.data() as GroupInfo);
    });

    return unsub;
  }, []);
  console.log("Group comp rendered");

  return (
    <div className="w-full rounded-lg shadow-xl bg-white p-8">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Avatar
            size="md"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
          <p className="mx-4">{groupInfo.groupName}</p>
        </div>
        <div className="text-left">
          <p>You are owed</p>
          <p>&#8377; 3583.00</p>
        </div>
      </div>
      <div>
        <Activity activities={groupInfo.activities?.slice(0, 2)} />
      </div>
      <div className="text-left pl-4 max-w-max">
        <Link
          to="/user/friends"
          className="text-slate-500 hover:text-slate-400 cursor-pointe"
        >
          View all
        </Link>
      </div>
    </div>
  );
};

export default Group;
