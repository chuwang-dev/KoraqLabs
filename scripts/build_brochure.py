"""Generate the Koraq Labs company brochure PDF.

Design language mirrors the website: near-black ink, warm paper background,
a single teal accent, serif display headings against a sans body, generous
whitespace, hairline rules, and a mono eyebrow/label treatment.
"""

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

W, H = A4

import os
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "public")

# ---------------------------------------------------------------- palette ---
# Navy-black foundation, drawn from the logo's K stem
INK = HexColor("#070B1C")
INK_700 = HexColor("#161C38")
INK_500 = HexColor("#474E6B")
INK_400 = HexColor("#6B7291")
INK_300 = HexColor("#959BB4")
INK_200 = HexColor("#C3C7D8")
# Lilac paper — never plain white
PAPER = HexColor("#F6F3FC")
PAPER_SOFT = HexColor("#EFEAF9")
# Primary accent: the logo's violet wing
SIGNAL = HexColor("#5B22D6")
SIGNAL_300 = HexColor("#A278EE")
SIGNAL_50 = HexColor("#F1EAFD")
# Secondary accent: the logo's blue/cyan wing
AZURE = HexColor("#0060F0")
HAIRLINE = Color(12 / 255, 13 / 255, 15 / 255, alpha=0.12)
HAIRLINE_DARK = Color(1, 1, 1, alpha=0.14)

# ------------------------------------------------------------------ fonts ---
# Fall back to the built-in families if the DejaVu set isn't present.
FONT_DIRS = [
    "/usr/share/fonts/truetype/dejavu/",
    "/usr/share/fonts/truetype/liberation/",
]


def _register(name, filename):
    for d in FONT_DIRS:
        try:
            pdfmetrics.registerFont(TTFont(name, d + filename))
            return True
        except Exception:
            continue
    return False


HAS_LIB = _register("Body", "LiberationSans-Regular.ttf")
_register("BodyBold", "LiberationSans-Bold.ttf")
_register("BodyIt", "LiberationSans-Italic.ttf")
HAS_SERIF = _register("Display", "LiberationSerif-Regular.ttf")
_register("DisplayIt", "LiberationSerif-Italic.ttf")
HAS_MONO = _register("Mono", "LiberationMono-Regular.ttf")

BODY = "Body" if HAS_LIB else "Helvetica"
BODY_B = "BodyBold" if HAS_LIB else "Helvetica-Bold"
DISPLAY = "Display" if HAS_SERIF else "Times-Roman"
MONO = "Mono" if HAS_MONO else "Courier"

MARGIN = 54
CONTENT_W = W - MARGIN * 2

from PIL import Image as PILImage
from reportlab.lib.utils import ImageReader


def crop_top_to_ratio(path, ratio):
    """Crop a screenshot to the given width/height ratio, anchored to the
    top (matching the site's own object-cover object-top treatment), and
    return a reportlab ImageReader — no intermediate file is written."""
    im = PILImage.open(path).convert("RGB")
    w, h = im.size
    cur = w / h
    if cur > ratio:
        new_w = int(h * ratio)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / ratio)
        im = im.crop((0, 0, w, new_h))
    return ImageReader(im)

c = canvas.Canvas(
    os.path.join(PUBLIC_DIR, "brochure", "koraq-labs-company-profile.pdf"),
    pagesize=A4,
)
c.setTitle("Koraq Labs — Company Profile")
c.setAuthor("Koraq Labs")
c.setSubject("Digital products, built to work.")
c.setCreator("Koraq Labs")

page_num = {"n": 0}


# ------------------------------------------------------------- primitives ---
def bg(color=PAPER):
    c.setFillColor(color)
    c.rect(0, 0, W, H, stroke=0, fill=1)


def rule(x, y, width, color=HAIRLINE, lw=0.7):
    c.setStrokeColor(color)
    c.setLineWidth(lw)
    c.line(x, y, x + width, y)


def eyebrow(text, x, y, color=INK_400):
    c.setFont(MONO, 7.4)
    c.setFillColor(color)
    c.drawString(x, y, text.upper())


def heading(text, x, y, size=26, color=INK, leading=None, max_w=None):
    """Serif display heading; wraps if max_w given. Returns the y after."""
    c.setFont(DISPLAY, size)
    c.setFillColor(color)
    lead = leading or size * 1.16
    if max_w:
        lines = simpleSplit(text, DISPLAY, size, max_w)
    else:
        lines = [text]
    for line in lines:
        c.drawString(x, y, line)
        y -= lead
    return y + lead


def body(text, x, y, size=9.6, color=INK_500, width=None, leading=None, font=None):
    """Wrapped body copy. Returns the y position below the final line."""
    f = font or BODY
    width = width or CONTENT_W
    lead = leading or size * 1.55
    c.setFont(f, size)
    c.setFillColor(color)
    for line in simpleSplit(text, f, size, width):
        c.drawString(x, y, line)
        y -= lead
    return y


