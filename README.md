https://arc.net/l/quote/iofklxis# PDF Fill n8n Node

Mit dieser n8n‑Node kannst du Formulardaten aus PDFs auslesen („Get Fields“) und PDFs mit Werten füllen („Fill“) – über die PDF Fill API.

## Voraussetzungen

- n8n Version ≥ 2.x  
- Eine laufende Instanz der PDF Fill API (z. B. unter `http://localhost:8080`)

## Installation

1. Node.js-Projekt im n8n-Verzeichnis:
   ```bash
   cd ~/.n8n/custom_nodes
   git clone https://github.com/dein-repo/PDFfillNode.git
   cd PDFfillNode
   npm install
   npm run build
   ```
2. n8n neu starten:
   ```bash
   n8n restart
   ```

## Node Konfiguration

| Parameter        | Typ      | Beschreibung                                           | Standard                   |
| ---------------- | -------- | ------------------------------------------------------ | -------------------------- |
| **Base URL**     | String   | Basis-URL der PDF Fill API                             | `http://localhost:8080`    |
| **Operation**    | Options  | `fill` oder `getFields`                                | `fill`                     |
| **PDF Source**   | Options  | `binary` (über vorherige Node) oder `url`               | `binary`                   |
| **Binary Property** | String | Property-Name mit dem Binär‑PDF (bei `binary` Quelle)  | `data`                     |
| **PDF URL**      | String   | URL zur PDF-Datei (bei `url` Quelle)                   | —                          |
| **Fields**       | JSON     | Objekt mit Feld‑Name:Wert (nur bei `fill`)              | `{}`                       |

## Beispiel‑Workflows

### Get Fields

Datei: `examples/getFields_workflow.json`
```json
{
  "name": "PDF GetFields Example",
  "nodes": [
    {
      "parameters": {
        "baseUrl": "http://localhost:8080",
        "operation": "getFields",
        "source": "url",
        "pdfUrl": "https://example.com/form.pdf"
      },
      "name": "Get PDF Fields",
      "type": "pdfFill",
      "typeVersion": 1,
      "position": [250, 300]
    }
  ],
  "connections": {}
}
```

### Fill

Datei: `examples/fill_workflow.json`
```json
{
  "name": "PDF Fill Example",
  "nodes": [
    {
      "parameters": {
        "baseUrl": "http://localhost:8080",
        "operation": "fill",
        "source": "url",
        "pdfUrl": "https://example.com/form.pdf",
        "fields": {
          "Name": "Max Mustermann",
          "Vorname": "Max",
          "Nachname": "Mustermann"
        }
      },
      "name": "Fill PDF Form",
      "type": "pdfFill",
      "typeVersion": 1,
      "position": [250, 300]
    }
  ],
  "connections": {}
}
```

## Weiterentwicklung

- Tests und zusätzliche Beispiel‑Workflows im `examples`‑Ordner anlegen  
- Dokumentation hier im README erweitern  
- Node in n8n einbinden und manuell testen  
- Veröffentlichung auf npm oder GitHub vorbereiten

---

*Lizenz: MIT*
