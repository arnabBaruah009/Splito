import {
  TotalSummary,
  FriendsSummary,
  GroupsSummary,
} from "../components/Dashboard";

const Dashboard = () => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <h1 className="mb-4">Dashboard</h1>
      <div className="grid grid-rows-[auto_auto_auto] gap-6">
        <TotalSummary />
        <FriendsSummary />
        <GroupsSummary />
      </div>
    </div>
  );
};

export default Dashboard;
