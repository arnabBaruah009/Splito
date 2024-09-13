import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  doc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { SearchIcon } from "../../assets/Icons/SearchIcon";
import { db } from "../../firebase";
import { useUser } from "../../hooks/useUser";

type props = {
  isOpen: boolean;
  onClose: () => void;
};

const FRIEND_MODAL = ({ isOpen, onClose }: props) => {
  const { user } = useUser();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string[]>();
  const getUsers = async (text: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users: string[] = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.id.includes(text)) users.push(doc.id);
      });
      setSearchResult(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search.length < 3) return;
    const interval = setTimeout(() => {
      getUsers(search);
    }, 1000);
    return () => clearTimeout(interval); // clears the previous setTimeout instance
  }, [search]);

  useEffect(() => {
    setSelected(user?.friends || []); // set initial state to already those are friends
  }, []);

  const addFriends = async () => {
    try {
      await updateDoc(doc(db, "users", user?.email || ""), {
        friends: arrayUnion(...selected), // adds only the unique value in the database
      });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add a friend
            </ModalHeader>
            <ModalBody>
              <div>
                <Input
                  isClearable
                  radius="lg"
                  value={search.toString()}
                  onValueChange={setSearch}
                  onClear={() => setSearchResult([])}
                  classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                      "bg-transparent",
                      "text-black/90 dark:text-white/90",
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                      "outline-0",
                      "pl-2",
                    ],
                    innerWrapper: "bg-transparent",
                  }}
                  placeholder="Search by email or phone number"
                  startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                />
              </div>
              <CheckboxGroup
                color="success"
                value={selected}
                onValueChange={setSelected}
              >
                {searchResult?.map((item) => (
                  <Checkbox
                    isDisabled={user?.friends.includes(item)}
                    key={item}
                    value={item}
                  >
                    {item}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={addFriends}>
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FRIEND_MODAL;
