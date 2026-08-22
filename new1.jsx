import { useState, useEffect, useCallback } from "react";
import api, { API_BASE_URL } from "../api/api";
import "../css/newBlueprint.css";
import { EventSource } from "eventsource";
import { useTranslation } from "../i18n";

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */

const Icon = ({ children, size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const IconMonitor = (p) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </Icon>
);

const IconFiles = (p) => (
  <Icon {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  </Icon>
);

const IconRefresh = (p) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
  </Icon>
);

const IconDiagram = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="3" width="6" height="6" rx="1" />
    <rect x="9" y="15" width="6" height="6" rx="1" />
    <path d="M9 6h6M6 9v3a3 3 0 0 0 3 3M18 9v3a3 3 0 0 1-3 3" />
  </Icon>
);

const IconPdf = (p) => (
  <Icon {...p}>
    <path d="M6 2h9l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
    <path d="M14 2v5h5" />
    <path d="M8 15h2.2a1.5 1.5 0 0 0 0-3H8v6" />
    <path d="M13 12h1.4a2.5 2.5 0 0 1 0 5H13v-5ZM16.5 12H19" />
  </Icon>
);

const IconDownload = (p) => (
  <Icon {...p}>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </Icon>
);

const IconInfo = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </Icon>
);

const IconTrash = (p) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 14h10l1-14" />
    <path d="M9 7V4h6v3" />
  </Icon>
);

