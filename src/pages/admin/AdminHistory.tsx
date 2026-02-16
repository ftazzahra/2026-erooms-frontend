import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import {
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
  Card,
  Button,
  Badge,
} from "react-bootstrap";
import { FaSearch, FaArrowUp, FaArrowDown, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Booking {
  id: number;
  userId: number;
  userName: string;
  roomId: number;
  roomName: string;
  roomLocation: string;
  roomCapacity: number;
  borrowDate: string;
  returnDate: string;
  status: string;
  purpose: string;
}

const AdminHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Approved" | "Rejected">("All");

  const [sortField, setSortField] = useState<keyof Booking | "none">("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // fetch data
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5006/api/Bookings/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = await res.json();

      // hanya Approved & Rejected
      data = data.filter(
        (b: Booking) => b.status === "Approved" || b.status === "Rejected"
      );

      setBookings(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching booking history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ================= SORT =================
  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // filter
  const filteredBookings = bookings
    .filter(b => (filterStatus === "All" ? true : b.status === filterStatus))
    .filter(
      b =>
        b.userName.toLowerCase().includes(search.toLowerCase()) ||
        b.roomName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "none") return 0;

      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === "borrowDate" || sortField === "returnDate") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // pdf
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("Booking History", 14, 20);

    autoTable(doc, {
      head: [
        [
          "No",
          "User",
          "Room",
          "Location",
          "Capacity",
          "Borrow Date",
          "Return Date",
          "Purpose",
          "Status",
        ],
      ],
      body: filteredBookings.map((b, idx) => [
        idx + 1,
        b.userName,
        b.roomName,
        b.roomLocation,
        b.roomCapacity,
        new Date(b.borrowDate).toLocaleDateString(),
        new Date(b.returnDate).toLocaleDateString(),
        b.purpose,
        b.status,
      ]),
      startY: 30,
    });

    doc.save("booking_history.pdf");
  };

  // ui
  return (
    <DashboardLayout allowedRole="Admin">
      {/* CARD BIRU */}
      <Card
        className="mb-3 p-3"
        style={{
          backgroundColor: "rgba(173,216,230,0.3)",
          border: "none",
          color: "#0b3a82",
        }}
      >
        <Row>
          <Col>
            <h5 className="mb-1">Booking History</h5>
            <em>
              View history of approved and rejected bookings. Use search,
              filter, sorting, or download as PDF.
            </em>
          </Col>
        </Row>
      </Card>

        {/* ===== yllow info card ===== */}
      <Card
        className="mb-3 p-3"
        style={{
          backgroundColor: "rgba(255,255,0,0.2)",
          border: "none",
          color: "#0b3a82",
        }}
      >
        <em>
          Click column headers to sort the table.
        </em>
      </Card>

      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text style={{ color: "blue", borderColor: "blue" }}>
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              placeholder="Search by user or room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderColor: "blue" }}
            />
          </InputGroup>
        </Col>

        <Col md={3}>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              borderColor: "blue",
              color: "#0b3a82",
              fontWeight: "bold",
            }}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </Col>

        <Col className="d-flex justify-content-end">
          <Button variant="danger" onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </Button>
        </Col>
      </Row>

      {/* TABLE */}
      <div className="table-responsive shadow rounded overflow-hidden">
        <Table striped bordered hover>
          <thead className="bg-primary text-white">
            <tr>
              {[
                "id",
                "userName",
                "roomName",
                "roomLocation",
                "roomCapacity",
                "borrowDate",
                "returnDate",
                "purpose",
                "status",
              ].map((col, idx) => (
                <th
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort(col as keyof Booking)}
                >
                  {col === "id"
                    ? "No"
                    : col === "userName"
                    ? "User"
                    : col === "roomName"
                    ? "Room"
                    : col === "roomLocation"
                    ? "Location"
                    : col === "roomCapacity"
                    ? "Capacity"
                    : col === "borrowDate"
                    ? "Borrow Date"
                    : col === "returnDate"
                    ? "Return Date"
                    : col === "status"
                    ? "Status"
                    : "Purpose"}{" "}
                 {sortField === col ? (
                    sortOrder === "asc" ? (
                        <FaArrowUp size={12} style={{ marginLeft: 4, opacity: 0.8 }} />
                    ) : (
                        <FaArrowDown size={12} style={{ marginLeft: 4, opacity: 0.8 }} />
                    )
                    ) : null}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center">
                  No history found
                </td>
              </tr>
            ) : (
              filteredBookings.map((b, idx) => (
                <tr key={b.id}>
                  <td>{idx + 1}</td>
                  <td>{b.userName}</td>
                  <td>{b.roomName}</td>
                  <td>{b.roomLocation}</td>
                  <td>{b.roomCapacity}</td>
                  <td>
                    {new Date(b.borrowDate).toLocaleDateString()}
                  </td>
                  <td>
                    {new Date(b.returnDate).toLocaleDateString()}
                  </td>
                  <td>{b.purpose}</td>
                  <td>
                    <Badge
                      bg={b.status === "Approved" ? "success" : "danger"}
                    >
                      {b.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default AdminHistory;