MARK_LIGHT = os.path.join(PUBLIC_DIR, "images", "koraq-labs-mark.png")
MARK_DARK = os.path.join(PUBLIC_DIR, "images", "koraq-labs-mark-dark.png")
MARK_ASPECT = 439 / 490  # height / width of the source crop

def logo(x, y, height=22, dark=False):
    """The real Koraq K mark, placed with its baseline at (x, y)."""
    path = MARK_DARK if dark else MARK_LIGHT
    width = height / MARK_ASPECT
    c.drawImage(
        path, x, y, width=width, height=height,
        mask="auto", preserveAspectRatio=True,
    )
    return width


def footer(dark=False):
    page_num["n"] += 1
    n = page_num["n"]
    y = 34
    rule(MARGIN, y + 16, CONTENT_W, HAIRLINE_DARK if dark else HAIRLINE)
    c.setFont(MONO, 7)
    c.setFillColor(Color(1, 1, 1, alpha=0.4) if dark else INK_300)
    c.drawString(MARGIN, y, "KORAQ LABS — COMPANY PROFILE")
    c.drawRightString(W - MARGIN, y, f"{n:02d}")


def new_page(dark=False):
    c.showPage()
    bg(INK if dark else PAPER)


def grid_pattern(alpha=0.05, step=42, dark=False):
    c.saveState()
    c.setStrokeColor(
        Color(1, 1, 1, alpha=alpha) if dark else Color(12 / 255, 13 / 255, 15 / 255, alpha=alpha)
    )
    c.setLineWidth(0.5)
    x = 0
    while x < W:
        c.line(x, 0, x, H)
        x += step
    y = 0
    while y < H:
        c.line(0, y, W, y)
        y += step
    c.restoreState()


def numbered_block(num, title, text, x, y, width):
    """A numbered item with a hairline above it. Returns the y below."""
    rule(x, y + 14, width)
    c.setFont(MONO, 7.6)
    c.setFillColor(SIGNAL)
    c.drawString(x, y, num)
    c.setFont(DISPLAY, 14)
    c.setFillColor(INK)
    c.drawString(x, y - 20, title)
    return body(text, x, y - 38, size=9, width=width, leading=13.2)


def pill(text, x, y, pad=7, size=7.6, fill=PAPER_SOFT, color=INK_500, border=True):
    c.setFont(MONO, size)
    tw = c.stringWidth(text, MONO, size)
    h = size + 9
    c.setFillColor(fill)
    if border:
        c.setStrokeColor(HAIRLINE)
        c.setLineWidth(0.7)
        c.roundRect(x, y - 3, tw + pad * 2, h, 3, stroke=1, fill=1)
    else:
        c.roundRect(x, y - 3, tw + pad * 2, h, 3, stroke=0, fill=1)
    c.setFillColor(color)
    c.drawString(x + pad, y + 1.5, text)
    return x + tw + pad * 2 + 6


def bullet_list(items, x, y, width, size=9, gap=15.5, dot=SIGNAL_300):
    for item in items:
        c.setFillColor(dot)
        c.circle(x + 2, y + 3.2, 1.5, stroke=0, fill=1)
        y = body(item, x + 11, y, size=size, width=width - 11, leading=12.8) - (gap - 12.8)
    return y


# =============================================================== 01 — COVER ==
bg(INK)
grid_pattern(alpha=0.055, step=46, dark=True)

# accent wash
c.setFillColor(Color(91 / 255, 34 / 255, 214 / 255, alpha=0.16))
c.circle(W * 0.86, H * 0.20, 190, stroke=0, fill=1)

_cover_logo_h = 24
_cover_logo_w = logo(MARGIN, H - 90, _cover_logo_h, dark=True)
c.setFont(DISPLAY, 17)
c.setFillColor(PAPER)
c.drawString(MARGIN + _cover_logo_w + 12, H - 82, "Koraq Labs")

c.setFont(MONO, 7.6)
c.setFillColor(Color(1, 1, 1, alpha=0.45))
c.drawString(MARGIN, H - 118, "COMPANY PROFILE — 2026")

y = H * 0.56
c.setFont(DISPLAY, 46)
c.setFillColor(PAPER)
for line in ["Digital products,", "built to work."]:
    c.drawString(MARGIN, y, line)
    y -= 54

y -= 6
body(
    "Koraq Labs is a Nigerian technology studio designing and building "
    "websites, landing pages, and web applications for businesses ready "
    "to look credible, reach more customers, and operate better online.",
    MARGIN,
    y,
    size=11,
    color=Color(1, 1, 1, alpha=0.6),
    width=CONTENT_W * 0.62,
    leading=17.5,
)

rule(MARGIN, 128, CONTENT_W, HAIRLINE_DARK)
c.setFont(MONO, 7.6)
c.setFillColor(Color(1, 1, 1, alpha=0.45))
c.drawString(MARGIN, 108, "WEBSITES")
c.drawString(MARGIN + 110, 108, "LANDING PAGES")
c.drawString(MARGIN + 250, 108, "WEB APPLICATIONS")
c.drawString(MARGIN + 400, 108, "DIGITAL PRODUCTS")

