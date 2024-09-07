import ActivityItem from "./ActivityItem";
import { ActivityInfo } from "../../types";

const Activity = ({ activities }: { activities: ActivityInfo[] }) => {
  return (
    <div className="p-4 w-full mx-auto flow-root">
      <ul role="list" className="-mb-8">
        {activities.map((activity, index) => {
          return <ActivityItem key={activity.id} activity={activity} end={index===activities.length-1}/>;
        })}
      </ul>
    </div>
  );
};

export default Activity;
