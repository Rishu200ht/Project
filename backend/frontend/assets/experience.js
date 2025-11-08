// /assets/scriptt.js
// Frontend script to fetch experiences and render grid with Cloudinary videos

const API_BASE = "http://localhost:5000/experience"; // change if backend uses another host/port

const companiesGrid = document.getElementById("companiesGrid");
const domainFilter = document.getElementById("domainFilter");
const searchInput = document.getElementById("searchInput");

// helper: build query string
function qs(obj = {}) {
  const keys = Object.keys(obj).filter(k => obj[k] !== undefined && obj[k] !== "");
  return keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join("&");
}

// Create single grid card with video + details
function createCompanyCard(exp) {
  const container = document.createElement("div");
  container.className = "company-card";

  // Video wrapper
  const videoWrap = document.createElement("div");
  videoWrap.className = "company-video";

  // Create <video> element for Cloudinary URL
  const video = document.createElement("video");
  video.controls = true;
  video.width = 640; // width used by layout (CSS will scale responsively)
  video.setAttribute("playsinline", "");
  video.muted = true; // muted so it can autoplay if you later enable autoplay
  video.loop = false;
  video.preload = "metadata";

  // source element
  const source = document.createElement("source");
  source.src = exp.file || exp.videoUrl || ""; // file is where backend stores Cloudinary URL
  source.type = "video/mp4";

  // fallback text / link
  const fallback = document.createElement("div");
  fallback.className = "video-fallback";
  fallback.innerHTML = `<p>Video not playable here. <a href="${source.src}" target="_blank" rel="noopener">Open in new tab</a></p>`;

  video.appendChild(source);
  videoWrap.appendChild(video);
  videoWrap.appendChild(fallback);

  // Details section
  const details = document.createElement("div");
  details.className = "company-details";

  const h3 = document.createElement("h3");
  h3.className = "company-name";
  h3.textContent = exp.company || "Unknown Company";

  const submittedBy = document.createElement("p");
  submittedBy.innerHTML = `<strong>Submitted by:</strong> ${exp.name || "-"}`;

  const role = document.createElement("p");
  role.innerHTML = `<strong>Role:</strong> ${exp.jobProfile || exp.jobprofile || "-"}`;

  const placement = document.createElement("p");
  placement.innerHTML = `<strong>Placement:</strong> ${exp.placementType || exp.placementtype || "-"}`;

  if (exp.companyType) {
    const ctype = document.createElement("p");
    ctype.innerHTML = `<strong>Company Type:</strong> ${exp.companyType}`;
    details.appendChild(ctype);
  }

  // LinkedIn
  if (exp.linkedIn) {
    const ln = document.createElement("a");
    ln.href = exp.linkedIn;
    ln.target = "_blank";
    ln.rel = "noopener noreferrer";
    ln.className = "linkedin-link";
    ln.textContent = "View LinkedIn";
    details.appendChild(ln);
  }

  details.appendChild(h3);
  details.appendChild(submittedBy);
  details.appendChild(role);
  details.appendChild(placement);

  container.appendChild(videoWrap);
  container.appendChild(details);

  // Optional: play video on hover (muted) and pause on leave
  container.addEventListener("mouseenter", () => {
    try {
      video.play().catch(() => {});
    } catch {}
  });
  container.addEventListener("mouseleave", () => {
    try {
      video.pause();
      video.currentTime = 0;
    } catch {}
  });

  return container;
}

// Render function
function renderCompanies(list = []) {
  companiesGrid.innerHTML = "";
  if (!list.length) {
    companiesGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:2rem;">No experiences found.</p>`;
    return;
  }

  list.forEach(exp => {
    const card = createCompanyCard(exp);
    companiesGrid.appendChild(card);
  });
}

// Fetch all experiences
async function fetchAll() {
  try {
    const res = await fetch(`${API_BASE}/all`);
    const json = await res.json();
    if (res.ok && json.success) {
      renderCompanies(json.data);
    } else {
      console.error("Failed to fetch all experiences", json);
      renderCompanies([]);
    }
  } catch (err) {
    console.error("Fetch all error:", err);
    renderCompanies([]);
  }
}

// Fetch filtered experiences. Accepts params object: { company, jobProfile, placementType, search }
async function fetchFiltered(params = {}) {
  try {
    const query = qs(params);
    const url = query ? `${API_BASE}/filter?${query}` : `${API_BASE}/all`;
    const res = await fetch(url);
    const json = await res.json();
    if (res.ok && json.success) {
      renderCompanies(json.data);
    } else {
      console.error("Filter fetch failed", json);
      renderCompanies([]);
    }
  } catch (err) {
    console.error("Filter fetch error:", err);
    renderCompanies([]);
  }
}

// build filter params from UI controls
function getFilterParamsFromUI() {
  const domainValue = (domainFilter && domainFilter.value) ? domainFilter.value : "";
  const searchValue = (searchInput && searchInput.value) ? searchInput.value.trim() : "";

  const params = {};
  if (domainValue && domainValue !== "all") {
    // send as jobProfile — change to company if you want to filter by company instead
    params.jobProfile = domainValue;
  }
  if (searchValue) {
    params.search = searchValue;
  }
  return params;
}

// apply filters when user interacts
function applyFilters() {
  const params = getFilterParamsFromUI();
  if (Object.keys(params).length === 0) {
    fetchAll();
  } else {
    fetchFiltered(params);
  }
}

// events
if (domainFilter) domainFilter.addEventListener("change", applyFilters);
if (searchInput) {
  // simple debounce to avoid too many API calls
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => applyFilters(), 350);
  });
}

// initial load
document.addEventListener("DOMContentLoaded", () => {
  fetchAll();
});
