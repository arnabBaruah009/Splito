import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,

} from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { useState } from "react";

type props = {
  isOpen: boolean;
  onClose: () => void;
};

const GROUP_MODAL = ({ isOpen, onClose }: props) => {
  const [selected, setSelected] = useState<string[]>([
    "buenos-aires",
    "sydney",
  ]);
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
                />
              </div>
              <div>
                <p className="mb-2">Add members</p>
                <CheckboxGroup
                  color="warning"
                  value={selected}
                  onValueChange={setSelected}
                >
                  <Checkbox value="buenos-aires">Buenos Aires</Checkbox>
                  <Checkbox value="sydney">Sydney</Checkbox>
                  <Checkbox value="san-francisco">San Francisco</Checkbox>
                </CheckboxGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default GROUP_MODAL;
