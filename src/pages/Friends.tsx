import { useDisclosure } from "@nextui-org/react";
import FRIEND_MODAL from "../components/Friends/Friends_Modal";

const Friends = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        {" "}
        <h1 className="">Friends</h1>{" "}
        <button
          type="button"
          onClick={onOpen}
          className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-1 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
        >
          + Add Friend
        </button>
      </div>

      <div className="grid grid-cols-2 grid-rows-auto gap-6">
      </div>
      <FRIEND_MODAL isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Friends;
