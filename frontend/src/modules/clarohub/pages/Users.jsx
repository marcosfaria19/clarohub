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
    <div className="flex min-h-screen flex-col bg-[hsl(220,26%,14%)] text-[hsl(220,65%,98%)]">
      {/* Header */}
      <header className="flex items-center justify-between bg-[hsl(218,23%,23%)] p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidenav}
            className="mr-2 text-[hsl(220,65%,98%)] hover:bg-[hsl(217,19%,27%)] lg:hidden"
          >
            {sidenavOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <h1 className="text-xl font-bold lg:text-2xl">Admin Dashboard</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="User avatar"
                className="rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-[hsl(220,26%,18%)] bg-[hsl(218,23%,23%)] text-[hsl(220,65%,98%)]"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[hsl(220,26%,22%)]" />
            <DropdownMenuItem className="focus:bg-[hsl(217,19%,27%)]">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-[hsl(217,19%,27%)]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-[hsl(217,19%,27%)]">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1">
        {/* Sidenav */}
        <nav
          className={`w-64 bg-[hsl(218,23%,23%)] p-4 transition-all duration-300 ease-in-out ${sidenavOpen ? "translate-x-0" : "-translate-x-full"} fixed z-10 h-full lg:static lg:translate-x-0`}
        >
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-[hsl(220,65%,98%)] hover:bg-[hsl(217,19%,27%)]"
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-[hsl(220,65%,98%)] hover:bg-[hsl(217,19%,27%)]"
              >
                Users
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-[hsl(220,65%,98%)] hover:bg-[hsl(217,19%,27%)]"
              >
                Settings
              </Button>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-x-auto p-4 lg:p-6">
          <div className="mb-6 flex flex-col items-start justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-0">
            <h2 className="text-2xl font-semibold">Users</h2>
            <Button className="bg-[hsl(174,86%,35%)] text-[hsl(220,65%,98%)] hover:bg-[hsl(174,86%,40%)]">
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

      {/* Footer */}
      <footer className="bg-[hsl(218,23%,23%)] p-4 text-center text-sm text-[hsl(220,25%,70%)]">
        <p>&copy; 2023 Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
