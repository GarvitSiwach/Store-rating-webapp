import { useEffect, useState, useContext } from "react";
import { getStores, rateStore } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StoreList = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedRatings, setSelectedRatings] = useState({});
  const [submittingStoreId, setSubmittingStoreId] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("DESC");

  const isLastPage = stores.length < limit;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStores({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        order,
      });

      setStores(
        Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);
      setError("Failed to fetch stores");
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page, debouncedSearch, sortBy, order]);

  const handleSubmitRating = async (storeId) => {
    try {
      const rating = selectedRatings[storeId];
      if (!rating) return;

      setSubmittingStoreId(storeId);
      await rateStore(storeId, rating);
      await fetchStores();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingStoreId(null);
    }
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>
          Rate<span style={{ color: "#ff7a00" }}>Wise</span>
        </h2>

        <div style={styles.navRight}>
          <button
            onClick={() => navigate("/update-password")}
            style={styles.secondaryBtn}
          >
            Update Password
          </button>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.wrapper}>
        {/* SEARCH */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <h3 style={styles.sectionTitle}>RECENTLY VERIFIED</h3>

        {loading && <p style={{ color: "#888" }}>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* GRID */}
        <div style={styles.grid}>
          {stores.map((store) => {
            const avgRating = Number(store?.average_rating || 0);
            const totalRatings = store?.total_ratings || 0;

            return (
              <div key={store?.id} style={styles.card}>
                <div style={{ flex: 1 }}>
                  <h3 style={styles.cardTitle}>
                    {store?.name || "Unnamed Store"}
                  </h3>

                  <p style={styles.address}>
                    {store?.address || "No address available"}
                  </p>

                  <div style={styles.statsRow}>
                    <div>
                      <strong>{avgRating.toFixed(1)}</strong>
                      <p style={styles.metaLabel}>Rating</p>
                    </div>

                    <div>
                      <strong>{totalRatings}</strong>
                      <p style={styles.metaLabel}>Reviews</p>
                    </div>
                  </div>

                  <div style={{ marginTop: "15px" }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span
                        key={num}
                        onClick={() =>
                          setSelectedRatings((prev) => ({
                            ...prev,
                            [store.id]: num,
                          }))
                        }
                        style={{
                          fontSize: "22px",
                          cursor: "pointer",
                          color:
                            selectedRatings[store.id] >= num
                              ? "#ff7a00"
                              : "#ccc",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubmitRating(store.id)}
                    disabled={submittingStoreId === store.id}
                    style={styles.submitBtn}
                  >
                    {submittingStoreId === store.id
                      ? "Saving..."
                      : "Submit Rating"}
                  </button>
                </div>

                <div style={styles.badge}>
                  {avgRating.toFixed(1)}
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        <div style={styles.pagination}>
          <button
            onClick={() =>
              setPage((prev) => Math.max(prev - 1, 1))
            }
          >
            Prev
          </button>

          <span style={{ color: "#888" }}>
            Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLastPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#333",
  },

  navbar: {
    background: "#ffffff",
    padding: "20px 60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },

  navRight: {
    display: "flex",
    gap: "15px",
  },

  logo: {
    fontWeight: 700,
    color: "#333",
  },

  secondaryBtn: {
    padding: "8px 18px",
    borderRadius: "20px",
    border: "1px solid #ff7a00",
    background: "transparent",
    color: "#ff7a00",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "8px 18px",
    borderRadius: "20px",
    border: "none",
    background: "#ff7a00",
    color: "#fff",
    cursor: "pointer",
  },

  wrapper: {
    maxWidth: "1100px",
    margin: "50px auto",
  },

  searchBox: {
    background: "#f5f5f5",
    padding: "18px 25px",
    borderRadius: "16px",
    marginBottom: "40px",
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "transparent",
  },

  sectionTitle: {
    marginBottom: "25px",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "25px",
    position: "relative",
    border: "1px solid #eee",
    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
  },

  cardTitle: {
    marginBottom: "5px",
  },

  address: {
    color: "#777",
    fontSize: "14px",
  },

  statsRow: {
    marginTop: "15px",
    display: "flex",
    gap: "25px",
    fontSize: "14px",
  },

  metaLabel: {
    margin: 0,
    color: "#777",
  },

  submitBtn: {
    marginTop: "15px",
    padding: "8px 20px",
    borderRadius: "25px",
    border: "none",
    background: "#ff7a00",
    color: "#fff",
    cursor: "pointer",
  },

  badge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#ff7a00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    color: "#fff",
  },

  pagination: {
    marginTop: "50px",
    display: "flex",
    justifyContent: "center",
    gap: "25px",
  },
};

export default StoreList;


