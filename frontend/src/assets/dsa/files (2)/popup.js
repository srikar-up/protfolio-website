// ---------- Secure LeetSync Pro v2 : popup.js ----------
// Flow: read LEETCODE_SESSION + csrftoken cookies locally ->
// encrypt them with your repo's Actions public key (libsodium sealed box,
// as required by GitHub) -> upload as repo secrets -> trigger your
// existing "Sync LeetCode" workflow via workflow_dispatch.
// The PAT and repo path are stored only in chrome.storage.local.

const patInput = document.getElementById("patInput");
const repoInput = document.getElementById("repoInput");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const runBtn = document.getElementById("runBtn");
const statusBanner = document.getElementById("statusBanner");
const openGithubLink = document.getElementById("openGithubLink");

// ---------- Init: load saved config ----------
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["leetsync_pat", "leetsync_repo"], (result) => {
    if (result.leetsync_pat) patInput.value = result.leetsync_pat;
    if (result.leetsync_repo) repoInput.value = result.leetsync_repo;
  });
});

openGithubLink.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "https://github.com" });
});

saveConfigBtn.addEventListener("click", () => {
  const pat = patInput.value.trim();
  const repo = repoInput.value.trim();
  chrome.storage.local.set({ leetsync_pat: pat, leetsync_repo: repo }, () => {
    flashSaveConfirmation();
  });
});

function flashSaveConfirmation() {
  const original = saveConfigBtn.textContent;
  saveConfigBtn.textContent = "Saved ✓";
  setTimeout(() => {
    saveConfigBtn.textContent = original;
  }, 1200);
}

// ---------- Status banner helpers ----------
function showStatus(type, message) {
  statusBanner.className = "status-banner visible status-" + type;
  statusBanner.textContent = message;
}

function hideStatus() {
  statusBanner.className = "status-banner";
  statusBanner.textContent = "";
}

// ---------- Cookie helpers ----------
function getCookie(name) {
  return new Promise((resolve, reject) => {
    chrome.cookies.get({ url: "https://leetcode.com", name }, (cookie) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(cookie ? cookie.value : null);
    });
  });
}

// ---------- GitHub API helpers ----------
async function githubRequest(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      ...(options.headers || {})
    }
  });
  return res;
}

async function getRepoInfo(owner, repo, token) {
  const res = await githubRequest(`https://api.github.com/repos/${owner}/${repo}`, token);
  if (!res.ok) throw new Error(`Could not read repo info (${res.status}). Check the repo name and token access.`);
  return res.json();
}

async function getSecretsPublicKey(owner, repo, token) {
  const res = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`,
    token
  );
  if (!res.ok) throw new Error(`Could not fetch the repo's secrets public key (${res.status}). Token needs Secrets: write.`);
  return res.json();
}

async function putSecret(owner, repo, token, secretName, encryptedValueB64, keyId) {
  const res = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`,
    token,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encrypted_value: encryptedValueB64, key_id: keyId })
    }
  );
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).message || "";
    } catch (_) {}
    throw new Error(`Failed to set secret "${secretName}" (${res.status}): ${detail || "request failed"}`);
  }
}

async function listWorkflows(owner, repo, token) {
  const res = await githubRequest(`https://api.github.com/repos/${owner}/${repo}/actions/workflows`, token);
  if (!res.ok) throw new Error(`Could not list workflows (${res.status}). Token needs Actions: write.`);
  return res.json();
}

async function dispatchWorkflow(owner, repo, token, workflowId, ref) {
  const res = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
    token,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref })
    }
  );
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).message || "";
    } catch (_) {}
    throw new Error(`Failed to trigger the workflow (${res.status}): ${detail || "request failed"}`);
  }
}

// ---------- Sealed-box encryption (GitHub's required secret format) ----------
async function encryptForGithub(publicKeyBase64, plaintext) {
  await sodium.ready;
  const binKey = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);
  const binSecret = sodium.from_string(plaintext);
  const encryptedBytes = sodium.crypto_box_seal(binSecret, binKey);
  return sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);
}

// ---------- Main run flow ----------
runBtn.addEventListener("click", async () => {
  hideStatus();
  runBtn.disabled = true;

  try {
    showStatus("working", "⏳ Working/Syncing... reading LeetCode session cookies.");

    const { leetsync_pat: token, leetsync_repo: repoPath } = await chrome.storage.local.get([
      "leetsync_pat",
      "leetsync_repo"
    ]);

    if (!token || !repoPath || !repoPath.includes("/")) {
      throw new Error("Missing or invalid token/repository. Fill in Tile 2 and save first.");
    }

    const [owner, repo] = repoPath.split("/").map((s) => s.trim());
    if (!owner || !repo) {
      throw new Error("Repository must be in the form username/repository.");
    }

    const [sessionCookie, csrfCookie] = await Promise.all([
      getCookie("LEETCODE_SESSION"),
      getCookie("csrftoken")
    ]);

    if (!sessionCookie || !csrfCookie) {
      throw new Error("Couldn't find LeetCode session cookies. Log into leetcode.com in this browser and try again.");
    }

    showStatus("working", "⏳ Working/Syncing... fetching repo info and encryption key.");

    const [repoInfo, publicKeyInfo] = await Promise.all([
      getRepoInfo(owner, repo, token),
      getSecretsPublicKey(owner, repo, token)
    ]);

    const defaultBranch = repoInfo.default_branch || "main";

    showStatus("working", "⏳ Working/Syncing... encrypting and uploading session secrets.");

    const [encryptedSession, encryptedCsrf] = await Promise.all([
      encryptForGithub(publicKeyInfo.key, sessionCookie),
      encryptForGithub(publicKeyInfo.key, csrfCookie)
    ]);

    await putSecret(owner, repo, token, "LEETCODE_SESSION", encryptedSession, publicKeyInfo.key_id);
    await putSecret(owner, repo, token, "LEETCODE_CSRF_TOKEN", encryptedCsrf, publicKeyInfo.key_id);

    showStatus("working", "⏳ Working/Syncing... locating and triggering the Sync LeetCode workflow.");

    const { workflows } = await listWorkflows(owner, repo, token);
    const targetWorkflow = (workflows || []).find((wf) =>
      (wf.name || "").trim().toLowerCase() === "sync leetcode"
    ) || (workflows || []).find((wf) =>
      (wf.name || "").toLowerCase().includes("leetcode")
    );

    if (!targetWorkflow) {
      throw new Error('No workflow named "Sync LeetCode" was found in this repo. Check the workflow file is committed on the default branch.');
    }

    await dispatchWorkflow(owner, repo, token, targetWorkflow.id, defaultBranch);

    showStatus(
      "success",
      `✅ Success! Session secrets updated and "${targetWorkflow.name}" was triggered on ${defaultBranch}.`
    );
  } catch (err) {
    showStatus("error", `⚠️ ${err.message || "Something went wrong during sync."}`);
  } finally {
    runBtn.disabled = false;
  }
});