c.setFont(BODY, 9)
c.setFillColor(Color(1, 1, 1, alpha=0.5))
c.drawString(MARGIN, 72, "koraqlabs@gmail.com")
c.drawRightString(W - MARGIN, 72, "WhatsApp 0814 383 2354")
page_num["n"] += 1  # cover counts but shows no footer

# ========================================================== 02 — ABOUT US ==
new_page()
y = H - 96
eyebrow("About Koraq Labs", MARGIN, y)
y = heading("Technology that solves business problems.", MARGIN, y - 34, 26, max_w=CONTENT_W * 0.8)

y -= 26
y = body(
    "Koraq Labs is a Nigerian technology studio focused on building practical "
    "digital products for businesses.",
    MARGIN,
    y,
    size=13,
    color=INK_700,
    width=CONTENT_W * 0.78,
    leading=20,
    font=DISPLAY,
)
y -= 14
y = body(
    "We believe technology should solve business problems, not simply look "
    "impressive. From a high-converting landing page to a complete business "
    "platform, we combine strategy, design, and software development to create "
    "digital experiences that businesses can actually use and grow with.",
    MARGIN,
    y,
    width=CONTENT_W * 0.78,
    leading=15.5,
)

# Mission / vision panel
panel_y = y - 54
c.setFillColor(PAPER_SOFT)
c.rect(MARGIN, panel_y - 128, CONTENT_W, 128, stroke=0, fill=1)
c.setStrokeColor(HAIRLINE)
c.setLineWidth(0.7)
c.rect(MARGIN, panel_y - 128, CONTENT_W, 128, stroke=1, fill=0)
c.line(MARGIN + CONTENT_W / 2, panel_y - 128, MARGIN + CONTENT_W / 2, panel_y)

col_w = CONTENT_W / 2 - 52
eyebrow("Mission", MARGIN + 26, panel_y - 30)
body(
    "To give Nigerian businesses digital products that are genuinely useful — "
    "built with the same standard of craft as the software they use every day.",
    MARGIN + 26,
    panel_y - 50,
    size=9,
    width=col_w,
    leading=13.6,
)
eyebrow("Vision", MARGIN + CONTENT_W / 2 + 26, panel_y - 30)
body(
    "To become a long-term technology partner for businesses across Nigeria, "
    "growing with them from their first website to the systems that run their "
    "operations.",
    MARGIN + CONTENT_W / 2 + 26,
    panel_y - 50,
    size=9,
    width=col_w,
    leading=13.6,
)

# Core values
vy = panel_y - 176
eyebrow("Core values", MARGIN, vy)
vy -= 26
values = [
    ("Simplicity", "The simplest solution that solves the problem is the right one."),
    ("Reliability", "Things we build should work, keep working, and be easy to maintain."),
    ("Practical Innovation", "New technology is worth using when it makes a real difference."),
    ("Business Impact", "Design and code are judged by what they do for the business."),
    ("Continuous Improvement", "Every project should be better made than the one before it."),
]
for i, (title, desc) in enumerate(values):
    col = i % 2
    row = i // 2
    vx = MARGIN + col * (CONTENT_W / 2 + 6)
    vyy = vy - row * 56
    rule(vx, vyy + 13, CONTENT_W / 2 - 18)
    c.setFont(BODY_B, 9.4)
    c.setFillColor(INK)
    c.drawString(vx, vyy, title)
    body(desc, vx, vyy - 15, size=8.6, width=CONTENT_W / 2 - 22, leading=12)

# Closing strip: where we operate
sy2 = vy - 3 * 56 - 26
rule(MARGIN, sy2 + 26, CONTENT_W)
eyebrow("At a glance", MARGIN, sy2)
glance = [
    ("BASED IN", "Nigeria"),
    ("WE BUILD", "Websites, landing pages, web applications"),
    ("WE SERVE", "SMEs, startups, professionals, organizations"),
]
gy = sy2 - 26
for label, value in glance:
    c.setFont(MONO, 7)
    c.setFillColor(INK_300)
    c.drawString(MARGIN, gy, label)
    c.setFont(BODY, 9.6)
    c.setFillColor(INK_700)
    c.drawString(MARGIN + 92, gy, value)
    gy -= 22

footer()

# ====================================================== 03 — WHAT WE BUILD ==
new_page()
y = H - 96
eyebrow("What we build", MARGIN, y)
y = heading(
    "Four ways we help businesses show up and operate online.",
    MARGIN,
    y - 34,
    25,
    max_w=CONTENT_W * 0.82,
)

y -= 34
svc = [
    (
        "A",
        "Business Websites",
        "Professional websites designed to establish credibility, communicate "
        "value, and convert visitors into customers. Structured around how your "
        "customers actually search for, evaluate, and contact you.",
    ),
    (
        "B",
        "Landing Pages",
        "Focused pages for products, campaigns, services, launches, and lead "
        "generation. No competing navigation — one clear path from headline to "
        "enquiry.",
    ),
    (
        "C",
        "Web Applications",
        "Custom platforms, dashboards, portals, internal tools, and business "
        "systems. Applications with real data, real users, and real business "
        "logic behind them.",
    ),
    (
        "D",
        "Website Redesign & Optimization",
        "Modernize outdated websites — improving user experience, "
        "responsiveness, performance, and conversion, while preserving the "
        "content and search value already built.",
    ),
]

