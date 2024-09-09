import { useUser } from "../../hooks/useUser";

const TotalSummary = () => {
  const { user } = useUser();
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <p>Total summary</p>
      <div className="grid grid-cols-3 mt-4">
        <div className="w-full border-r-1">
          <div className="w-max">
            <p>Total amount you owe</p>
            <p>&#8377; {user?.totalBorrowed || 0}</p>
          </div>
        </div>
        <div className="w-full border-r-1">
          <div className="w-max mx-auto">
            <p>Total amount owe to you</p>
            <p>&#8377; {user?.totalLent || 0}</p>
          </div>
        </div>
        <div className="w-full">
          <div className="w-max mx-auto">
            <p>Total outstanding balance</p>
            <p>&#8377; {((user?.totalBorrowed || 0) - (user?.totalLent || 0))}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalSummary;
