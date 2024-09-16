import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  User,
} from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import {
  addDoc,
  collection,
  writeBatch,
  doc,
  arrayUnion,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../../firebase";
import { useUser } from "../../hooks/useUser";
import { ExpenseInfo, GroupInfo } from "../../types";

type GroupModalprops = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  groupInfo: GroupInfo;
};

type SplitInfo = {
  unequally: {
    [email: string]: number;
  };
  percentage: {
    [email: string]: number;
  };
};

const EXPENSE_MODAL = ({ isOpen, onClose, id, groupInfo }: GroupModalprops) => {
  const { user } = useUser();
  const [tab, setTab] = useState<string>("equally");
  const [expenseDesp, setExpenseDesp] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>();
  const [splitInfo, setSplitInfo] = useState<SplitInfo>({
    unequally: {},
    percentage: {},
  });
  const [remainingAmount, setRemainingAmount] = useState<number>();
  const [remainingPercent, setRemainingPercent] = useState<number>();

  // Tab change trigger
  const handleTabs = (key: string) => {
    setTab(key);
    switch (key) {
      case "equally":
        break;

      case "unequally":
        setRemainingAmount(totalAmount);
        break;

      case "percentages":
        setRemainingPercent(100);
        break;
    }
  };

  // To split expense unequally
  const handleSplitUnequally = (email: string, amount: number) => {
    setSplitInfo((prev) => ({
      unequally: {
        ...prev.unequally,
        [email]: amount,
      },
      percentage: {},
    }));
  };

  // To split expense by percentage
  const handleSplitPercentage = (email: string, amount: number) => {
    setSplitInfo((prev) => ({
      unequally: {},
      percentage: {
        ...prev.percentage,
        [email]: amount,
      },
    }));
  };

  // Update balance
  useEffect(() => {
    setRemainingAmount((prev) => {
      const total = Object.keys(splitInfo.unequally).reduce((acc, key) => {
        return acc + (splitInfo.unequally[key] || 0);
      }, 0);
      return (totalAmount || 0) - total;
    });
    setRemainingPercent((prev) => {
      const total = Object.keys(splitInfo.percentage).reduce((acc, key) => {
        return acc + (splitInfo.percentage[key] || 0);
      }, 0);
      return 100 - total;
    });
  }, [splitInfo, totalAmount]);

  // Add expense to database
  const createExpense = () => {
    if (!totalAmount || totalAmount === 0) {
      toast.error("Please enter amount!!");
      return;
    }
    const expenseInfo: ExpenseInfo = {
      desc: expenseDesp,
      paidBy: user?.email || "",
      amount: totalAmount || 0,
      groupID: id,
      split: {},
      timestamp: serverTimestamp() as Timestamp,
    };
    switch (tab) {
      case "equally":
        addEqually(expenseInfo);
        break;

      case "unequally":
        if (remainingAmount != 0) {
          toast.error("Total doesn't add up!!");
          return;
        }
        addUnequally(expenseInfo);
        break;

      case "percentages":
        if (remainingPercent != 0) {
          toast.error("Error in splitting!!");
          return;
        }
        addPercentage(expenseInfo);
        break;
    }
    setExpenseDesp("");
    setTotalAmount(undefined);
    setSplitInfo({
      unequally: {},
      percentage: {},
    });
  };

  const addEqually = async (expenseInfo: ExpenseInfo) => {
    try {
      const groupRef = doc(db, "groups", id);
      const amount = (totalAmount || 0) / groupInfo.members.length;

      // Add to the group spending
      await updateDoc(groupRef, {
        groupSpending: increment(totalAmount || 0),
      });

      // Add to total share of each concerned user
      // Create an object to hold the updates for Firestore
      let updates: { [key: string]: any } = {};

      // Loop over each email in the unequally object
      groupInfo.members.forEach((email) => {
        const summaryField = `summary.${email.replace(/\./g, "_")}.totalShare`; // Construct the field path dynamically

        // Use computed property names to update the correct field
        updates[summaryField] = increment(amount);
      });
      // Perform the update
      await updateDoc(groupRef, updates);

      // Add to total paid of person who paid
      const summaryField = `summary.${user?.email.replace(
        /\./g,
        "_"
      )}.totalPaid`;
      await updateDoc(groupRef, {
        [summaryField]: increment(totalAmount as number),
      });

      // Update total lent in the user doc of the person who paid
      await updateDoc(doc(db, "users", user?.email as string), {
        totalLent: increment(amount * (user?.friends.length as number)),
      });

      // Update the expense id in the user doc and group doc
      groupInfo.members.forEach((email) => {
        expenseInfo.split[email] = {
          totalPaid: email === user?.email ? (totalAmount as number) : 0,
          totalShare: amount,
        };
      });
      const expenseInfoID = await addDoc(
        collection(db, "expenses"),
        expenseInfo
      );

      await updateDoc(groupRef, {
        activities: arrayUnion(expenseInfoID.id),
      });
      // Get a new write batch
      const batch = writeBatch(db);

      // Update the group id to each user
      groupInfo.members.forEach((email) => {
        const sfRef = doc(db, "users", email);
        batch.update(sfRef, { expenses: arrayUnion(expenseInfoID.id) });
      });

      // Commit the batch
      await batch.commit();
      toast.success("Expense added!!");
      onClose();
    } catch (error) {
      toast.error("Failed to add expense!!");
      console.error(error);
    }
  };

  const addUnequally = async (expenseInfo: ExpenseInfo) => {
    try {
      const groupRef = doc(db, "groups", id);

      // Add to the group spending
      await updateDoc(groupRef, {
        groupSpending: increment(totalAmount || 0),
      });

      // Add to total share of each concerned user
      // Create an object to hold the updates for Firestore
      let updates: { [key: string]: any } = {};

      // Loop over each email in the unequally object
      Object.keys(splitInfo.unequally).forEach((email) => {
        const summaryField = `summary.${email.replace(/\./g, "_")}.totalShare`; // Construct the field path dynamically

        // Use computed property names to update the correct field
        updates[summaryField] = increment(splitInfo.unequally[email] || 0);
      });
      // Perform the update
      await updateDoc(groupRef, updates);

      // Add to total paid of person who paid
      const summaryField = `summary.${user?.email.replace(
        /\./g,
        "_"
      )}.totalPaid`;
      await updateDoc(groupRef, {
        [summaryField]: increment(totalAmount || 0),
      });

      // Update total lent in the user doc of the person who paid
      await updateDoc(doc(db, "users", user?.email as string), {
        totalLent: increment(
          (totalAmount as number) -
            (splitInfo.unequally[user?.email || ""] || 0)
        ),
      });

      // Update the expense id in the user doc and group doc
      groupInfo.members.forEach((email) => {
        expenseInfo.split[email] = {
          totalPaid: email === user?.email ? (totalAmount as number) : 0,
          totalShare: splitInfo.unequally[email],
        };
      });
      const expenseInfoID = await addDoc(
        collection(db, "expenses"),
        expenseInfo
      );

      await updateDoc(groupRef, {
        activities: arrayUnion(expenseInfoID.id),
      });
      // Get a new write batch
      const batch = writeBatch(db);

      // Update the group id to each user
      groupInfo.members.forEach((email) => {
        const sfRef = doc(db, "users", email);
        batch.update(sfRef, { expenses: arrayUnion(expenseInfoID.id) });
      });

      // Commit the batch
      await batch.commit();
      toast.success("Expense added!!");
      onClose();
    } catch (error) {
      toast.error("Failed to add expense!!");
      console.error(error);
    }
  };

  const addPercentage = async (expenseInfo: ExpenseInfo) => {
    try {
      const groupRef = doc(db, "groups", id);

      // Add to the group spending
      await updateDoc(groupRef, {
        groupSpending: increment(totalAmount || 0),
      });

      // Add to total share of each concerned user
      // Create an object to hold the updates for Firestore
      let updates: { [key: string]: any } = {};

      // Loop over each email in the unequally object
      Object.keys(splitInfo.percentage).forEach((email) => {
        const summaryField = `summary.${email.replace(/\./g, "_")}.totalShare`; // Construct the field path dynamically

        // Use computed property names to update the correct field
        updates[summaryField] = increment(
          (splitInfo.percentage[email] * (totalAmount as number)) / 100
        );
      });
      // Perform the update
      await updateDoc(groupRef, updates);

      // Add to total paid of person who paid
      const summaryField = `summary.${user?.email.replace(
        /\./g,
        "_"
      )}.totalPaid`;
      await updateDoc(groupRef, {
        [summaryField]: increment(totalAmount as number),
      });

      // Update total lent in the user doc of the person who paid
      await updateDoc(doc(db, "users", user?.email as string), {
        totalLent: increment(
          (totalAmount as number) -
            ((splitInfo.percentage[user?.email || ""] *
              (totalAmount as number)) /
              100 || 0)
        ),
      });

      // Update the expense id in the user doc and group doc
      groupInfo.members.forEach((email) => {
        expenseInfo.split[email] = {
          totalPaid: email === user?.email ? (totalAmount as number) : 0,
          totalShare:
            (splitInfo.percentage[email] * (totalAmount as number)) / 100,
        };
      });
      const expenseInfoID = await addDoc(
        collection(db, "expenses"),
        expenseInfo
      );

      await updateDoc(groupRef, {
        activities: arrayUnion(expenseInfoID.id),
      });
      // Get a new write batch
      const batch = writeBatch(db);

      // Update the group id to each user
      groupInfo.members.forEach((email) => {
        const sfRef = doc(db, "users", email);
        batch.update(sfRef, { expenses: arrayUnion(expenseInfoID.id) });
      });

      // Commit the batch
      await batch.commit();
      toast.success("Expense added!!");
      onClose();
    } catch (error) {
      toast.error("Failed to add expense!!");
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add Expense
            </ModalHeader>
            <ModalBody>
              <div>
                <p className="mb-2">Description</p>
                <input
                  type="text"
                  className=" border-b border-gray-300 outline-0 text-gray-900 text-sm block w-full py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter a description"
                  required
                  value={expenseDesp}
                  onChange={(e) => setExpenseDesp(e.target.value)}
                />
              </div>
              <div>
                <p className="mb-2">Amount</p>
                <Input
                  type="number"
                  placeholder="Enter total amount"
                  value={`${totalAmount}`}
                  onValueChange={(value) => {
                    setTotalAmount(parseInt(value));
                  }}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">
                        &#8377;
                      </span>
                    </div>
                  }
                />
              </div>
              <div className="px-auto">
                <Tabs
                  aria-label="Options"
                  color="success"
                  selectedKey={tab}
                  onSelectionChange={(key) => handleTabs(key as string)}
                  classNames={{
                    base: "flex",
                    tabList: "mx-auto",
                    tab: "text-sm",
                  }}
                >
                  <Tab key="equally" title="Equally">
                    <Card>
                      <CardBody>
                        {groupInfo.members.map((item) => (
                          <div key={item} className="flex justify-between my-2">
                            <User
                              name="Jane Doe"
                              description={item}
                              avatarProps={{
                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                              }}
                            />
                            <Input
                              isDisabled
                              type="number"
                              placeholder="0.00"
                              classNames={{
                                base: "w-[110px]",
                              }}
                              value={`${(
                                (totalAmount || 0) / groupInfo.members.length
                              ).toFixed(2)}`}
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-default-400 text-small">
                                    &#8377;
                                  </span>
                                </div>
                              }
                            />
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="unequally" title="Unequally">
                    <Card>
                      <CardBody>
                        <p
                          className={`text-xl text-center border-1 w-max mx-auto mb-6 px-6 rounded-full ${
                            (remainingAmount || 0) < 0
                              ? "text-orange-600 border-orange-900"
                              : "text-teal-400 border-teal-500"
                          } `}
                        >
                          &#8377; {Math.abs(remainingAmount || 0)}{" "}
                          <span className="text-sm">
                            {(remainingAmount || 0) < 0 ? "over" : "left"}
                          </span>
                        </p>
                        {groupInfo.members.map((item) => (
                          <div key={item} className="flex justify-between my-2">
                            <User
                              name="Jane Doe"
                              description={item}
                              avatarProps={{
                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="0.00"
                              classNames={{
                                base: "w-[120px]",
                              }}
                              value={`${splitInfo.unequally[item]}`}
                              onValueChange={(value) =>
                                handleSplitUnequally(item, parseInt(value))
                              }
                              startContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-default-400 text-small">
                                    &#8377;
                                  </span>
                                </div>
                              }
                            />
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="percentages" title="By percentages">
                    <Card>
                      <CardBody>
                        <p
                          className={`text-xl text-center border-1 w-max mx-auto mb-6 px-6 rounded-full ${
                            (remainingPercent || 0) < 0
                              ? "text-orange-600 border-orange-900"
                              : "text-teal-400 border-teal-500"
                          } `}
                        >
                          {Math.abs(remainingPercent || 0)}
                          {"% "}
                          <span className="text-sm">
                            {(remainingPercent || 0) < 0 ? "over" : "left"}
                          </span>
                        </p>
                        {groupInfo.members.map((item) => (
                          <div key={item} className="flex justify-between my-2">
                            <User
                              name="Jane Doe"
                              description={item}
                              avatarProps={{
                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="0.00"
                              classNames={{
                                base: "w-[120px]",
                              }}
                              value={`${splitInfo.percentage[item]}`}
                              onValueChange={(value) =>
                                handleSplitPercentage(item, parseInt(value))
                              }
                              endContent={
                                <div className="pointer-events-none flex items-center">
                                  <span className="text-default-400 text-small">
                                    %
                                  </span>
                                </div>
                              }
                            />
                          </div>
                        ))}
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={createExpense}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EXPENSE_MODAL;
