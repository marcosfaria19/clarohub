// components/StatusDropdown.jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import { Badge } from "modules/shared/components/ui/badge";
import statusConfig from "modules/clarospark/utils/statusConfig";

export default function StatusChanger({ currentStatus, onChange, disabled }) {
  const { color } = statusConfig[currentStatus] || {};
  const statusOptions = Object.keys(statusConfig).filter(
    (status) => status !== currentStatus,
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger disabled={disabled}>
        <Badge variant="outline" className={`${color} min-w-24 border-0`}>
          {currentStatus}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statusOptions.map((status) => (
          <DropdownMenuItem key={status} onClick={() => onChange(status)}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
