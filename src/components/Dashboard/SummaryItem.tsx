import { Avatar } from "@nextui-org/react";

type prop = {
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
};

const SummaryItem = ({ color }: prop) => {
  return (
    <div className="grid grid-cols-[auto_auto_auto] place-items-center py-3 pl-0 border-b-1 w-full">
      <Avatar
        size="sm"
        isBordered
        color={color}
        src="https://i.pravatar.cc/150?u=a04258114e29026702d"
      />
      <p className="mx-4">Friend name</p>
      <p className="">&#8377; 250</p>
    </div>
  );
};

export default SummaryItem;
