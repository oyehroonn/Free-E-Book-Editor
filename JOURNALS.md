# Flipbook Platform — Journal Reference & API Guide

Live backend: `https://book.heyharoon.io`

---

## How the API Works

Every book is made of 3 nested layers: **Book → Pages → Blocks**.

### Block Types

| Type | Required fields in `data` |
|------|--------------------------|
| `HEADING` | `content`, `level` (1–3) |
| `TEXT` | `content` (HTML string) |
| `IMAGE` | `url`, `alt`, optional `caption` |
| `YOUTUBE` | `videoId`, `url` |
| `QUOTE` | `content`, optional `attribution` |
| `DIVIDER` | `style` (`"solid"` or `"ornament"`) |

### Step-by-step to create a journal

```bash
# 1. Create the book
POST /books
{
  "title": "...",
  "subtitle": "...",
  "description": "...",
  "authorName": "...",
  "coverImage": "https://...",   # optional, public image URL
  "category": "...",
  "tags": ["tag1", "tag2"]
}
# → returns { bookId, slug }

# 2. Add pages (one request per page, in order)
POST /pages
{ "bookId": "<bookId>" }
# → returns { id, pageNumber, ... }

# 3. Add blocks to each page
POST /blocks
{ "pageId": "<pageId>", "type": "HEADING" }
# → returns { id, type, order, data, ... }

# 4. Update each block with real content
PATCH /blocks/<blockId>
{ "data": { "type": "HEADING", "content": "My Title", "level": 1 } }

# 5. Publish the book
POST /books/<bookId>/publish
```

> **Tip:** `POST /blocks` always appends to the end. Use `"afterOrder": <n>` to insert after a specific block order number.

---

## Journal 1 — The Craft of Building Things

```
ID:       abee4327-61e6-41cb-8ea6-33109e0071ad
Slug:     the-craft-of-building-things
Author:   Test I
Category: Arts & Design
Tags:     design, creativity, technology
Status:   published
Cover:    (none)
URL:      https://book.heyharoon.io/read/the-craft-of-building-things
```

### Creation Script

```bash
BASE="https://book.heyharoon.io"

# --- BOOK ---
BOOK=$(curl -s -X POST "$BASE/books" -H "Content-Type: application/json" -d '{
  "title": "The Craft of Building Things",
  "subtitle": "Notes on design, code, and creative work",
  "description": "A short collection of ideas about making things well — from software to design to writing.",
  "authorName": "Test I",
  "category": "Arts & Design",
  "tags": ["design", "creativity", "technology"]
}')
BOOK_ID=$(echo $BOOK | python3 -c "import sys,json; print(json.load(sys.stdin)['bookId'])")

# --- 4 PAGES ---
for i in 1 2 3 4; do
  curl -s -X POST "$BASE/pages" -H "Content-Type: application/json" \
    -d "{\"bookId\": \"$BOOK_ID\"}" > /tmp/page$i.json
  export PAGE${i}_ID=$(cat /tmp/page$i.json | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
done
```

### Page Content

#### Page 1 — On Making Things Well

```bash
# HEADING (level 1)
B=$(curl -s -X POST "$BASE/blocks" -H "Content-Type: application/json" \
  -d "{\"pageId\": \"$PAGE1_ID\", \"type\": \"HEADING\"}")
BID=$(echo $B | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
curl -s -X PATCH "$BASE/blocks/$BID" -H "Content-Type: application/json" \
  -d '{"data": {"type": "HEADING", "content": "On Making Things Well", "level": 1}}'

# TEXT
B=$(curl -s -X POST "$BASE/blocks" -H "Content-Type: application/json" \
  -d "{\"pageId\": \"$PAGE1_ID\", \"type\": \"TEXT\"}")
BID=$(echo $B | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
curl -s -X PATCH "$BASE/blocks/$BID" -H "Content-Type: application/json" \
  -d '{"data": {"type": "TEXT", "content": "<p>There is a particular satisfaction that comes from making something well. Not just making it — anyone can make something — but making it with intention, with care, with an understanding of why each decision matters.</p><p>This is a collection of short notes on that feeling. On craft. On the invisible work that separates good work from great work.</p>"}}'

# QUOTE
B=$(curl -s -X POST "$BASE/blocks" -H "Content-Type: application/json" \
  -d "{\"pageId\": \"$PAGE1_ID\", \"type\": \"QUOTE\"}")
BID=$(echo $B | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
curl -s -X PATCH "$BASE/blocks/$BID" -H "Content-Type: application/json" \
  -d '{"data": {"type": "QUOTE", "content": "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", "attribution": "Antoine de Saint-Exupéry"}}'
```

#### Page 2 — The Simplicity Paradox

