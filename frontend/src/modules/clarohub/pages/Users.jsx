import { useState } from "react";
import { Button } from "modules/shared/components/ui/button";
import { Input } from "modules/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "modules/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "modules/shared/components/ui/dropdown-menu";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import Container from "modules/shared/components/ui/container";

export default function AdminDashboard() {
  const [sidenavOpen, setSidenavOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");

  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);

  const mockData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor" },
    {
      id: 5,
      name: "Charlie Davis",
      email: "charlie@example.com",
      role: "Viewer",
    },
  ];

  const filteredData = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.email.toLowerCase().includes(filter.toLowerCase()) ||
      item.role.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <Container>
      <div className="flex min-h-screen flex-col text-[hsl(220,65%,98%)]">
        <div className="flex flex-1">
          {/* Main content */}
          <main className="flex-1 overflow-x-auto p-4 lg:p-6">
            <div className="mb-6 flex flex-col items-start justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
              <h2 className="text-2xl font-semibold">Users</h2>
              <Button className="bg-primary text-[hsl(220,65%,98%)] hover:bg-[hsl(174,86%,40%)]">
                <Plus className="mr-2 h-4 w-4" /> Add New User
              </Button>
            </div>

            {/* Filter */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[hsl(220,15%,55%)]" />
                <Input
                  type="text"
                  placeholder="Filter users..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="max-w-sm border-[hsl(220,26%,18%)] bg-[hsl(218,23%,23%)] pl-8 text-[hsl(220,65%,98%)] focus:border-[hsl(174,86%,45%)] focus:ring-[hsl(174,86%,45%)]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-[hsl(220,26%,18%)] bg-[hsl(218,23%,23%)]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-[hsl(218,23%,23%)]">
                    <TableHead className="text-[hsl(220,25%,70%)]">
                      Name
                    </TableHead>
                    <TableHead className="text-[hsl(220,25%,70%)]">
                      Email
                    </TableHead>
                    <TableHead className="text-[hsl(220,25%,70%)]">
                      Role
                    </TableHead>
                    <TableHead className="text-[hsl(220,25%,70%)]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-[hsl(217,19%,27%)]"
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-[hsl(217,19%,27%)]"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="border-[hsl(220,26%,18%)] bg-[hsl(218,23%,23%)] text-[hsl(220,65%,98%)]"
                          >
                            <DropdownMenuItem className="focus:bg-[hsl(217,19%,27%)]">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-[hsl(217,19%,27%)]">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="border-[hsl(220,26%,18%)] bg-[hsl(218,23%,23%)] text-[hsl(220,65%,98%)] hover:bg-[hsl(217,19%,27%)]"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => page + 1)}
                className="border-[hsl(220,26%,18%)] bg-[hsl(218,23%,23%)] text-[hsl(220,65%,98%)] hover:bg-[hsl(217,19%,27%)]"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </Container>
  );
}
