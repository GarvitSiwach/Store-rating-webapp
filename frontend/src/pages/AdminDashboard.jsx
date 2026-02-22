import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getAllUsers,
  getAllStoresAdmin,
  addUserAdmin,
  addStoreAdmin,
} from "../services/api";

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsData = await getDashboardStats();
      const usersData = await getAllUsers();
      const storesData = await getAllStoresAdmin();

      setStats(statsData);
      setUsers(usersData);
      setStores(storesData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async () => {
    await addUserAdmin(userForm);
    setShowUserModal(false);
    fetchData();
  };

  const handleAddStore = async () => {
    await addStoreAdmin(storeForm);
    setShowStoreModal(false);
    fetchData();
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div>
          <h2>
            Rate<span style={{ color: "#ff7a00" }}>Wise</span>
          </h2>
          <p style={styles.welcome}>
            Welcome back, {user?.name}
          </p>
        </div>

        <div style={styles.navRight}>
          <button
            style={styles.secondaryBtn}
            onClick={() => setShowUserModal(true)}
          >
            Add User
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => setShowStoreModal(true)}
          >
            Add Store
          </button>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Total Stores" value={stats.totalStores} />
        <StatCard title="Total Ratings" value={stats.totalRatings} />
      </div>

      {/* USERS SECTION */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          All Users
        </h2>

        {/* FILTERS */}
        <div style={styles.filterContainer}>
          <input
            type="text"
            placeholder="Search by Name, Email or Address"
            style={styles.filterInput}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <select
            style={styles.filterInput}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
          >
            <option value="ALL">All Roles</option>
            <option value="USER">USER</option>
            <option value="STORE_OWNER">
              STORE_OWNER
            </option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          {users
            .filter((u) => {
              const matchesSearch =
                u.name
                  .toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  ) ||
                u.email
                  .toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  ) ||
                u.address
                  ?.toLowerCase()
                  .includes(
                    searchTerm.toLowerCase()
                  );

              const matchesRole =
                roleFilter === "ALL" ||
                u.role === roleFilter;

              return matchesSearch && matchesRole;
            })
            .map((u) => (
              <div key={u.id} style={styles.card}>
                <div>
                  <h3>{u.name}</h3>
                  <p>{u.email}</p>
                  <p>{u.address}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={styles.roleBadge(u.role)}>
                    {u.role}
                  </div>

                  {u.role ===
                    "STORE_OWNER" && (
                    <p style={styles.ownerRating}>
                      ⭐ {u.average_rating || "0.0"}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* STORES SECTION */}
      <div style={{ marginBottom: "60px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          All Stores
        </h2>

        <div style={{ display: "grid", gap: "20px" }}>
          {stores.map((store) => (
            <div
              key={store.id}
              style={styles.card}
            >
              <div>
                <h3>{store.name}</h3>
                <p>{store.email}</p>
                <p>{store.address}</p>
              </div>

              <div style={{ textAlign: "right" }}>
                <b style={styles.storeRating}>
                  ⭐ {store.average_rating}
                </b>
                <p>
                  {store.total_ratings} Ratings
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USER MODAL */}
      {showUserModal && (
        <Modal
          title="Add New User"
          onClose={() =>
            setShowUserModal(false)
          }
        >
          {["name", "email", "password", "address"].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                style={styles.input}
                onChange={(e) =>
                  setUserForm({
                    ...userForm,
                    [field]:
                      e.target.value,
                  })
                }
              />
            )
          )}

          <select
            style={styles.input}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                role: e.target.value,
              })
            }
          >
            <option value="USER">
              USER
            </option>
            <option value="STORE_OWNER">
              STORE_OWNER
            </option>
            <option value="ADMIN">
              ADMIN
            </option>
          </select>

          <button
            style={styles.primaryBtn}
            onClick={handleAddUser}
          >
            Create
          </button>
        </Modal>
      )}

      {/* STORE MODAL */}
      {showStoreModal && (
        <Modal
          title="Add New Store"
          onClose={() =>
            setShowStoreModal(false)
          }
        >
          {["name", "email", "address"].map(
            (field) => (
              <input
                key={field}
                placeholder={field}
                style={styles.input}
                onChange={(e) =>
                  setStoreForm({
                    ...storeForm,
                    [field]:
                      e.target.value,
                  })
                }
              />
            )
          )}

          <button
            style={styles.primaryBtn}
            onClick={handleAddStore}
          >
            Create
          </button>
        </Modal>
      )}
    </div>
  );
};

/* COMPONENTS */

const StatCard = ({ title, value }) => (
  <div style={styles.statCard}>
    <p>{title}</p>
    <h2 style={{ color: "#ff7a00" }}>
      {value}
    </h2>
  </div>
);

const Modal = ({
  title,
  children,
  onClose,
}) => (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>{title}</h3>
      {children}
      <button
        style={styles.closeBtn}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

/* STYLES */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f6f8",
    padding: "60px",
    fontFamily: "Inter, sans-serif",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "20px 40px",
    borderRadius: "16px",
    marginBottom: "50px",
    border: "1px solid #eee",
  },

  navRight: {
    display: "flex",
    gap: "15px",
  },

  welcome: {
    color: "#777",
    fontSize: "14px",
  },

  logoutBtn: {
    height: "42px",
    padding: "0 22px",
    borderRadius: "25px",
    background: "#ff7a00",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  secondaryBtn: {
    height: "42px",
    padding: "0 22px",
    borderRadius: "25px",
    background: "#fff",
    border: "1px solid #ff7a00",
    color: "#ff7a00",
    cursor: "pointer",
  },

  primaryBtn: {
    height: "42px",
    borderRadius: "25px",
    background: "#ff7a00",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginBottom: "60px",
  },

  statCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "18px",
    border: "1px solid #eee",
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
  },

  storeRating: {
    color: "#ff7a00",
  },

  ownerRating: {
    color: "#ff7a00",
    marginTop: "8px",
  },

  roleBadge: (role) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    background:
      role === "ADMIN"
        ? "#ff7a00"
        : role === "STORE_OWNER"
        ? "#444"
        : "#888",
    color: "#fff",
  }),

  filterContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  filterInput: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minWidth: "220px",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  closeBtn: {
    marginTop: "15px",
    color: "#ff7a00",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default AdminDashboard;