```bash
# HEADING (level 2)
# content: "The Simplicity Paradox"

# TEXT
# content: "<p>Simplicity is the hardest thing to achieve. It requires understanding something
# deeply enough that you can strip away everything that is not essential — and have the
# discipline not to add it back.</p><p>Most things in the world are complex because complexity
# is easier. It requires no hard choices. You can have <em>everything</em>. Simplicity demands
# that you choose.</p>"

# DIVIDER
# style: "ornament"

# TEXT
# content: "<p>The best software, the best writing, the best design — all share this quality.
# You cannot tell what was left out. You only experience what remains, and it is exactly enough.</p>"
```

#### Page 3 — Watching Masters Work

```bash
# HEADING (level 2): "Watching Masters Work"
# TEXT: "<p>One of the best ways to develop taste is to study people who have it. Watch how
# they work, what they keep, what they cut, what they obsess over that nobody else notices.</p>"
# YOUTUBE: videoId "X2wLP0izeJE" (Ira Glass on The Gap between Taste and Ability)
# TEXT: "<p>Ira Glass on the gap between taste and ability — one of the most honest things
# ever said about creative work.</p>"
```

#### Page 4 — The Only Rule

```bash
# HEADING (level 2): "The Only Rule"
# TEXT: "<p>All of the principles in this book reduce to one thing: <strong>pay attention</strong>...</p>"
# DIVIDER: style "ornament"
# QUOTE: "The details are not the details. They make the design." — Charles Eames

# Publish
curl -s -X POST "$BASE/books/$BOOK_ID/publish"
```

---

## Journal 2 — VPO

```
ID:       9f4fa2a7-0d1f-4581-966c-ee8b2a44909c
Slug:     vpo
Author:   Testing
Category: Technology
Status:   published
Cover:    https://book.heyharoon.io/uploads/adf7a996d47167f540b02653.png
URL:      https://book.heyharoon.io/read/vpo
```

### Creation Script

```bash
BASE="https://book.heyharoon.io"

BOOK=$(curl -s -X POST "$BASE/books" -H "Content-Type: application/json" -d '{
  "title": "VPO",
  "subtitle": "A Luxury Fashion Experience",
  "description": "Just testing",
  "authorName": "Testing",
  "coverImage": "https://book.heyharoon.io/uploads/adf7a996d47167f540b02653.png",
  "category": "Technology",
  "tags": []
}')
BOOK_ID=$(echo $BOOK | python3 -c "import sys,json; print(json.load(sys.stdin)['bookId'])")

# 2 pages
for i in 1 2; do
  curl -s -X POST "$BASE/pages" -H "Content-Type: application/json" \
    -d "{\"bookId\": \"$BOOK_ID\"}" > /tmp/vpo_page$i.json
done
```

### Page Content

#### Page 1

```
HEADING (level 1): "Virtual Premium Outlets"
TEXT: "Virtual Premium Outlet's is the world's first 3d free-roam, walkable premium shopping
      experience. You can lobby up with your friends from thousands of miles away and still
      go to your favorite stores together."
DIVIDER: style "solid"
IMAGE: url "https://book.heyharoon.io/uploads/d65df476a3d2e1a834db5b54.png"
       alt "astroportrait.png"
       caption "Asset 1"
```

#### Page 2

```
HEADING (level 2): "The Business Effect"
YOUTUBE: videoId "H5zSHFBjohE"
         url "https://youtu.be/H5zSHFBjohE?si=5un9LjoRemV9BQuV"
```

```bash
curl -s -X POST "$BASE/books/$BOOK_ID/publish"
```

---

## Journal 3 — Mi experiencia en Barcelona

```
ID:       a692fbe0-a85c-4920-a7b3-51ac04e96562
Slug:     mi-experiencia-en-barcelona
Author:   Spanish Beginning I
Category: Education
Tags:     Spanish, Barcelona, Language Learning, Journal
Status:   draft (publish when complete)
Cover:    https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80
URL:      https://book.heyharoon.io/read/mi-experiencia-en-barcelona (after publish)
```

### Creation Script

```bash
BASE="https://book.heyharoon.io"

BOOK=$(curl -s -X POST "$BASE/books" -H "Content-Type: application/json" -d '{
  "title": "Mi experiencia en Barcelona",
  "subtitle": "Un diario de aprendizaje del español",
  "description": "A Spanish learning journal documenting life and experiences in Barcelona, Spain. Oral and written tasks exploring the city, its culture, and language.",
  "authorName": "Spanish Beginning I",
  "coverImage": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
  "category": "Education",
  "tags": ["Spanish", "Barcelona", "Language Learning", "Journal"]
}')
BOOK_ID=$(echo $BOOK | python3 -c "import sys,json; print(json.load(sys.stdin)['bookId'])")

# 7 pages
for i in 1 2 3 4 5 6 7; do
  curl -s -X POST "$BASE/pages" -H "Content-Type: application/json" \
    -d "{\"bookId\": \"$BOOK_ID\"}" > /tmp/bcn_page$i.json
done
```

### Page Content

#### Page 1 — Title Page

```
HEADING (level 1): "Mi experiencia en Barcelona"
IMAGE: url "https://images.unsplash.com/photo-1464790719320-516ecd75af6c?w=1200&q=80"
       alt "Barcelona beach and cityscape"
TEXT:  "<p><strong>por Pilar Serrano</strong></p>
        <p>Spanish Beginning I — Primavera 2024</p>"
```

