import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import {
  addDoc,
  collection,
  writeBatch,
  doc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useUser } from "../../hooks/useUser";
import { GroupInfo } from "../../types";

type GroupModalprops = {
  isOpen: boolean;
  onClose: () => void;
};

type SplitInfo = {
  [email: string]: number;
};

const EXPENSE_MODAL = ({ isOpen, onClose }: GroupModalprops) => {
  const { user } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [expenseDesp, setExpenseDesp] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>();
  const [splitInfo, setSplitInfo] = useState<SplitInfo>({});
  const [remainingAmount, setRemainingAmount] = useState<number>();
  const handleTabs = (key: string) => {
    switch (key) {
      case "equally":
        setSelected([...(user?.friends || []), user?.email || ""]);
        break;

      case "unequally":
        setSelected([]);
        break;
    }
  };

  const handleSplitUnequally = (email: string, amount: number) => {
    setSplitInfo((prev) => {
      return {
        ...prev,
        [email]: amount,
      };
    });
  };

  useEffect(() => {
    setRemainingAmount((prev) => {
      const total = Object.keys(splitInfo).reduce((acc, key) => {
        return acc + splitInfo[key];
      }, 0);
      return (totalAmount || 0) - total;
    });
  }, [splitInfo]);

  const createExpense = () => {
    console.log(splitInfo);
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
                <input
                  type="number"
                  className=" border-b border-gray-300 outline-0 text-gray-900 text-sm block w-full py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter total amount"
                  required
                  value={totalAmount}
                  onChange={(e) => {
                    setTotalAmount(parseInt(e.target.value));
                    setRemainingAmount(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="px-auto">
                <Tabs
                  aria-label="Options"
                  color="success"
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
                        <CheckboxGroup color="success" isDisabled>
                          {user?.friends.map((item) => (
                            <Checkbox key={item} value={item}>
                              {item}
                            </Checkbox>
                          ))}
                          {
                            <Checkbox key={user?.email} value={user?.email}>
                              {user?.email}
                            </Checkbox>
                          }
                        </CheckboxGroup>
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="unequally" title="Unequally">
                    <Card>
                      <CardBody>
                        <p className="text-xl text-center text-teal-400 border-1 w-max mx-auto mb-6 px-6 rounded-full border-teal-500">
                          {remainingAmount || 0}
                        </p>
                        <CheckboxGroup
                          color="success"
                          value={selected}
                          onValueChange={setSelected}
                        >
                          {user?.friends.map((item) => {
                            return (
                              <>
                                <div className="flex justify-between">
                                  <Checkbox key={item} value={item}>
                                    {item}
                                  </Checkbox>
                                  {selected.includes(item || "") && (
                                    <input
                                      type="text"
                                      className=" border-b border-gray-300 outline-0 text-gray-900 text-sm block w-[65px] py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                      placeholder="&#8377; 0.00"
                                      required
                                      value={splitInfo[item] || ""}
                                      onChange={(e) =>
                                        handleSplitUnequally(
                                          item,
                                          Number(e.target.value)
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </>
                            );
                          })}
                          {
                            <>
                              <div className="flex justify-between">
                                <Checkbox key={user?.email} value={user?.email}>
                                  {user?.email}
                                </Checkbox>
                                {selected.includes(user?.email || "") && (
                                  <input
                                    type="text"
                                    id="company"
                                    className=" border-b border-gray-300 outline-0 text-gray-900 text-sm block w-[65px] py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="&#8377; 0.00"
                                    required
                                    value={splitInfo[user?.email || ""] || ""}
                                    onChange={(e) =>
                                      handleSplitUnequally(
                                        user?.email || "",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                )}
                              </div>
                            </>
                          }
                        </CheckboxGroup>
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="percentages" title="By percentages">
                    <Card>
                      <CardBody>
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </div>
              <div>
                <p className="mb-2">Add members</p>
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
