<template>
  <div class="global-sticky-top-banner">
    <div class="banner-content">
      <span class="badge">开源仓库</span>
      <span class="text">
        获取网站源码，请访问：
        <a
          href="https://github.com/softwarelink-net/26-riu-cfg-bid"
          target="_blank"
          rel="noopener noreferrer"
          class="repo-link"
        >
          https://github.com/softwarelink-net/26-riu-cfg-bid
        </a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.global-sticky-top-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 9999;
  background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #f8fafc;
}

.badge {
  background: #2563eb;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.repo-link {
  color: #38bdf8;
  font-weight: 500;
  text-decoration: underline;
  transition: color 0.2s;
}

.repo-link:hover {
  color: #7dd3fc;
}

@media (max-width: 720px) {
  .banner-content {
    padding: 0 12px;
    font-size: 12px;
  }
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 78vw;
  }
}
</style>
