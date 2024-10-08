import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
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

const GROUP_MODAL = ({ isOpen, onClose }: GroupModalprops) => {
  const { user } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const batchUpdate = async (id: string) => {
    // Get a new write batch
    const batch = writeBatch(db);

    // Update the group id to each user
    selected.forEach((user) => {
      const sfRef = doc(db, "users", user);
      batch.update(sfRef, { groups: arrayUnion(id) });
    });

    // Commit the batch
    await batch.commit();
  };

  useEffect(() => {});
  const createGroup = async () => {
    const summary = selected.reduce((acc, email) => {
      acc[email.replace(/\./g, "_")] = { totalPaid: 0, totalShare: 0 };
      return acc;
    }, {} as { [email: string]: { totalPaid: number; totalShare: number } });
    try {
      const ref = await addDoc(collection(db, "groups"), {
        groupName: groupName,
        createdBy: user?.email,
        summary: summary,
        groupSpending: 0,
        members: [...selected],
        totalSpent: 0,
        activities: [],
      } as GroupInfo);
      batchUpdate(ref.id);
      await updateDoc(doc(db, "users", user?.email || ""), {
        groups: arrayUnion(ref.id),
      });
      onClose();
    } catch (error) {}
  };

  useEffect(() => {
    setSelected([user?.email || ""]);
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create a group
            </ModalHeader>
            <ModalBody>
              <div>
                <p className="mb-2">Group name</p>
                <input
                  type="text"
                  id="company"
                  className=" border-b border-gray-300 outline-0 text-gray-900 text-sm block w-full py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Type a name"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div>
                <p className="mb-2">Add members</p>
                <CheckboxGroup
                  color="success"
                  value={selected}
                  onValueChange={setSelected}
                >
                  {user?.friends.map((item) => (
                    <Checkbox
                      key={item}
                      value={item}
                      isDisabled={item === user.email}
                    >
                      {item}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={createGroup}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GROUP_MODAL;
