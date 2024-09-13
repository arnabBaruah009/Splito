import { Chip, useDisclosure } from "@nextui-org/react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { useUser } from "../hooks/useUser";
import { GroupInfo, UserInfo } from "../types";
import EXPENSE_MODAL from "../components/Groups/AddExpense_Modal";

type MemberInfo = {
  [email: string]: UserInfo;
};

const Detailed_Group = () => {
  const { user } = useUser();
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overallAmt, setoverallAmt] = useState<number>(0);
  const [memberInfo, setMemberInfo] = useState<MemberInfo>({});
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

  useEffect(() => {
    setoverallAmt(
      (groupInfo.summary[user?.email || ""]?.totalPaid || 0) -
        groupInfo.summary[user?.email || ""]?.totalShare || 0
    );
  }, [groupInfo.summary]);

  useEffect(() => {
    const getMemberInfo = async () => {
      const members = groupInfo.members;
      const memberInfo: MemberInfo = {};
      for (const member of members) {
        const docRef = doc(db, "users", member);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          memberInfo[member] = docSnap.data() as UserInfo;
        }
      }
      setMemberInfo(memberInfo);
    };
    getMemberInfo();
  }, [groupInfo.members]);

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
            &#8377; {Math.abs(overallAmt)}
          </Chip>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
        >
          + Add Expense
        </button>
      </div>
      <div>
        {Object.keys(memberInfo)
          .sort()
          .map((member) => {
            return <p key={member}>{memberInfo[member].displayName}</p>;
          })}
      </div>
      {/* Activities */}
      <div></div>
      <EXPENSE_MODAL isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Detailed_Group;
