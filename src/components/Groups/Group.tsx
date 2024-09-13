import { Chip } from "@nextui-org/react";
import { Link } from "react-router-dom";
import Activity from "./Activity";
import { GroupInfo } from "../../types";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useUser } from "../../hooks/useUser";

const Group = ({ id }: { id: string }) => {
  const { user } = useUser();
  const [overallAmt, setoverallAmt] = useState<number>(0);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({
    groupName: "",
    createdBy: "",
    summary: {},
    groupSpending: 0,
    members: [],
    totalSpent: 0,
    activities: [],
  });
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "groups", id), (group) => {
      group.exists() && setGroupInfo(group.data() as GroupInfo);
      setoverallAmt(
        (groupInfo.summary?.[user?.email || ""]?.totalPaid || 0) -
          (groupInfo.summary?.[user?.email || ""]?.totalShare || 0)
      );
    });

    return unsub;
  }, []);

  return (
    <div className="w-full rounded-lg shadow-xl bg-white p-8">
      <div className="flex justify-between">
        <div className="flex items-center">
          <p className="mx-4">{groupInfo.groupName}</p>
        </div>
        <div className="text-left">
          {overallAmt === 0 ? (
            <p className="text-green-500">All settled!!</p>
          ) : overallAmt < 0 ? (
            <p className="text-red-500">You owe</p>
          ) : (
            <p className="text-green-500">You are owed</p>
          )}
          <Chip
            color={overallAmt < 0 ? "danger" : "success"}
            variant="bordered"
          >
            &#8377; {overallAmt}
          </Chip>
        </div>
      </div>
      <div>
        <Activity activities={groupInfo.activities?.slice(0, 2)} />
      </div>
      <div className="text-left pl-4 max-w-max">
        <Link
          to={`/user/groups/${id}`}
          className="text-slate-500 hover:text-slate-400 cursor-pointe"
        >
          View all
        </Link>
      </div>
    </div>
  );
};

export default Group;