col_w = CONTENT_W / 2 - 16
for i, (idx, title, desc) in enumerate(svc):
    cx = MARGIN + (i % 2) * (CONTENT_W / 2 + 16)
    cy = y - (i // 2) * 150
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.7)
    c.rect(cx, cy - 122, col_w, 122, stroke=1, fill=0)
    c.setFont(MONO, 7.6)
    c.setFillColor(SIGNAL)
    c.drawString(cx + 20, cy - 28, idx)
    c.setFont(DISPLAY, 15)
    c.setFillColor(INK)
    c.drawString(cx + 20, cy - 52, title)
    body(desc, cx + 20, cy - 72, size=8.6, width=col_w - 40, leading=12.4)

# Supporting services strip
sy = y - 330
rule(MARGIN, sy + 24, CONTENT_W)
eyebrow("Also included when a project needs it", MARGIN, sy)
sy -= 24
support = [
    "Hosting & Deployment",
    "Domain & SSL Configuration",
    "Website Maintenance",
    "API Integrations",
    "Custom Business Automation",
]
px = MARGIN
for s in support:
    if px + c.stringWidth(s, MONO, 7.6) + 20 > W - MARGIN:
        px = MARGIN
        sy -= 24
    px = pill(s, px, sy)

footer()

# ========================================================= 04 — WHY KORAQ ==
new_page(dark=True)
grid_pattern(alpha=0.05, step=46, dark=True)

y = H - 96
c.setFont(MONO, 7.4)
c.setFillColor(Color(1, 1, 1, alpha=0.4))
c.drawString(MARGIN, y, "WHY KORAQ LABS")
y = heading(
    "Not just a website. A digital asset for your business.",
    MARGIN,
    y - 36,
    27,
    color=PAPER,
    max_w=CONTENT_W * 0.78,
)

