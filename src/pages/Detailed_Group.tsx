import { Chip } from "@nextui-org/react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useUser } from "../hooks/useUser";
import { GroupInfo } from "../types";

const Detailed_Group = () => {
  const { user } = useUser();
  const { id } = useParams();
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
    const unsub = onSnapshot(doc(db, "groups", id as string), (group) => {
      group.exists() && setGroupInfo(group.data() as GroupInfo);
    });

    return unsub;
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto">
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
    </div>
  );
};

export default Detailed_Group;
