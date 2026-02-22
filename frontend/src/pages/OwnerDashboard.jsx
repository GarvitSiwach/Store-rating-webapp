import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getOwnerStores, getStoreRatings } from "../services/api";

const OwnerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getOwnerStores();
        setStores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleViewRatings = async (storeId) => {
    try {
      setSelectedStoreId(Number(storeId));
      setRatingsLoading(true);

      const data = await getStoreRatings(storeId);
      setRatings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRatings([]);
    } finally {
      setRatingsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div>
          <h2 style={styles.logo}>
            Rate<span style={{ color: "#ff7a00" }}>Wise</span>
          </h2>
          <p style={styles.welcome}>
            Welcome back, {user?.name}
          </p>
        </div>

        <div style={styles.navRight}>
          <button
            onClick={() => navigate("/update-password")}
            style={styles.secondaryBtn}
          >
            Update Password
          </button>

          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.wrapper}>
        <h2 style={styles.sectionTitle}>Your Stores</h2>

        {loading && <p>Loading...</p>}

        {!loading &&
          stores.map((store) => (
            <div key={store.store_id}>
              <div style={styles.storeCard}>
                <div>
                  <h3 style={{ margin: 0 }}>
                    {store.store_name}
                  </h3>
                  <p style={styles.metaText}>
                    {store.total_ratings || 0} Ratings
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <h2 style={{ color: "#ff7a00", margin: 0 }}>
                    {store.average_rating
                      ? parseFloat(
                          store.average_rating
                        ).toFixed(1)
                      : "0.0"}
                  </h2>

                  <button
                    onClick={() =>
                      handleViewRatings(store.store_id)
                    }
                    style={styles.viewBtn}
                  >
                    View Ratings
                  </button>
                </div>
              </div>

              {/* Ratings Section */}
              {Number(selectedStoreId) ===
                Number(store.store_id) && (
                <div style={styles.ratingsContainer}>
                  <h4>Users Who Rated This Store</h4>

                  {ratingsLoading && <p>Loading...</p>}

                  {!ratingsLoading &&
                    ratings.length === 0 && (
                      <p>No ratings found.</p>
                    )}

                  {!ratingsLoading &&
                    ratings.length > 0 && (
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Rating</th>
                            <th style={styles.th}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ratings.map((r, index) => (
                            <tr key={index}>
                              <td style={styles.td}>
                                {r.name}
                              </td>
                              <td style={styles.td}>
                                {r.email}
                              </td>
                              <td style={styles.td}>
                                ⭐ {r.rating}
                              </td>
                              <td style={styles.td}>
                                {new Date(
                                  r.created_at
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f6f8",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  navbar: {
    background: "#ffffff",
    padding: "20px 60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
  },

  logo: {
    margin: 0,
    fontWeight: 700,
  },

  welcome: {
    color: "#777",
    fontSize: "14px",
    marginTop: "4px",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  secondaryBtn: {
    height: "42px",
    padding: "0 22px",
    borderRadius: "25px",
    border: "1px solid #ff7a00",
    background: "#fff",
    color: "#ff7a00",
    fontWeight: 500,
    cursor: "pointer",
  },

  logoutBtn: {
    height: "42px",
    padding: "0 22px",
    borderRadius: "25px",
    border: "none",
    background: "#ff7a00",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },

  wrapper: {
    maxWidth: "1100px",
    margin: "40px auto",
  },

  sectionTitle: {
    marginBottom: "20px",
  },

  storeCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "15px",
    border: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
  },

  metaText: {
    color: "#777",
    fontSize: "14px",
  },

  viewBtn: {
    marginTop: "10px",
    height: "36px",
    padding: "0 18px",
    borderRadius: "20px",
    border: "none",
    background: "#ff7a00",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },

  ratingsContainer: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #eee",
    marginBottom: "25px",
  },

  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "10px",
    borderBottom: "1px solid #eee",
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #f0f0f0",
  },
};

export default OwnerDashboard;