y -= 52
props = [
    ("01", "Business First", "Every project starts with understanding the business, customers, and desired outcome."),
    ("02", "Built for Mobile", "Designed around how Nigerian customers actually access the internet."),
    ("03", "Fast & Modern", "Modern technologies, responsive interfaces, performance-focused development."),
    ("04", "Built to Grow", "Start with a website and evolve into a full digital product when your business needs it."),
]
for i, (num, title, desc) in enumerate(props):
    px = MARGIN + (i % 2) * (CONTENT_W / 2 + 16)
    py = y - (i // 2) * 130
    rule(px, py + 16, CONTENT_W / 2 - 16, HAIRLINE_DARK)
    c.setFont(MONO, 8)
    c.setFillColor(SIGNAL_300)
    c.drawString(px, py, num)
    c.setFont(DISPLAY, 17)
    c.setFillColor(PAPER)
    c.drawString(px, py - 26, title)
    body(
        desc,
        px,
        py - 46,
        size=9,
        color=Color(1, 1, 1, alpha=0.55),
        width=CONTENT_W / 2 - 40,
        leading=13.4,
    )

# growth ladder teaser
ly = y - 300
rule(MARGIN, ly + 30, CONTENT_W, HAIRLINE_DARK)
c.setFont(MONO, 7.4)
c.setFillColor(Color(1, 1, 1, alpha=0.4))
c.drawString(MARGIN, ly + 8, "YOUR FIRST WEBSITE DOESN'T HAVE TO BE YOUR FINAL DIGITAL PRODUCT")

stages = [("START", "Landing Page"), ("GROW", "Business Website"), ("SCALE", "Web Application"), ("AUTOMATE", "Digital System")]
sx = MARGIN
seg = CONTENT_W / 4
for i, (stage, label) in enumerate(stages):
    c.setFont(MONO, 7.4)
    c.setFillColor(SIGNAL_300)
    c.drawString(sx, ly - 26, stage)
    c.setFont(DISPLAY, 12.5)
    c.setFillColor(PAPER)
    c.drawString(sx, ly - 46, label)
    if i < 3:
        c.setStrokeColor(Color(1, 1, 1, alpha=0.25))
        c.setLineWidth(0.8)
        ax = sx + seg - 24
        c.line(ax, ly - 38, ax + 10, ly - 38)
        c.line(ax + 6, ly - 35, ax + 10, ly - 38)
        c.line(ax + 6, ly - 41, ax + 10, ly - 38)
    sx += seg

footer(dark=True)

# ======================================================= 05 — OUR PROCESS ==
new_page()
y = H - 96
eyebrow("How we work", MARGIN, y)
y = heading("A process that keeps projects moving.", MARGIN, y - 34, 26, max_w=CONTENT_W * 0.8)

y -= 30
y = body(
    "Every project runs through the same four stages, with a fifth available "
    "for businesses that want us to stay involved after launch.",
    MARGIN,
    y,
    width=CONTENT_W * 0.68,
    leading=15.5,
)

y -= 44
steps = [
    ("01", "Discover", "Understand your business, customers, goals, and requirements. We ask the questions that determine what actually needs building."),
    ("02", "Design", "Create the structure, visual direction, and user experience — agreed before any development begins."),
    ("03", "Build", "Develop the website or digital product using modern technologies, with progress you can see as it happens."),
    ("04", "Launch", "Deploy, configure the domain, optimize the experience, and hand over the project with everything documented."),
    ("05", "Support", "Optional. Maintenance, updates, improvements, and technical support on an ongoing basis."),
]
for num, title, desc in steps:
    rule(MARGIN, y + 16, CONTENT_W)
    c.setFont(MONO, 8)
    c.setFillColor(SIGNAL if num != "05" else INK_300)
    c.drawString(MARGIN, y - 2, num)
    c.setFont(DISPLAY, 16)
    c.setFillColor(INK)
    c.drawString(MARGIN + 48, y - 2, title)
    if num == "05":
        pill("OPTIONAL", MARGIN + 48 + c.stringWidth(title, DISPLAY, 16) + 12, y - 5, size=6.6)
    body(desc, MARGIN + 190, y - 2, size=9, width=CONTENT_W - 190, leading=13.4)
    y -= 78

# Engagement note
c.setFillColor(PAPER_SOFT)
c.rect(MARGIN, y - 52, CONTENT_W, 72, stroke=0, fill=1)
eyebrow("What you can expect throughout", MARGIN + 22, y - 4, SIGNAL)
body(
    "A named point of contact, progress you can see rather than wait for, and "
    "no surprise costs — anything outside the agreed scope gets discussed and "
    "quoted before it's built.",
    MARGIN + 22,
    y - 22,
    size=8.8,
    color=INK_500,
    width=CONTENT_W - 44,
    leading=12.6,
)

footer()

# ==================================================== 06 — INDUSTRIES ======
new_page()
y = H - 96
eyebrow("Who we build for", MARGIN, y)
y = heading("We build for businesses, not industries.", MARGIN, y - 34, 26, max_w=CONTENT_W * 0.8)

y -= 30
y = body(
    "The structure changes, the standard doesn't. What matters is how your "
    "customers find you, what convinces them, and how they get in touch — that "
    "thinking applies anywhere.",
    MARGIN,
    y,
    width=CONTENT_W * 0.7,
    leading=15.5,
)

y -= 46
inds = [
    "Healthcare",
    "Real Estate",
    "Hospitality",
    "Retail",
    "Automotive",
    "Professional Services",
    "Education",
    "Startups",
    "Financial Services",
    "Logistics",
]
cols, cell_w, cell_h = 3, CONTENT_W / 3, 54
for i, ind in enumerate(inds):
    cx = MARGIN + (i % cols) * cell_w
    cy = y - (i // cols) * cell_h
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.7)
    c.rect(cx, cy - cell_h, cell_w, cell_h, stroke=1, fill=0)
    c.setFont(BODY, 10)
    c.setFillColor(INK_700)
    c.drawString(cx + 18, cy - 32, ind)

ny = y - 4 * cell_h - 40
c.setFillColor(SIGNAL_50)
c.rect(MARGIN, ny - 76, CONTENT_W, 76, stroke=0, fill=1)
eyebrow("A note on experience", MARGIN + 24, ny - 26, SIGNAL)
body(
    "We don't claim specialised expertise in an industry unless our portfolio "
    "supports it. Where we've shipped work in a sector, we'll show you. Where we "
    "haven't, we'll tell you that too — and explain how we'd approach it.",
    MARGIN + 24,
    ny - 44,
    size=8.8,
    color=INK_700,
    width=CONTENT_W - 48,
    leading=12.6,
)

footer()

# ================================================== 07 — SELECTED WORK =====
new_page()
y = H - 96
eyebrow("Selected work", MARGIN, y)
y = heading("Projects we've shipped.", MARGIN, y - 34, 26)

y -= 36
live = [
    (
        "Casifla",
        "Hospitality — Restaurant Website",
        "A refined fine-dining website experience designed to showcase the "
        "restaurant, guide guests through its menu, and encourage reservations.",
        ["HTML", "CSS", "JavaScript"],
        os.path.join(PUBLIC_DIR, "images", "casifla-landing.png"),
    ),
    (
        "Autoforge",
        "Automotive — Automotive Website",
        "A focused auto-parts and repair website that helps dealers, fleets, and "
        "drivers explore parts, discover services, and place enquiries through "
        "WhatsApp.",
        ["Next.js", "TypeScript", "Tailwind CSS"],
        os.path.join(PUBLIC_DIR, "images", "autoforge-landing.png"),
    ),
]
for name, meta, desc, techs, screenshot in live:
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.7)
    c.rect(MARGIN, y - 132, CONTENT_W, 132, stroke=1, fill=0)

    # Real project screenshot, pre-cropped to this box's aspect ratio
    px, pw = MARGIN + 20, 150
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.7)
    c.rect(px, y - 112, pw, 92, stroke=1, fill=0)
    c.drawImage(
        crop_top_to_ratio(screenshot, pw / 92), px, y - 112, width=pw, height=92,
        mask="auto", preserveAspectRatio=False,
    )

    tx = px + pw + 26
    tw = CONTENT_W - pw - 66
    # live badge
    c.setFillColor(SIGNAL_50)
    c.roundRect(tx, y - 34, 62, 15, 3, stroke=0, fill=1)
    c.setFillColor(SIGNAL)
    c.circle(tx + 9, y - 26.5, 2.2, stroke=0, fill=1)
    c.setFont(MONO, 6.4)
    c.drawString(tx + 16, y - 29, "LIVE PROJECT")

    c.setFont(DISPLAY, 19)
    c.setFillColor(INK)
    c.drawString(tx, y - 58, name)
    c.setFont(MONO, 7.2)
    c.setFillColor(INK_400)
    c.drawString(tx, y - 73, meta.upper())
    ey = body(desc, tx, y - 90, size=8.6, width=tw, leading=12.2)
    bx = tx
    for t in techs:
        bx = pill(t, bx, ey - 6, size=6.8)

    y -= 152

