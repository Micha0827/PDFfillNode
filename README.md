## PDF Fill n8n Node

Mit dieser n8n‑Node kannst du Formulardaten aus PDFs auslesen („Get Fields“) und PDFs mit Werten füllen („Fill“) – über die PDF Fill API.

## Voraussetzungen

- n8n Version ≥ 1.109  
- Eine laufende Instanz der PDF Fill API (z. B. unter `http://localhost:8080`)
- Repository der PDF Fill API: https://github.com/Micha0827/PDFfill

## Installation

Installation
Diese Community Node kann direkt in n8n unter **Settings → Community Nodes** installiert werden. Suche nach dem Paketnamen `n8n-nodes-pdf-fill`.

## Node Konfiguration

| Parameter        | Typ      | Beschreibung                                           | Standard                   |
| ---------------- | -------- | ------------------------------------------------------ | -------------------------- |
| **Base URL**     | String   | Basis-URL der PDF Fill API                             | `http://localhost:8080`    |
| **Operation**    | Options  | `fill` oder `getFields`                                | `fill`                     |
| **PDF Source**   | Options  | `binary` (über vorherige Node) oder `url`               | `binary`                   |
| **Binary Property** | String | Property-Name mit dem Binär‑PDF (bei `binary` Quelle)  | `data`                     |
| **PDF URL**      | String   | URL zur PDF-Datei (bei `url` Quelle)                   | —                          |
| **Fields**       | Collection (fixedCollection) | Liste von Feldern mit `name` und `value` (nur bei `fill`)         | `{ field: [] }`           |

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
          "field": [
            {
              "name": "Name",
              "value": "Max Mustermann"
            },
            {
              "name": "Vorname",
              "value": "Max"
            },
            {
              "name": "Nachname",
              "value": "Mustermann"
            }
          ]
        }
      },
      "name": "Fill PDF Form",
      "type": "pdfFill",
      "typeVersion": 1,
      "position": [
        250,
        300
      ]
    }
  ],
  "connections": {}
}
```

---

*Lizenz: MIT*
