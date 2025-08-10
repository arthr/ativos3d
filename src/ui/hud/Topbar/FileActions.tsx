import Button from "../../components/Button";
import {
  exportCurrentLotToDownload,
  importLotFromFile,
  exportThumbnailPng,
} from "../../services/fileActions";

export function FileActions() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button aria-label="Exportar lote" title="Exportar lote" onClick={exportCurrentLotToDownload}>
        Exportar
      </Button>
      <label
        title="Importar lote"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          height: 32,
          minWidth: 44,
          padding: "0 10px",
          border: "1px solid #e5e7eb",
          borderRadius: 6,
          background: "#fff",
          fontWeight: 600,
        }}
      >
        Importar
        <input
          type="file"
          accept="application/json,.json"
          style={{ display: "none" }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              await importLotFromFile(file);
            } catch (err) {
              // eslint-disable-next-line no-alert
              alert("Falha ao importar JSON: " + (err as Error).message);
            } finally {
              e.currentTarget.value = "";
            }
          }}
        />
      </label>
      <Button
        aria-label="Exportar thumbnail"
        title="Exportar thumbnail"
        onClick={exportThumbnailPng}
      >
        Thumbnail
      </Button>
    </div>
  );
}

export default FileActions;