const IconClose = (p) => (
  <Icon {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

const MAIN_TABS = [
  {
    key: "viewer",
    label: "tabAppViewer",
    icon: IconMonitor,
  },
  {
    key: "diagram",
    label: "diagram",
    icon: IconDiagram,
  },
  {
    key: "files",
    label: "tabFiles",
    icon: IconFiles,
  },
];

function TabCluster({ activeTab, onSelect }) {
  const { t } = useTranslation();

  return (
    <div className="newBlueprint-tabcluster">
      {MAIN_TABS.map((tab) => {
        const TabIcon = tab.icon;
        const isActive = tab.key === activeTab;

        return (
          <button
            key={tab.key}
            type="button"
            className={
              "newBlueprint-tab" +
              (isActive ? " newBlueprint-tab--active" : "")
            }
            onClick={() => onSelect(tab.key)}
            title={t(tab.label)}
          >
            <TabIcon />

            <span className="newBlueprint-tab-label">
              {t(tab.label)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty State                                                        */
/* ------------------------------------------------------------------ */

const EmptyState = ({
  message,
  buttonText,
  onButtonClick,
  buttonIcon = null,
  buttonDisabled = false,
}) => {
  return (
    <div className="newBlueprint-empty-viewer">
      {/* ------------------------------------------------------------ */}
      {/* PROFESSIONAL AI AGENT                                        */}
      {/* ------------------------------------------------------------ */}

      <div className="newBlueprint-agent-illustration">
        <div className="newBlueprint-agent-glow" />

        <div className="newBlueprint-agent-orbit newBlueprint-agent-orbit-one" />
        <div className="newBlueprint-agent-orbit newBlueprint-agent-orbit-two" />

        <div className="newBlueprint-agent-core">
          <div className="newBlueprint-agent-core-inner">
            <span className="newBlueprint-agent-spark spark-one" />
            <span className="newBlueprint-agent-spark spark-two" />
            <span className="newBlueprint-agent-spark spark-three" />

            <div className="newBlueprint-agent-symbol">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="newBlueprint-agent-node node-one" />
        <div className="newBlueprint-agent-node node-two" />
        <div className="newBlueprint-agent-node node-three" />
      </div>

      <h2>{message}</h2>

      <p>Please start a conversation first to continue.</p>

      {buttonText && onButtonClick && (
        <button
          type="button"
          className="newBlueprint-empty-action"
          onClick={onButtonClick}
          disabled={buttonDisabled}
        >
          {buttonIcon}
          {buttonText}
        </button>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* PDF helpers                                                        */
/* ------------------------------------------------------------------ */

const getExportId = (file) =>
  file?.id || file?.exportId || file?.export_id;

const getExportName = (file) =>
  file?.fileName ||
  file?.filename ||
  file?.file_name ||
  file?.name ||
  "blueprint-export.pdf";

const getExportDate = (file) =>
  file?.createdAt ||
  file?.created_at ||
  file?.createdOn ||
  file?.created_on ||
  null;

/* ------------------------------------------------------------------ */
/* PDF Files View                                                     */
/* ------------------------------------------------------------------ */

const FilesView = ({
  blueprintId,
  showSnackbar,
  showConfirmSnackbar,
}) => {
  const [exportFiles, setExportFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const loadExportFiles = useCallback(
    async ({ silent = false } = {}) => {
      if (!blueprintId) {
        setExportFiles([]);
        setLoading(false);

        // ONLY CHANGE:
        setError("Please start a conversation first.");

        return;
      }

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await api.get(
          `/blueprints/${blueprintId}/exports`
        );

        console.log(
          "📄 EXPORTS RESPONSE:",
          response.data
        );

        console.log(
          "📄 EXPORTS BLUEPRINT ID:",
          blueprintId
        );

        const files =
          response.data?.exports ||
          response.data?.data ||
          response.data?.items ||
          response.data;

        setExportFiles(
          Array.isArray(files) ? files : []
        );
      } catch (requestError) {
        console.error(
          "Failed to load PDF files:",
          requestError
        );

        const message =
          requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Failed to load PDF files.";

        setError(message);

        showSnackbar(message, "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [blueprintId, showSnackbar]
  );

  useEffect(() => {
    void loadExportFiles();

    const interval = window.setInterval(() => {
      void loadExportFiles({ silent: true });
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadExportFiles]);

  const createExport = async () => {
    if (!blueprintId || creating) {
      if (!blueprintId) {
        showSnackbar(
          "Please start a conversation first.",
          "error"
        );
      }

      return;
    }

    try {
      setCreating(true);

      await api.post(
        `/blueprints/${blueprintId}/exports`
      );

      await loadExportFiles({ silent: true });

      showSnackbar(
        "PDF export created successfully.",
        "success"
      );
    } catch (requestError) {
      showSnackbar(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Could not create the PDF export.",
        "error"
      );
    } finally {
      setCreating(false);
    }
  };

  const downloadExport = async (file) => {
    const exportId = getExportId(file);
    const fileName = getExportName(file);

    if (!exportId) {
      showSnackbar(
        "This PDF does not have a valid file ID.",
        "error"
      );
      return;
    }

    try {
      setDownloadingId(exportId);

      const response = await api.get(
        `/exports/${exportId}/download`,
        {
          responseType: "blob",
        }
      );

      const contentType =
        response.headers?.["content-type"] ||
        "application/pdf";

      const blob = new Blob([response.data], {
        type: contentType,
      });

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        fileName.toLowerCase().endsWith(".pdf")
          ? fileName
          : `${fileName}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      showSnackbar(
        "PDF downloaded successfully.",
        "success"
      );
    } catch (requestError) {
      console.error(
        "Failed to download PDF:",
        requestError
      );

      showSnackbar(
        requestError.response?.data?.message ||
          "Could not download this PDF.",
        "error"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const showExportInfo = async (file) => {
    const exportId = getExportId(file);

    if (!exportId) {
      showSnackbar(
        "This PDF does not have a valid file ID.",
        "error"
      );
      return;
    }

    try {
      setInfoLoading(true);

      const response = await api.get(
        `/exports/${exportId}`
      );

      const fullFile =
        response.data?.export ||
        response.data?.data ||
        response.data;

      setSelectedFile(fullFile || file);
    } catch (requestError) {
      console.error(
        "Failed to get PDF information:",
        requestError
      );

      showSnackbar(
        requestError.response?.data?.message ||
          "Could not load PDF information.",
        "error"
      );
    } finally {
      setInfoLoading(false);
    }
  };

  const performDeleteExport = async (file) => {
    const exportId = getExportId(file);

    if (!exportId) {
      showSnackbar(
        "This PDF does not have a valid file ID.",
        "error"
      );
      return;
    }

    try {
      setDeletingId(exportId);

      await api.delete(`/exports/${exportId}`);

      setExportFiles((previous) =>
        previous.filter(
          (item) =>
            getExportId(item) !== exportId
        )
      );

      if (
        selectedFile &&
        getExportId(selectedFile) === exportId
      ) {
        setSelectedFile(null);
      }

      showSnackbar(
        "PDF deleted successfully.",
        "success"
      );
    } catch (requestError) {
      console.error(
        "Failed to delete PDF:",
        requestError
      );

      showSnackbar(
        requestError.response?.data?.message ||
          "Could not delete this PDF.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const deleteExport = (file) => {
    const exportId = getExportId(file);
    const fileName = getExportName(file);

    if (!exportId) {
      showSnackbar(
        "This PDF does not have a valid file ID.",
        "error"
      );
      return;
    }

    if (deletingId === exportId) {
      return;
    }

    showConfirmSnackbar(
      `Delete "${fileName}"? This action cannot be undone.`,
      () => performDeleteExport(file)
    );
  };

  const formatDate = (value) => {
    if (!value) return "Date not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date not available";
    }

    return date.toLocaleString();
  };

  const getFileSize = (file) => {
    const size =
      file?.size ??
      file?.fileSize ??
      file?.file_size ??
      null;

    if (
      size === null ||
      size === undefined ||
      size === ""
    ) {
      return "Not available";
    }

    const bytes = Number(size);

    if (!Number.isFinite(bytes)) {
      return String(size);
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  return (
    <div
      className="newBlueprint-pdf-files"
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: "28px",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "22px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "11px",
                  display: "grid",
                  placeItems: "center",
                  background: "#fff1f2",
                  color: "#dc2626",
                }}
              >
                <IconPdf size={21} />
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "21px",
                  fontWeight: 700,
                  color: "#172033",
                }}
              >
                PDF Files
              </h2>
            </div>

            <p
              style={{
                margin: 0,
                color: "#71809a",
                fontSize: "13px",
              }}
            >
              PDF files generated for this blueprint.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadExportFiles({
                silent: true,
              })
            }
            disabled={loading || refreshing}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              minHeight: "38px",
              padding: "0 14px",
              border: "1px solid #e2e7ef",
              borderRadius: "10px",
              background: "#fff",
              color: "#42506a",
              cursor:
                loading || refreshing
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading || refreshing
                  ? 0.6
                  : 1,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <IconRefresh size={15} />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <button
            type="button"
            className="newBlueprint-pdf-create-button"
            onClick={() => void createExport()}
            disabled={creating || loading}
          >
            <IconPdf size={15} />
            {creating
              ? "Creating PDF..."
              : "Create PDF"}
          </button>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              minHeight: "280px",
              display: "grid",
              placeItems: "center",
              border: "1px solid #e8ebf1",
              borderRadius: "16px",
              background: "#fff",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "#71809a",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  border: "3px solid #e7eaf0",
                  borderTopColor: "#596cff",
                  borderRadius: "50%",
                  margin: "0 auto 12px",
                  animation:
                    "newBlueprintPdfSpin 0.8s linear infinite",
                }}
              />

              <div
                style={{
                  fontSize: "13px",
                }}
              >
                Loading PDF files...
              </div>
            </div>
          </div>
        ) : error ? (
          <div
            style={{
              minHeight: "240px",
              display: "grid",
              placeItems: "center",
              border: "1px solid #f1d4d7",
              borderRadius: "16px",
              background: "#fffafa",
              textAlign: "center",
              padding: "24px",
            }}
          >
            <div>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 12px",
                  background: "#fff1f2",
                  color: "#dc2626",
                  fontWeight: 800,
                  fontSize: "18px",
                }}
              >
                !
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
                  color: "#263247",
                  fontSize: "15px",
                }}
              >
                Could not load PDF files
              </h3>

              <p
                style={{
                  margin: "0 0 14px",
                  color: "#71809a",
                  fontSize: "13px",
                }}
              >
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadExportFiles()
                }
                style={{
                  border: 0,
                  borderRadius: "9px",
                  padding: "9px 15px",
                  background: "#596cff",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        ) : exportFiles.length === 0 ? (
          <EmptyState
            message="No PDF files yet"
            buttonText={
              creating
                ? "Creating PDF..."
                : "Create PDF"
            }
            onButtonClick={createExport}
            buttonIcon={<IconPdf size={15} />}
            buttonDisabled={creating}
          />
        ) : (
          <div
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
            {exportFiles.map((file, index) => {
              const exportId =
                getExportId(file) ||
                `file-${index}`;

              const fileName =
                getExportName(file);

              const createdAt =
                getExportDate(file);

              const isDeleting =
                deletingId === exportId;

              const isDownloading =
                downloadingId === exportId;

              return (
                <article
                  key={exportId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    minHeight: "68px",
                    padding: "10px 14px",
                    border:
                      "1px solid #e7eaf0",
                    borderRadius: "14px",
                    background: "#fff",
                    boxShadow:
                      "0 2px 10px rgba(20, 32, 55, 0.03)",
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 auto",
                      width: "42px",
                      height: "42px",
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "11px",
                      background: "#fff1f2",
                      color: "#dc2626",
                    }}
                  >
                    <IconPdf size={22} />
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <div
                      title={fileName}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: "#202b3d",
                        fontSize: "13px",
                        fontWeight: 700,
                        marginBottom: "4px",
                      }}
                    >
                      {fileName}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                        color: "#8490a5",
                        fontSize: "11px",
                      }}
                    >
                      <span>PDF</span>
                      <span>•</span>
                      <span>
                        {formatDate(createdAt)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      flex: "0 0 auto",
                    }}
                  >
                    <button
                      type="button"
                      title="Download PDF"
                      aria-label="Download PDF"
                      onClick={() =>
                        void downloadExport(file)
                      }
                      disabled={
                        isDownloading ||
                        isDeleting
                      }
                      style={{
                        width: "34px",
                        height: "34px",
                        display: "grid",
                        placeItems: "center",
                        border: 0,
                        borderRadius: "9px",
                        background:
                          isDownloading
                            ? "#f3f5f9"
                            : "transparent",
                        color: "#59677f",
                        cursor:
                          isDownloading ||
                          isDeleting
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          isDownloading ||
                          isDeleting
                            ? 0.55
                            : 1,
                      }}
                    >
                      <IconDownload size={17} />
                    </button>

                    <button
                      type="button"
                      title="View PDF information"
                      aria-label="View PDF information"
                      onClick={() =>
                        void showExportInfo(file)
                      }
                      disabled={
                        infoLoading ||
                        isDeleting
                      }
                      style={{
                        width: "34px",
                        height: "34px",
                        display: "grid",
                        placeItems: "center",
                        border: 0,
                        borderRadius: "9px",
                        background: "transparent",
                        color: "#59677f",
                        cursor:
                          infoLoading ||
                          isDeleting
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          infoLoading ||
                          isDeleting
                            ? 0.55
                            : 1,
                      }}
                    >
                      <IconInfo size={17} />
                    </button>

                    <button
                      type="button"
                      title="Delete PDF"
                      aria-label="Delete PDF"
                      onClick={() =>
                        deleteExport(file)
                      }
                      disabled={
                        isDeleting ||
                        isDownloading
                      }
                      style={{
                        width: "34px",
                        height: "34px",
                        display: "grid",
                        placeItems: "center",
                        border: 0,
                        borderRadius: "9px",
                        background:
                          isDeleting
                            ? "#fff1f2"
                            : "transparent",
                        color: "#dc2626",
                        cursor:
                          isDeleting ||
                          isDownloading
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          isDeleting ||
                          isDownloading
                            ? 0.55
                            : 1,
                      }}
                    >
                      <IconTrash size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF INFO MODAL */}

      {selectedFile && (
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedFile(null);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "grid",
            placeItems: "center",
            padding: "20px",
            background:
              "rgba(15, 23, 42, 0.38)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              width: "min(470px, 100%)",
              borderRadius: "18px",
              background: "#fff",
              boxShadow:
                "0 24px 70px rgba(15, 23, 42, 0.20)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "17px 18px",
                borderBottom:
                  "1px solid #edf0f4",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    color: "#dc2626",
                    flex: "0 0 auto",
                  }}
                >
                  <IconPdf size={20} />
                </div>

                <strong
                  title={getExportName(
                    selectedFile
                  )}
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#202b3d",
                    fontSize: "14px",
                  }}
                >
                  PDF Information
                </strong>
              </div>

              <button
                type="button"
                aria-label="Close"
                onClick={() =>
                  setSelectedFile(null)
                }
                style={{
                  width: "32px",
                  height: "32px",
                  display: "grid",
                  placeItems: "center",
                  border: 0,
                  borderRadius: "8px",
                  background: "transparent",
                  color: "#71809a",
                  cursor: "pointer",
                }}
              >
                <IconClose size={18} />
              </button>
            </div>

            <div
              style={{
                padding: "18px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#8a95a8",
                      fontSize: "11px",
                      marginBottom: "4px",
                    }}
                  >
                    File name
                  </div>

                  <div
                    style={{
                      color: "#263247",
                      fontSize: "13px",
                      fontWeight: 600,
                      wordBreak: "break-word",
                    }}
                  >
                    {getExportName(
                      selectedFile
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "11px",
                      background: "#f8f9fc",
                    }}
                  >
                    <div
                      style={{
                        color: "#8a95a8",
                        fontSize: "11px",
                        marginBottom: "4px",
                      }}
                    >
                      Type
                    </div>

                    <strong
                      style={{
                        color: "#263247",
                        fontSize: "12px",
                      }}
                    >
                      {selectedFile?.mimeType ||
                        selectedFile?.mime_type ||
                        "application/pdf"}
                    </strong>
                  </div>

                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "11px",
                      background: "#f8f9fc",
                    }}
                  >
                    <div
                      style={{
                        color: "#8a95a8",
                        fontSize: "11px",
                        marginBottom: "4px",
                      }}
                    >
                      Size
                    </div>

                    <strong
                      style={{
                        color: "#263247",
                        fontSize: "12px",
                      }}
                    >
                      {getFileSize(
                        selectedFile
                      )}
                    </strong>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px",
                    borderRadius: "11px",
                    background: "#f8f9fc",
                  }}
                >
                  <div
                    style={{
                      color: "#8a95a8",
                      fontSize: "11px",
                      marginBottom: "4px",
                    }}
                  >
                    Status
                  </div>

                  <strong
                    style={{
                      color: "#263247",
                      fontSize: "12px",
                    }}
                  >
                    {selectedFile?.status ||
                      "Available"}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "12px",
                    borderRadius: "11px",
                    background: "#f8f9fc",
                  }}
                >
                  <div
                    style={{
                      color: "#8a95a8",
                      fontSize: "11px",
                      marginBottom: "4px",
                    }}
                  >
                    Created
                  </div>

                  <strong
                    style={{
                      color: "#263247",
                      fontSize: "12px",
                    }}
                  >
                    {formatDate(
                      getExportDate(
                        selectedFile
                      )
                    )}
                  </strong>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                padding: "14px 18px",
                borderTop:
                  "1px solid #edf0f4",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedFile(null)
                }
                style={{
                  padding: "9px 14px",
                  border:
                    "1px solid #e0e5ed",
                  borderRadius: "9px",
                  background: "#fff",
                  color: "#52617a",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  void downloadExport(
                    selectedFile
                  )
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 14px",
                  border: 0,
                  borderRadius: "9px",
                  background: "#596cff",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                <IconDownload size={15} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Agent Messages                                                     */
/* ------------------------------------------------------------------ */

function AgentMessagesView({
  messages,
  loading,
  error,
}) {
  if (loading) {
    return (
      <div className="agent-messages-state">
        <div className="agent-messages-spinner" />
        <p>Loading agent results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agent-messages-state agent-messages-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="agent-messages-state">
        <p>No agent results yet.</p>
      </div>
    );
  }

  return (
    <div className="agent-messages-container">
      <div className="agent-messages-header">
        <h2>Agent Results</h2>

        <span>
          {messages.length}{" "}
          {messages.length === 1
            ? "message"
            : "messages"}
        </span>
      </div>

      <div className="agent-messages-list">
        {messages.map((message, index) => {
          const content =
            message?.content ??
            message?.message ??
            message?.text ??
            message?.response ??
            message?.output ??
            "";

          const agentName =
            message?.agent_name ??
            message?.agentName ??
            message?.agent?.name ??
            message?.agent ??
            message?.role ??
            `Agent ${index + 1}`;

          return (
            <div
              className="agent-message-card"
              key={message?.id ?? index}
            >
              <div className="agent-message-header">
                <strong>{agentName}</strong>

                {message?.created_at && (
                  <span>
                    {new Date(
                      message.created_at
                    ).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="agent-message-content">
                {typeof content === "string" ? (
                  <pre>{content}</pre>
                ) : (
                  <pre>
                    {JSON.stringify(
                      content,
                      null,
                      2
                    )}
                  </pre>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diagrams View                                                      */
/* ------------------------------------------------------------------ */

function DiagramsView({
  diagrams,
  loading,
  error,
  selectedDiagram,
  onSelectDiagram,
  onRefresh,
  onUpdate,
  onDelete,
  onOpenCreate,
  creating = false,
  updating = false,
  deleting = false,
  showSnackbar,
  showConfirmSnackbar,
}) {
  const handleRefresh = async () => {
    try {
      await onRefresh();

      showSnackbar(
        "Diagrams refreshed successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Failed to refresh diagrams:",
        error
      );

      showSnackbar(
        error?.response?.data?.message ||
          "Could not refresh diagrams.",
        "error"
      );
    }
  };

  const handleDelete = () => {
    if (!selectedDiagram?.id) {
      showSnackbar(
        "No diagram selected.",
        "error"
      );
      return;
    }

    const diagramName =
      selectedDiagram?.title ||
      selectedDiagram?.name ||
      "this diagram";

    showConfirmSnackbar(
      `Delete "${diagramName}"? This action cannot be undone.`,
      async () => {
        try {
          await onDelete(
            selectedDiagram.id
          );
        } catch (error) {
          console.error(
            "Delete diagram failed:",
            error
          );
        }
      }
    );
  };

  const handleUpdate = async () => {
    if (!selectedDiagram?.id) {
      showSnackbar(
        "No diagram selected.",
        "error"
      );
      return;
    }

    try {
      await onUpdate(
        selectedDiagram.id,
        selectedDiagram
      );

      showSnackbar(
        "Diagram updated successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Update diagram failed:",
        error
      );

      showSnackbar(
        error?.response?.data?.message ||
          "Could not update diagram.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="newBlueprint-empty-viewer">
        <h2>Loading diagrams...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="newBlueprint-empty-viewer">
        <h2>Failed to load diagrams</h2>

        <p>{error}</p>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
        >
          <IconRefresh size={15} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="newBlueprint-diagrams-view">
      <div className="newBlueprint-diagrams-header">
        <div>
          <h2>Diagrams</h2>

          <p>
            {diagrams?.length || 0} diagram
            {diagrams?.length === 1
              ? ""
              : "s"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
          >
            <IconRefresh size={15} />

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

          <button
            type="button"
            disabled={creating}
            onClick={onOpenCreate}
          >
            <IconDiagram size={15} />

            {creating
              ? "Creating..."
              : "New Diagram"}
          </button>
        </div>
      </div>

      {!diagrams ||
      diagrams.length === 0 ? (
        <EmptyState
          message="No diagrams yet"
          buttonText={
            creating
              ? "Creating..."
              : "Create your first diagram"
          }
          onButtonClick={onOpenCreate}
          buttonIcon={<IconDiagram size={15} />}
          buttonDisabled={creating}
        />
      ) : (
        <div className="newBlueprint-diagrams-content">
          <div className="newBlueprint-diagrams-list">
            {diagrams.map(
              (diagram, index) => {
                const diagramId =
                  diagram?.id ||
                  diagram?.diagram_id ||
                  index;

                const isSelected =
                  selectedDiagram?.id ===
                  diagram?.id;

                return (
                  <button
                    key={diagramId}
                    type="button"
                    className={
                      "newBlueprint-diagram-item" +
                      (isSelected
                        ? " newBlueprint-diagram-item--active"
                        : "")
                    }
                    onClick={() =>
                      onSelectDiagram(
                        diagram
                      )
                    }
                  >
                    <IconDiagram size={18} />

                    <div>
                      <strong>
                        {diagram?.title ||
                          diagram?.name ||
                          `Diagram ${
                            index + 1
                          }`}
                      </strong>

                      {diagram?.type && (
                        <span>
                          {diagram.type}
                        </span>
                      )}

                      {diagram?.diagram_type && (
                        <span>
                          {
                            diagram.diagram_type
                          }
                        </span>
                      )}
                    </div>
                  </button>
                );
              }
            )}
          </div>

          <div className="newBlueprint-diagram-preview">
            {!selectedDiagram ? (
              <div className="newBlueprint-empty-viewer">
                <div className="newBlueprint-chart-icon">
                  <IconDiagram size={36} />
                </div>

                <h2>Select a diagram</h2>

                <p>
                  Choose a diagram from the
                  list.
                </p>
              </div>
            ) : (
              <>
                <div className="newBlueprint-diagram-preview-header">
                  <div>
                    <h2>
                      {selectedDiagram?.title ||
                        selectedDiagram?.name ||
                        "Diagram"}
                    </h2>

                    {(selectedDiagram?.type ||
                      selectedDiagram?.diagram_type) && (
                      <span>
                        {selectedDiagram?.type ||
                          selectedDiagram?.diagram_type}
                      </span>
                    )}
                  </div>

                  <div className="newBlueprint-diagram-actions">
                    <button
                      type="button"
                      disabled={
                        updating ||
                        deleting ||
                        creating
                      }
                      onClick={handleUpdate}
                    >
                      {updating
                        ? "Updating..."
                        : "Update"}
                    </button>

                    <button
                      type="button"
                      disabled={
                        deleting ||
                        updating ||
                        creating
                      }
                      onClick={handleDelete}
                    >
                      {deleting
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="newBlueprint-diagram-body">
                  {selectedDiagram?.image_url ? (
                    <img
                      src={
                        selectedDiagram.image_url
                      }
                      alt={
                        selectedDiagram?.title ||
                        "Diagram"
                      }
                    />
                  ) : selectedDiagram?.imageUrl ? (
                    <img
                      src={
                        selectedDiagram.imageUrl
                      }
                      alt={
                        selectedDiagram?.title ||
                        "Diagram"
                      }
                    />
                  ) : selectedDiagram?.url ? (
                    <img
                      src={
                        selectedDiagram.url
                      }
                      alt={
                        selectedDiagram?.title ||
                        "Diagram"
                      }
                    />
                  ) : selectedDiagram?.svg ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedDiagram.svg,
                      }}
                    />
                  ) : (
                    <pre>
                      {JSON.stringify(
                        selectedDiagram,
                        null,
                        2
                      )}
                    </pre>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function NewBlueprint({
  blueprintId: propBlueprintId,
}) {
  const blueprintId =
    propBlueprintId ||
    new URLSearchParams(
      window.location.search
    ).get("id");

  const { t } = useTranslation();

  const [agentMessages, setAgentMessages] =
    useState([]);

  const [
    messagesLoading,
    setMessagesLoading,
  ] = useState(false);

  const [
    messagesError,
    setMessagesError,
  ] = useState(null);

  const [diagrams, setDiagrams] =
    useState([]);

  const [
    diagramsLoading,
    setDiagramsLoading,
  ] = useState(false);

  const [
    diagramsError,
    setDiagramsError,
  ] = useState(null);

  const [
    selectedDiagram,
    setSelectedDiagram,
  ] = useState(null);

  const [
    diagramCreating,
    setDiagramCreating,
  ] = useState(false);

  const [
    diagramUpdating,
    setDiagramUpdating,
  ] = useState(false);

  const [
    diagramDeleting,
    setDiagramDeleting,
  ] = useState(false);

  const [activeTab, setActiveTab] =
    useState("viewer");

  const [snackbar, setSnackbar] =
    useState(null);

  const showSnackbar = useCallback(
    (message, type = "success") => {
      setSnackbar({
        id: Date.now(),
        message,
        type,
      });
    },
    []
  );

  const showConfirmSnackbar = useCallback(
    (message, onConfirm) => {
      setSnackbar({
        id: Date.now(),
        message,
        type: "confirm",
        onConfirm,
      });
    },
    []
  );

  useEffect(() => {
    if (!snackbar) {
      return undefined;
    }

    const duration =
      snackbar.type === "confirm"
        ? 8000
        : 3500;

    const timer = window.setTimeout(() => {
      setSnackbar(null);
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [snackbar]);

  const [
    showCreateDiagramModal,
    setShowCreateDiagramModal,
  ] = useState(false);

  const [
    newDiagramTitle,
    setNewDiagramTitle,
  ] = useState("");

  useEffect(() => {
    if (!blueprintId) {
      console.log(
        "⏳ Waiting for blueprintId..."
      );
      return;
    }

    const controller =
      new AbortController();

    const loadAgentMessages = async () => {
      try {
        setMessagesLoading(true);
        setMessagesError(null);

        console.log(
          "📨 Fetching agent messages for:",
          blueprintId
        );

        const response = await api.get(
          `/agent-messages/blueprint/${blueprintId}`
        );

        console.log(
          "📨 Agent messages response:",
          response.data
        );

        const data = response.data;

        let messages = [];

        if (Array.isArray(data)) {
          messages = data;
        } else if (
          Array.isArray(data?.data)
        ) {
          messages = data.data;
        } else if (
          Array.isArray(data?.messages)
        ) {
          messages = data.messages;
        } else if (
          Array.isArray(data?.items)
        ) {
          messages = data.items;
        }

        if (!controller.signal.aborted) {
          setAgentMessages(messages);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(
          "Failed to load agent messages:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          setMessagesError(
            "Unauthorized. Please login again."
          );

          showSnackbar(
            "Unauthorized. Please login again.",
            "error"
          );
        } else if (
          error.response?.status === 404
        ) {
          setMessagesError(
            "Blueprint not found."
          );

          showSnackbar(
            "Blueprint not found.",
            "error"
          );
        } else {
          const message =
            error.response?.data?.message ||
            "Failed to load agent messages.";

          setMessagesError(message);

          showSnackbar(
            message,
            "error"
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setMessagesLoading(false);
        }
      }
    };

    void loadAgentMessages();

    return () => {
      controller.abort();
    };
  }, [blueprintId, showSnackbar]);

  const fetchDiagrams = useCallback(
    async (signal) => {
      if (!blueprintId) {
        setDiagrams([]);
        return;
      }

      try {
        setDiagramsLoading(true);
        setDiagramsError(null);

        console.log(
          "📊 Fetching diagrams for blueprint:",
          blueprintId
        );

        const response = await api.get(
          `/blueprints/${blueprintId}/diagrams`
        );

        console.log(
          "📊 Diagrams response:",
          response.data
        );

        const data = response.data;

        let diagramList = [];

        if (Array.isArray(data)) {
          diagramList = data;
        } else if (
          Array.isArray(data?.data)
        ) {
          diagramList = data.data;
        } else if (
          Array.isArray(data?.diagrams)
        ) {
          diagramList = data.diagrams;
        } else if (
          Array.isArray(data?.items)
        ) {
          diagramList = data.items;
        }

        if (signal?.aborted) {
          return;
        }

        setDiagrams(diagramList);

        setSelectedDiagram(
          (previous) => {
            if (previous) {
              const stillExists =
                diagramList.some(
                  (diagram) =>
                    diagram?.id ===
                    previous?.id
                );

              if (stillExists) {
                return previous;
              }
            }

            return (
              diagramList[0] || null
            );
          }
        );
      } catch (error) {
        if (signal?.aborted) {
          return;
        }

        console.error(
          "❌ Failed to fetch diagrams:",
          error
        );

        let message =
          "Failed to load diagrams.";

        if (
          error.response?.status === 401
        ) {
          message =
            "Unauthorized. Please login again.";
        } else if (
          error.response?.status === 404
        ) {
          message =
            "Blueprint not found.";
        } else {
          message =
            error.response?.data?.message ||
            message;
        }

        setDiagramsError(message);
        setDiagrams([]);

        showSnackbar(
          message,
          "error"
        );
      } finally {
        if (!signal?.aborted) {
          setDiagramsLoading(false);
        }
      }
    },
    [blueprintId, showSnackbar]
  );

  useEffect(() => {
    if (!blueprintId) {
      return;
    }

    const controller =
      new AbortController();

    void fetchDiagrams(
      controller.signal
    );

    return () =>
      controller.abort();
  }, [blueprintId, fetchDiagrams]);

  const createDiagram = async (
    diagramData = {}
  ) => {
    if (!blueprintId) {
      console.error(
        "❌ Blueprint ID is missing."
      );

      showSnackbar(
        "Please start a conversation first.",
        "error"
      );

      return null;
    }

    try {
      setDiagramCreating(true);

      console.log(
        "➕ Creating diagram"
      );

      console.log(
        "🔑 Blueprint ID:",
        blueprintId
      );

      console.log(
        "📦 Diagram payload:",
        diagramData
      );

      const response =
        await api.post(
          `/blueprints/${blueprintId}/diagrams`,
          diagramData
        );

      console.log(
        "✅ Diagram created:",
        response.data
      );

      const createdDiagram =
        response.data?.diagram ||
        response.data?.data ||
        response.data;

      if (createdDiagram) {
        setDiagrams(
          (previous) => [
            ...previous,
            createdDiagram,
          ]
        );

        setSelectedDiagram(
          createdDiagram
        );
      }

      return createdDiagram;
    } catch (error) {
      console.error(
        "❌ Failed to create diagram:",
        error.response?.data ||
          error
      );

      throw error;
    } finally {
      setDiagramCreating(false);
    }
  };

  const handleCreateDiagram = async () => {
    const title =
      newDiagramTitle.trim();

    if (!title) {
      showSnackbar(
        "Please enter a diagram name.",
        "error"
      );
      return;
    }

    if (diagramCreating) {
      return;
    }

    try {
      await createDiagram({
        title,
        diagram_type: "flowchart",
        mermaid_code:
          "graph TD;\n  A[Start] --> B[End];",
      });

      await fetchDiagrams();

      setNewDiagramTitle("");

      setShowCreateDiagramModal(
        false
      );

      showSnackbar(
        "Diagram created successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "Create diagram failed:",
        error
      );

      showSnackbar(
        error?.response?.data?.message ||
          "Could not create diagram.",
        "error"
      );
    }
  };

  const fetchDiagramById =
    async (diagramId) => {
      if (!diagramId) {
        console.error(
          "❌ Cannot fetch diagram: diagramId is missing."
        );

        return null;
      }

      try {
        console.log(
          "🔎 Fetching diagram:",
          diagramId
        );

        const response =
          await api.get(
            `/diagrams/${diagramId}`
          );

        console.log(
          "🔎 Diagram response:",
          response.data
        );

        const diagram =
          response.data?.diagram ||
          response.data?.data ||
          response.data;

        setSelectedDiagram(
          diagram
        );

        return diagram;
      } catch (error) {
        console.error(
          "❌ Failed to fetch diagram:",
          error
        );

        throw error;
      }
    };

  const updateDiagram = async (
    diagramId,
    diagramData = {}
  ) => {
    if (!diagramId) {
      throw new Error(
        "Diagram ID is missing."
      );
    }

    try {
      setDiagramUpdating(true);

      console.log(
        "✏️ Updating diagram:",
        diagramId
      );

      console.log(
        "📦 Update payload:",
        diagramData
      );

      const response =
        await api.patch(
          `/diagrams/${diagramId}`,
          diagramData
        );

      console.log(
        "✅ Diagram updated:",
        response.data
      );

      const updatedDiagram =
        response.data?.diagram ||
        response.data?.data ||
        response.data;

      if (updatedDiagram) {
        setSelectedDiagram(
          updatedDiagram
        );

        setDiagrams(
          (previous) =>
            previous.map(
              (diagram) =>
                diagram?.id ===
                diagramId
                  ? updatedDiagram
                  : diagram
            )
        );
      }

      return updatedDiagram;
    } catch (error) {
      console.error(
        "❌ Failed to update diagram:",
        error
      );

      throw error;
    } finally {
      setDiagramUpdating(false);
    }
  };

  const deleteDiagram = async (
    diagramId
  ) => {
    if (!diagramId) {
      throw new Error(
        "Diagram ID is missing."
      );
    }

    try {
      setDiagramDeleting(true);

      console.log(
        "🗑️ Deleting diagram:",
        diagramId
      );

      const response =
        await api.delete(
          `/diagrams/${diagramId}`
        );

      console.log(
        "✅ Diagram deleted:",
        response.data
      );

      setDiagrams(
        (previous) =>
          previous.filter(
            (diagram) =>
              diagram?.id !==
              diagramId
          )
      );

      setSelectedDiagram(
        (previous) =>
          previous?.id === diagramId
            ? null
            : previous
      );

      showSnackbar(
        "Diagram deleted successfully.",
        "success"
      );

      return true;
    } catch (error) {
      console.error(
        "❌ Failed to delete diagram:",
        error.response?.data ||
          error
      );

      showSnackbar(
        error?.response?.data?.message ||
          "Could not delete diagram.",
        "error"
      );

      throw error;
    } finally {
      setDiagramDeleting(false);
    }
  };

  useEffect(() => {
    if (!blueprintId) {
      console.log(
        "No blueprintId found"
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    console.log(
      "SSE Blueprint ID:",
      blueprintId
    );

    console.log(
      "SSE token exists:",
      !!token
    );

    if (!token) {
      console.error(
        "No access token found. SSE connection cancelled."
      );

      return;
    }

    const sseUrl =
      `${API_BASE_URL}/blueprints/${blueprintId}/events`;

    console.log(
      "Opening SSE:",
      sseUrl
    );

    const eventSource =
      new EventSource(
        sseUrl,
        {
          fetch: (
            input,
            init
          ) =>
            fetch(input, {
              ...init,
              headers: {
                ...init?.headers,
                Authorization:
                  `Bearer ${token}`,
              },
            }),
        }
      );

    eventSource.onopen = () => {
      console.log(
        "✅ SSE connection opened"
      );
    };

    eventSource.onmessage = (
      event
    ) => {
      console.log(
        "📡 SSE RAW message:",
        event.data
      );

      try {
        const data =
          JSON.parse(
            event.data
          );

        console.log(
          "📡 SSE PARSED:",
          data
        );

        console.log(
          "📡 SSE type:",
          data?.type
        );

        console.log(
          "📡 SSE event:",
          data?.event
        );

        console.log(
          "📡 SSE status:",
          data?.status
        );
      } catch (error) {
        console.log(
          "📡 SSE is not JSON:",
          event.data
        );
      }
    };

    eventSource.onerror = (
      error
    ) => {
      console.error(
        "❌ SSE connection error:",
        error
      );

      eventSource.close();
    };

    return () => {
      console.log(
        "Closing SSE connection"
      );

      eventSource.close();
    };
  }, [blueprintId]);

  return (
    <div className="blueprint-container">
      <div className="newBlueprint-page">
        <header className="newBlueprint-topbar">
          <div className="newBlueprint-topbar-left">
            <span
              className="newBlueprint-logo"
              title="Luma"
            >
              <span className="luma-character">
                <span className="luma-ear luma-ear-left" />
                <span className="luma-ear luma-ear-right" />

                <span className="luma-face">
                  <span className="luma-eye luma-eye-left" />
                  <span className="luma-eye luma-eye-right" />
                  <span className="luma-smile" />
                </span>
              </span>
            </span>
          </div>

          <div className="newBlueprint-topbar-center">
            <div className="newBlueprint-divider" />

            <TabCluster
              activeTab={activeTab}
              onSelect={setActiveTab}
            />
          </div>
        </header>

        <main className="newBlueprint-stage">
          {activeTab === "viewer" && (
            <AgentMessagesView
              messages={agentMessages}
              loading={messagesLoading}
              error={messagesError}
            />
          )}

          {activeTab === "diagram" && (
            <DiagramsView
              diagrams={diagrams}
              loading={diagramsLoading}
              error={diagramsError}
              selectedDiagram={
                selectedDiagram
              }
              showSnackbar={
                showSnackbar
              }
              showConfirmSnackbar={
                showConfirmSnackbar
              }
              creating={
                diagramCreating
              }
              updating={
                diagramUpdating
              }
              deleting={
                diagramDeleting
              }
              onOpenCreate={() => {
                setNewDiagramTitle("");

                setShowCreateDiagramModal(
                  true
                );
              }}
              onSelectDiagram={async (
                diagram
              ) => {
                setSelectedDiagram(
                  diagram
                );

                if (!diagram?.id) {
                  return;
                }

                try {
                  await fetchDiagramById(
                    diagram.id
                  );
                } catch (error) {
                  console.error(
                    "Failed to load selected diagram:",
                    error
                  );

                  showSnackbar(
                    error?.response?.data
                      ?.message ||
                      "Could not load diagram.",
                    "error"
                  );
                }
              }}
              onRefresh={() =>
                fetchDiagrams()
              }
              onUpdate={async (
                diagramId,
                diagramData
              ) => {
                try {
                  await updateDiagram(
                    diagramId,
                    diagramData
                  );

                  await fetchDiagrams();

                  showSnackbar(
                    "Diagram updated successfully.",
                    "success"
                  );
                } catch (error) {
                  console.error(
                    "Update diagram failed:",
                    error
                  );

                  showSnackbar(
                    error?.response?.data
                      ?.message ||
                      "Could not update diagram.",
                    "error"
                  );

                  throw error;
                }
              }}
              onDelete={async (
                diagramId
              ) => {
                try {
                  await deleteDiagram(
                    diagramId
                  );

                  await fetchDiagrams();
                } catch (error) {
                  console.error(
                    "Delete diagram failed:",
                    error
                  );

                  throw error;
                }
              }}
            />
          )}

          {activeTab === "files" && (
            <FilesView
              blueprintId={
                blueprintId
              }
              showSnackbar={
                showSnackbar
              }
              showConfirmSnackbar={
                showConfirmSnackbar
              }
            />
          )}
        </main>

        {showCreateDiagramModal && (
          <div
            className="newBlueprint-modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                if (
                  !diagramCreating
                ) {
                  setShowCreateDiagramModal(
                    false
                  );

                  setNewDiagramTitle(
                    ""
                  );
                }
              }
            }}
          >
            <div
              className="newBlueprint-create-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-diagram-title"
            >
              <div className="newBlueprint-create-modal-icon">
                <IconDiagram size={22} />
              </div>

              <div className="newBlueprint-create-modal-content">
                <h3 id="create-diagram-title">
                  Create New Diagram
                </h3>

                <p>
                  Enter a name for your
                  diagram.
                </p>

                <input
                  autoFocus
                  type="text"
                  value={
                    newDiagramTitle
                  }
                  onChange={(event) =>
                    setNewDiagramTitle(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();

                      void handleCreateDiagram();
                    }

                    if (
                      event.key ===
                      "Escape"
                    ) {
                      if (
                        !diagramCreating
                      ) {
                        setShowCreateDiagramModal(
                          false
                        );

                        setNewDiagramTitle(
                          ""
                        );
                      }
                    }
                  }}
                  placeholder="e.g. System Flowchart"
                  maxLength={100}
                  disabled={
                    diagramCreating
                  }
                />

                <div className="newBlueprint-create-modal-actions">
                  <button
                    type="button"
                    className="newBlueprint-modal-cancel"
                    onClick={() => {
                      if (
                        diagramCreating
                      ) {
                        return;
                      }

                      setShowCreateDiagramModal(
                        false
                      );

                      setNewDiagramTitle(
                        ""
                      );
                    }}
                    disabled={
                      diagramCreating
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="newBlueprint-modal-create"
                    onClick={() =>
                      void handleCreateDiagram()
                    }
                    disabled={
                      diagramCreating ||
                      !newDiagramTitle.trim()
                    }
                  >
                    {diagramCreating ? (
                      <>
                        <span className="newBlueprint-mini-spinner" />

                        Creating...
                      </>
                    ) : (
                      <>
                        <IconDiagram size={15} />

                        Create Diagram
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {snackbar && (
          <div
            key={snackbar.id}
            className={
              "newBlueprint-global-snackbar " +
              (snackbar.type === "error"
                ? "newBlueprint-global-snackbar--error"
                : snackbar.type === "confirm"
                ? "newBlueprint-global-snackbar--confirm"
                : "newBlueprint-global-snackbar--success")
            }
            role="alert"
            aria-live="assertive"
            style={
              snackbar.type === "confirm"
                ? {
                    minWidth:
                      "min(430px, calc(100vw - 32px))",
                  }
                : undefined
            }
          >
            <div
              className="newBlueprint-snackbar-icon"
              style={
                snackbar.type === "confirm"
                  ? {
                      background: "#fff7ed",
                      color: "#ea580c",
                    }
                  : undefined
              }
            >
              {snackbar.type === "error"
                ? "!"
                : snackbar.type === "confirm"
                ? "!"
                : "✓"}
            </div>

            <div className="newBlueprint-snackbar-content">
              <strong>
                {snackbar.type === "error"
                  ? "Error"
                  : snackbar.type === "confirm"
                  ? "Confirm deletion"
                  : "Success"}
              </strong>

              <span>
                {snackbar.message}
              </span>
            </div>

            {snackbar.type === "confirm" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginLeft: "8px",
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setSnackbar(null)
                  }
                  style={{
                    height: "32px",
                    padding: "0 11px",
                    border:
                      "1px solid #e2e7ef",
                    borderRadius: "8px",
                    background: "#fff",
                    color: "#52617a",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const action =
                      snackbar.onConfirm;

                    setSnackbar(null);

                    if (
                      typeof action ===
                      "function"
                    ) {
                      await action();
                    }
                  }}
                  style={{
                    height: "32px",
                    padding: "0 12px",
                    border: 0,
                    borderRadius: "8px",
                    background: "#dc2626",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="newBlueprint-snackbar-close"
                aria-label="Close notification"
                onClick={() =>
                  setSnackbar(null)
                }
              >
                <IconClose size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
