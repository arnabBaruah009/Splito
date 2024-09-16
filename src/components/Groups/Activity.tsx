import ActivityItem from "./ActivityItem";

const Activity = ({ activities }: { activities: string[] }) => {
  return (
    <div className="p-4 w-full mx-auto flow-root">
      <ul role="list" className="-mb-8">
        {activities?.map((activity, index) => {
          return <ActivityItem key={activity} id={activity} end={index===activities.length-1}/>;
        })}
      </ul>
    </div>
  );
};

export default Activity;