#### Page 2 — Esta soy yo

```
HEADING (level 2): "Esta soy yo"
IMAGE: url "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
       alt "Las Ramblas, Barcelona"
TEXT:  "<p>Hola, me llamo Pilar Serrano. Tengo veinte y dos años. Soy de Madrid, España,
        pero ahora vivo en Barcelona. Estudio lingüística en la Universidad de Barcelona.</p>
        <p>Me gusta mucho la música, el baile y la comida española. En mi tiempo libre, me
        gusta pasear por las Ramblas y visitar el Barrio Gótico. También me encanta la
        arquitectura de Gaudí — la Sagrada Família es impresionante.</p>
        <p>Este diario documenta mis experiencias viviendo y aprendiendo en esta ciudad
        maravillosa.</p>"
```

#### Page 3 — Oral Task 2 (Text)

```
HEADING (level 2): "Oral Task 2"
TEXT:  About barrio de Sants — traditional, authentic neighborhood. Describes markets,
       quiet streets, daily life of barceloneses.
IMAGE: url "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&q=80"
       alt "Barcelona neighborhood street scene"
```

#### Page 4 — Oral Task 2 (Video)

```
HEADING (level 2): "Vídeo: El barrio de Sants"
YOUTUBE: videoId "NqkV4jFE8to"
         url "https://www.youtube.com/watch?v=NqkV4jFE8to"
TEXT:  "<p><em>Fuente: OK Apartment Barcelona — Una visita al auténtico barrio de Sants...</em></p>"
```

#### Page 5 — Written Task 2 (Blank Template)

```
HEADING (level 2): "Written Task 2"
TEXT:  Writing prompt: describe your favorite Barcelona neighborhood (100–150 words).
       Includes bullet checklist: nombre del barrio, descripción física, actividades,
       por qué te gusta. Empty lines for student response.
DIVIDER: style "solid"
```

#### Page 6 — Oral Task 2 Reflection

```
HEADING (level 2): "Oral Task 2 — Reflexión"
TEXT:  Summary of research on Sants. Bullet points:
       - Sants was independent municipality until 1897
       - Estació de Sants is Barcelona's main train station
       - Strong Catalan cultural identity, own traditional festivals
       - More affordable prices than city center
       Vocabulary list included.
QUOTE: "Barcelona no es solo la Sagrada Família y las Ramblas — su verdadera alma vive
        en los barrios como Sants, donde la gente real hace su vida."
```

#### Page 7 — Música de España: ROSALÍA

```
HEADING (level 2): "Música de España: ROSALÍA"
TEXT:  Description of ROSALÍA, her Catalan roots, flamenco-pop fusion, international fame.
YOUTUBE: ROSALÍA performing on The Tonight Show with Jimmy Fallon
         (videoId to be confirmed — search "ROSALÍA Jimmy Fallon Tonight Show")
```

```bash
# Publish
curl -s -X POST "$BASE/books/$BOOK_ID/publish"
```

---

## Full API Reference

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/books` | Create book |
| `PUT` | `/books/:id` | Update book metadata |
| `POST` | `/books/:id/publish` | Publish book |
| `POST` | `/books/:id/unpublish` | Unpublish book |
| `DELETE` | `/books/:id` | Delete book |
| `GET` | `/books/published` | List all published books |
| `GET` | `/books/by-slug/:slug` | Get book + all pages + all blocks |
| `POST` | `/books/:id/views` | Increment view counter |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/pages` | Add page (`{ bookId, afterPageNumber? }`) |
| `DELETE` | `/pages/:id` | Delete page |
| `POST` | `/pages/:id/duplicate` | Duplicate page with all blocks |
| `POST` | `/pages/reorder` | Reorder pages (`{ bookId, orderedPageIds }`) |
| `PATCH` | `/pages/:id/title` | Set page title |

### Blocks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/blocks` | Add block (`{ pageId, type, afterOrder? }`) |
| `PATCH` | `/blocks/:id` | Update block data |
| `DELETE` | `/blocks/:id` | Delete block |
| `POST` | `/blocks/reorder` | Reorder blocks (`{ pageId, orderedBlockIds }`) |

### Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload image file, returns `{ url }` |

---

## Notes

- **No auth required** for read endpoints (`GET /books/published`, `GET /books/by-slug/:slug`).
- **Write endpoints** (POST, PUT, PATCH, DELETE) on the live server at `book.heyharoon.io` require session auth when called directly — they work via the Next.js frontend which proxies them.
- **Images**: Unsplash URLs with `?w=900&q=80` params work directly as block image URLs. Uploaded images live at `https://book.heyharoon.io/uploads/<filename>`.
- **YouTube**: Store the full URL in `data.url` and the extracted video ID in `data.videoId`. The reader uses `videoId` for the embed.
- **Block order**: `order` field is auto-assigned. Use `POST /blocks/reorder` to rearrange after the fact.
