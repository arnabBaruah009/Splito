import Group from "../components/Groups/Group";

const Groups = () => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <h1 className="mb-4">Groups</h1>
      <div className="grid grid-cols-2 grid-rows-auto gap-6">
        <Group />
        <Group />
        <Group />
      </div>
    </div>
  );
};

export default Groups;
