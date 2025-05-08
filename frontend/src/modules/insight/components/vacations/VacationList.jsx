import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "modules/shared/components/ui/card";
import { ScrollArea } from "modules/shared/components/ui/scroll-area";
import VacationCard from "./VacationCard";

const VacationList = ({ vacations, onApprove, onReject }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Férias Agendadas</CardTitle>
        <CardDescription>
          {vacations.length} períodos de férias agendados
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] px-4">
          <div className="space-y-4 pb-4 pt-2">
            {vacations.map((vacation) => (
              <VacationCard
                key={vacation.id}
                vacation={vacation}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default VacationList;
