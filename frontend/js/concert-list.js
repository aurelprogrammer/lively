import { supabase } from "./supabase.js";

const concertFields = [
    "id",
    "title",
    "artist",
    "date",
    "location",
    "description",
    "poster_url",
    "regular_price",
    "festival_price",
    "vip_price"
].join(",");

function formatRupiah(value) {
    const price = Number(value);
    if (!Number.isFinite(price)) return "Harga belum tersedia";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(price);
}

function formatConcertDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Tanggal belum tersedia"
        : date.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short"
        });
}

function safeImageUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
        const url = new URL(value.trim(), window.location.href);
        return url.protocol === "http:" || url.protocol === "https:"
            ? url.href
            : null;
    } catch {
        return null;
    }
}

function createFallbackPoster(title) {
    const image = document.createElement("img");
    image.src = "images/cc.jpg";
    image.alt = `Poster ${title || "konser"} tidak tersedia`;
    image.className = "concert-img";
    image.loading = "lazy";
    image.addEventListener("error", () => {
        const placeholder = document.createElement("span");
        placeholder.textContent = "Poster tidak dapat dimuat";
        image.replaceWith(placeholder);
    }, { once: true });
    return image;
}

function createConcertCard(concert, compact) {
    const column = document.createElement("div");
    column.className = compact
        ? "col-md-4 concert-item"
        : "col-md-6 col-lg-4 concert-item";
    column.dataset.name = `${concert.title || ""} ${concert.artist || ""}`;

    const card = document.createElement("div");
    card.className = "concert-card";

    const imageContainer = document.createElement("div");
    imageContainer.className = "concert-image";

    const imageUrl = safeImageUrl(concert.poster_url);
    if (imageUrl) {
        const image = document.createElement("img");
        image.src = imageUrl;
        image.alt = `Poster ${concert.title || "konser"}`;
        image.className = "concert-img";
        image.loading = "lazy";
        image.addEventListener("error", () => {
            image.replaceWith(createFallbackPoster(concert.title));
        }, { once: true });
        imageContainer.appendChild(image);
    } else {
        imageContainer.appendChild(createFallbackPoster(concert.title));
    }

    const info = document.createElement("div");
    info.className = "concert-info";

    const artist = document.createElement("small");
    artist.textContent = concert.artist || "Artis";

    const title = document.createElement("h5");
    title.textContent = concert.title || "Konser";

    const details = document.createElement("p");
    const detailLines = [
        concert.location || "Lokasi belum tersedia",
        formatConcertDate(concert.date)
    ];
    if (!compact && concert.description) {
        detailLines.push(concert.description);
    }
    details.textContent = detailLines.join(" · ");

    const footer = document.createElement("div");
    footer.className = "d-flex justify-content-between align-items-center";

    const price = document.createElement("strong");
    price.textContent = `Regular ${formatRupiah(concert.regular_price)}`;

    const detailsLink = document.createElement("a");
    detailsLink.className = "card-link";
    detailsLink.href = `detail.html?id=${encodeURIComponent(concert.id)}`;
    detailsLink.textContent = compact ? "Details ↗" : "Get Ticket ↗";

    footer.append(price, detailsLink);
    info.append(artist, title, details, footer);
    card.append(imageContainer, info);
    column.appendChild(card);
    return column;
}

function showStatus(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("text-danger", Boolean(isError));
    element.classList.toggle("text-secondary", !isError);
}

function applySearch(items, searchInput, noConcert) {
    if (!searchInput) return;
    const keyword = searchInput.value.trim().toLocaleLowerCase("id");
    let visibleCount = 0;

    items.forEach(item => {
        const matches = item.textContent.toLocaleLowerCase("id").includes(keyword);
        item.hidden = !matches;
        if (matches) visibleCount++;
    });

    if (noConcert) noConcert.hidden = visibleCount > 0;
}

async function loadConcerts() {
    const featuredList = document.getElementById("featuredConcertList");
    const concertList = document.getElementById("concertList");
    if (!featuredList && !concertList) return;

    const featuredStatus = document.getElementById("featuredConcertStatus");
    const listStatus = document.getElementById("concertListStatus");
    const searchInput = document.getElementById("concertSearch");
    const noConcert = document.getElementById("noConcert");
    const { data: concerts, error } = await supabase
        .from("concerts")
        .select(concertFields)
        .eq("is_active", true)
        .order("date", { ascending: true });

    if (error) {
        console.error("Concert list load error:", error);
        showStatus(featuredStatus, "Konser gagal dimuat. Silakan coba lagi.", true);
        showStatus(listStatus, "Konser gagal dimuat. Silakan coba lagi.", true);
        if (noConcert) noConcert.hidden = true;
        return;
    }

    const activeConcerts = Array.isArray(concerts) ? concerts : [];
    if (featuredList) {
        featuredList.replaceChildren(
            ...activeConcerts.slice(0, 3).map(concert =>
                createConcertCard(concert, true)
            )
        );
    }
    if (concertList) {
        concertList.replaceChildren(
            ...activeConcerts.map(concert => createConcertCard(concert, false))
        );
        if (searchInput) {
            searchInput.addEventListener("input", () =>
                applySearch(
                    Array.from(concertList.querySelectorAll(".concert-item")),
                    searchInput,
                    noConcert
                )
            );
            applySearch(
                Array.from(concertList.querySelectorAll(".concert-item")),
                searchInput,
                noConcert
            );
        }
    }

    const emptyMessage = "Belum ada konser aktif.";
    showStatus(
        featuredStatus,
        activeConcerts.length ? "" : emptyMessage,
        false
    );
    showStatus(listStatus, activeConcerts.length ? "" : emptyMessage, false);
    if (noConcert) {
        noConcert.hidden = activeConcerts.length > 0;
        noConcert.textContent = "Konser tidak ditemukan.";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    void loadConcerts().catch(error => {
        console.error("Concert list load error:", error);
        showStatus(
            document.getElementById("featuredConcertStatus"),
            "Konser gagal dimuat. Silakan coba lagi.",
            true
        );
        showStatus(
            document.getElementById("concertListStatus"),
            "Konser gagal dimuat. Silakan coba lagi.",
            true
        );
    });
});