# demo concepts
rule(MARGIN, y + 20, CONTENT_W)
eyebrow("Demo concepts", MARGIN, y - 4)
body(
    "Self-initiated concepts exploring how different industries might structure "
    "their websites. These are not client projects.",
    MARGIN,
    y - 22,
    size=8.6,
    width=CONTENT_W * 0.72,
    leading=12.2,
)

dy = y - 62
demos = [
    ("Healthcare Practice", "Business Website"),
    ("Restaurant Launch Page", "Landing Page"),
    ("Real Estate Agency", "Business Website"),
]
dw = CONTENT_W / 3 - 10
for i, (name, kind) in enumerate(demos):
    dx = MARGIN + i * (CONTENT_W / 3 + 5)
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.7)
    c.rect(dx, dy - 62, dw, 62, stroke=1, fill=0)
    c.setFont(MONO, 6.2)
    c.setFillColor(INK_300)
    c.drawString(dx + 14, dy - 20, "DEMO CONCEPT")
    c.setFont(DISPLAY, 12)
    c.setFillColor(INK)
    for li, line in enumerate(simpleSplit(name, DISPLAY, 12, dw - 28)):
        c.drawString(dx + 14, dy - 36 - li * 13, line)
    c.setFont(BODY, 7.6)
    c.setFillColor(INK_400)
    c.drawString(dx + 14, dy - 54, kind)

footer()

# ================================================= 08 — TECHNOLOGY ========
new_page()
y = H - 96
eyebrow("Technology & capabilities", MARGIN, y)
y = heading("Modern technology. Practical results.", MARGIN, y - 34, 26, max_w=CONTENT_W * 0.8)

y -= 30
y = body(
    "We choose tools based on what a project actually needs — not to put logos "
    "on a page. A landing page doesn't need a database. A booking system does. "
    "The right answer is the one that keeps the project fast to build and simple "
    "to maintain. Not every project uses every technology listed here.",
    MARGIN,
    y,
    width=CONTENT_W * 0.74,
    leading=15.5,
)

