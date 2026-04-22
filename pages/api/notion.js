import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, notionKey, databaseId, entry } = req.body;

  if (!notionKey || !databaseId) {
    return res.status(400).json({ error: "Missing notionKey or databaseId" });
  }

  const notion = new Client({ auth: notionKey });

  try {
    if (action === "test") {
      // Test connection by retrieving the database
      const db = await notion.databases.retrieve({ database_id: databaseId });
      return res.status(200).json({ ok: true, title: db.title?.[0]?.plain_text || "数据库" });
    }

    if (action === "log") {
      // Write a weight log entry to the Notion database
      // Expected entry: { date, weight, workout, notes }
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          "日期": {
            date: { start: entry.date }
          },
          "体重 (kg)": {
            number: parseFloat(entry.weight)
          },
          "完成锻炼": {
            checkbox: entry.workout === true
          },
          "备注": {
            rich_text: [{ text: { content: entry.notes || "" } }]
          }
        }
      });
      return res.status(200).json({ ok: true });
    }

    if (action === "fetch") {
      // Fetch last 12 entries sorted by date descending
      const response = await notion.databases.query({
        database_id: databaseId,
        sorts: [{ property: "日期", direction: "descending" }],
        page_size: 12
      });

      const rows = response.results.map(page => ({
        date: page.properties["日期"]?.date?.start || "",
        weight: page.properties["体重 (kg)"]?.number ?? null,
        workout: page.properties["完成锻炼"]?.checkbox ?? false,
        notes: page.properties["备注"]?.rich_text?.[0]?.plain_text || ""
      }));

      return res.status(200).json({ ok: true, rows });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