y -= 48
groups = [
    ("Frontend", ["Next.js", "React", "TypeScript", "Tailwind CSS"]),
    ("Backend", ["Node.js", "REST APIs", "PostgreSQL"]),
    ("Infrastructure", ["GitHub", "Vercel", "Cloud platforms", "Docker"]),
    ("Integrations", ["Payment gateways", "WhatsApp", "CMS platforms", "Analytics"]),
]
for i, (label, items) in enumerate(groups):
    gx = MARGIN + (i % 2) * (CONTENT_W / 2 + 16)
    gy = y - (i // 2) * 118
    rule(gx, gy + 18, CONTENT_W / 2 - 16)
    eyebrow(label, gx, gy)
    ix, iy = gx, gy - 24
    for item in items:
        if ix + c.stringWidth(item, MONO, 7.6) + 20 > gx + CONTENT_W / 2 - 16:
            ix = gx
            iy -= 24
        ix = pill(item, ix, iy)

# capability list
cy2 = y - 268
rule(MARGIN, cy2 + 24, CONTENT_W)
eyebrow("What we handle end to end", MARGIN, cy2)
caps = [
    "Discovery & scoping",
    "Interface design",
    "Front-end engineering",
    "Web application development",
    "API integrations",
    "Domain & SSL configuration",
    "Deployment pipelines",
    "Performance tuning",
    "Ongoing maintenance",
]
cy2 -= 26
for i, cap in enumerate(caps):
    ccx = MARGIN + (i % 3) * (CONTENT_W / 3)
    ccy = cy2 - (i // 3) * 24
    c.setFillColor(SIGNAL_300)
    c.circle(ccx + 2, ccy + 3, 1.6, stroke=0, fill=1)
    c.setFont(BODY, 8.8)
    c.setFillColor(INK_500)
    c.drawString(ccx + 12, ccy, cap)

# Principles
py2 = cy2 - 3 * 24 - 34
rule(MARGIN, py2 + 26, CONTENT_W)
eyebrow("How we make technology decisions", MARGIN, py2)
principles = [
    ("Fit before fashion", "The stack follows the requirement, never the other way round."),
    ("Boring where it counts", "Proven tools for the parts that must not break."),
    ("Owned, not locked in", "You get the code and the accounts. Nothing is held hostage."),
]
ppy = py2 - 28
for title, desc in principles:
    c.setFont(BODY_B, 9.2)
    c.setFillColor(INK)
    c.drawString(MARGIN, ppy, title)
    c.setFont(BODY, 8.8)
    c.setFillColor(INK_500)
    c.drawString(MARGIN + 150, ppy, desc)
    ppy -= 22

footer()

# =================================================== 09 — PACKAGES ========
new_page()
y = H - 96
eyebrow("Packages & project options", MARGIN, y)
y = heading("Clear starting points, scoped to what you need.", MARGIN, y - 34, 25, max_w=CONTENT_W * 0.82)

y -= 40
packs = [
    (
        "Starter",
        "Landing Page",
        "From ₦250,000",
        ["One-page website", "Mobile responsive", "WhatsApp CTA", "Contact form", "Basic SEO", "Domain connection", "Deployment"],
    ),
    (
        "Business",
        "Business Website",
        "From ₦750,000",
        ["4-7 pages", "Responsive design", "Contact forms", "WhatsApp integration", "Google Maps", "Basic SEO", "Analytics", "Domain connection", "Deployment"],
    ),
    (
        "Custom",
        "Web Application",
        "Custom pricing",
        ["Custom functionality", "Database integration", "API integrations", "Authentication", "Advanced forms", "Admin functionality", "Custom deployment"],
    ),
]
pw = CONTENT_W / 3 - 12
for i, (name, kind, price, feats) in enumerate(packs):
    px = MARGIN + i * (CONTENT_W / 3 + 6)
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.7)
    c.rect(px, y - 296, pw, 296, stroke=1, fill=0)

    c.setFont(MONO, 6.8)
    c.setFillColor(SIGNAL)
    c.drawString(px + 18, y - 30, kind.upper())
    c.setFont(DISPLAY, 21)
    c.setFillColor(INK)
    c.drawString(px + 18, y - 56, name)
    c.setFont(BODY, 11)
    c.setFillColor(INK_700)
    c.drawString(px + 18, y - 82, price)

    rule(px + 18, y - 98, pw - 36)
    fy = y - 118
    for f in feats:
        c.setFillColor(SIGNAL_300)
        c.circle(px + 20, fy + 3, 1.5, stroke=0, fill=1)
        c.setFont(BODY, 8.4)
        c.setFillColor(INK_500)
        for li, line in enumerate(simpleSplit(f, BODY, 8.4, pw - 48)):
            c.drawString(px + 29, fy - li * 11, line)
        fy -= 11 * len(simpleSplit(f, BODY, 8.4, pw - 48)) + 8

ny2 = y - 330
c.setFillColor(PAPER_SOFT)
c.rect(MARGIN, ny2 - 58, CONTENT_W, 58, stroke=0, fill=1)
body(
    "Every project is quoted after we understand the scope. These are starting "
    "points, not fixed prices — the conversation matters more than the package.",
    MARGIN + 22,
    ny2 - 24,
    size=8.8,
    color=INK_500,
    width=CONTENT_W - 44,
    leading=12.6,
)

footer()

# ======================================================== 10 — FAQ ========
new_page()
y = H - 96
eyebrow("Frequently asked questions", MARGIN, y)
y = heading("The questions we get most.", MARGIN, y - 34, 26)

y -= 40
faqs = [
    ("How long does a website take?", "Most standard business websites are completed within 1-2 weeks, depending on scope and how quickly content is available."),
    ("Do you build websites for new businesses?", "Yes. We can help structure the website even if your business is just getting started."),
    ("Can you redesign an existing website?", "Yes. We audit what you have, keep what works, and rebuild the rest."),
    ("Do you provide domain and hosting setup?", "Yes. Domain, DNS, SSL, hosting, and deployment can all be handled as part of the project."),
    ("Will my website work on mobile?", "Yes. Everything is designed mobile-first, because that's how most Nigerian customers will reach you."),
    ("Can you maintain the website after launch?", "Yes. Maintenance, updates, and technical support are available as an ongoing service."),
    ("Can you integrate WhatsApp?", "Yes. WhatsApp enquiry buttons and pre-filled message links are standard on most sites we build."),
    ("Can you build web applications?", "Yes. Dashboards, portals, booking systems, and internal tools are all within scope."),
    ("How much does a website cost?", "Landing pages start from ₦250,000 and business websites from ₦750,000. Applications are quoted per project."),
    ("How do I start a project?", "Send your details through the enquiry form or message us on WhatsApp. We'll come back with next steps."),
]
for q, a in faqs:
    rule(MARGIN, y + 14, CONTENT_W)
    c.setFont(DISPLAY, 12.5)
    c.setFillColor(INK)
    c.drawString(MARGIN, y - 4, q)
    body(a, MARGIN + 250, y - 4, size=8.6, width=CONTENT_W - 250, leading=12)
    y -= 58

footer()

# ==================================================== 11 — START A PROJECT =
new_page(dark=True)
grid_pattern(alpha=0.05, step=46, dark=True)
c.setFillColor(Color(91 / 255, 34 / 255, 214 / 255, alpha=0.14))
c.circle(W * 0.14, H * 0.22, 175, stroke=0, fill=1)

y = H - 110
c.setFont(MONO, 7.4)
c.setFillColor(Color(1, 1, 1, alpha=0.4))
c.drawString(MARGIN, y, "START A PROJECT")

y = heading("Let's build something that works.", MARGIN, y - 42, 34, color=PAPER, max_w=CONTENT_W * 0.8)

y -= 28
y = body(
    "Tell us what you're trying to build. We'll help you determine the right "
    "digital solution — whether that's a single landing page or a system that "
    "runs part of your business.",
    MARGIN,
    y,
    size=11,
    color=Color(1, 1, 1, alpha=0.6),
    width=CONTENT_W * 0.66,
    leading=17,
)

# contact blocks
cy3 = y - 70
rule(MARGIN, cy3 + 34, CONTENT_W, HAIRLINE_DARK)

blocks = [
    ("WHATSAPP", "0814 383 2354"),
    ("EMAIL", "koraqlabs@gmail.com"),
    ("INSTAGRAM", "@koraqlabs"),
]
bx = MARGIN
for label, value in blocks:
    c.setFont(MONO, 7)
    c.setFillColor(Color(1, 1, 1, alpha=0.4))
    c.drawString(bx, cy3, label)
    c.setFont(DISPLAY, 15)
    c.setFillColor(PAPER)
    c.drawString(bx, cy3 - 24, value)
    bx += CONTENT_W / 3

# what to tell us
wy = cy3 - 84
rule(MARGIN, wy + 28, CONTENT_W, HAIRLINE_DARK)
c.setFont(MONO, 7.4)
c.setFillColor(Color(1, 1, 1, alpha=0.4))
c.drawString(MARGIN, wy + 6, "WHAT TO TELL US WHEN YOU GET IN TOUCH")

asks = [
    "Your business name and what it does",
    "What you think you need (or that you're not sure yet)",
    "Whether you have an existing website",
    "Your rough budget range",
    "Any deadline you're working towards",
]
ay = wy - 22
for a in asks:
    c.setFillColor(SIGNAL_300)
    c.circle(MARGIN + 2, ay + 3, 1.6, stroke=0, fill=1)
    c.setFont(BODY, 9.4)
    c.setFillColor(Color(1, 1, 1, alpha=0.65))
    c.drawString(MARGIN + 13, ay, a)
    ay -= 20

# CTA band
c.setFillColor(PAPER)
c.roundRect(MARGIN, 128, CONTENT_W, 58, 5, stroke=0, fill=1)
c.setFont(DISPLAY, 16)
c.setFillColor(INK)
c.drawString(MARGIN + 26, 158, "Start your project")
c.setFont(BODY, 9)
c.setFillColor(INK_500)
c.drawString(MARGIN + 26, 142, "koraqlabs.com/contact")
c.setFont(MONO, 8)
c.setFillColor(SIGNAL)
c.drawRightString(W - MARGIN - 26, 152, "WA 0814 383 2354")

footer(dark=True)

# ==================================================== 12 — BACK COVER =====
new_page(dark=True)
c.setFillColor(Color(91 / 255, 34 / 255, 214 / 255, alpha=0.13))
c.circle(W * 0.5, H * 0.52, 210, stroke=0, fill=1)

_back_logo_h = 30
_back_logo_w = _back_logo_h / MARK_ASPECT
logo(W / 2 - _back_logo_w / 2, H * 0.56, _back_logo_h, dark=True)
c.setFont(DISPLAY, 30)
c.setFillColor(PAPER)
c.drawCentredString(W / 2, H * 0.48, "Koraq Labs")
c.setFont(BODY, 11)
c.setFillColor(Color(1, 1, 1, alpha=0.5))
c.drawCentredString(W / 2, H * 0.44, "Digital products, built to work.")

rule(W / 2 - 60, H * 0.40, 120, HAIRLINE_DARK)

c.setFont(MONO, 8)
c.setFillColor(Color(1, 1, 1, alpha=0.45))
c.drawCentredString(W / 2, H * 0.36, "koraqlabs@gmail.com")
c.drawCentredString(W / 2, H * 0.335, "WHATSAPP 0814 383 2354")
c.drawCentredString(W / 2, H * 0.31, "NIGERIA")

c.setFont(MONO, 7)
c.setFillColor(Color(1, 1, 1, alpha=0.3))
c.drawCentredString(W / 2, 54, "© 2026 KORAQ LABS. ALL RIGHTS RESERVED.")

c.save()
print("Brochure written.")
