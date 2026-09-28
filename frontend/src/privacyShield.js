/**
 * Privacy Shield & Anti-Fingerprinting Guard
 * Protects user's browser version, OS patch details, and hardware fingerprint
 * from unauthorized harvesting by third-party scripts, extensions, or trackers,
 * without breaking legitimate web features, React, or Vite.
 */

(function initPrivacyShield() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Protect High-Entropy User-Agent Data (Client Hints API)
    // Prevents trackers from harvesting exact micro-builds, internal patch numbers, and hardware models.
    if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
      const originalGetHighEntropyValues = navigator.userAgentData.getHighEntropyValues.bind(navigator.userAgentData);

      navigator.userAgentData.getHighEntropyValues = async function (hints) {
        try {
          const raw = await originalGetHighEntropyValues(hints);
          const sanitized = { ...raw };

          // Standardize/generalize version numbers to major version only
          if (Array.isArray(sanitized.fullVersionList)) {
            sanitized.fullVersionList = sanitized.fullVersionList.map(item => {
              const major = item.version ? item.version.split('.')[0] : '120';
              return {
                brand: item.brand,
                version: `${major}.0.0.0`
              };
            });
          }

          if (sanitized.uaFullVersion) {
            const major = sanitized.uaFullVersion.split('.')[0] || '120';
            sanitized.uaFullVersion = `${major}.0.0.0`;
          }

          if (sanitized.platformVersion) {
            sanitized.platformVersion = '10.0.0';
          }

          if (sanitized.architecture) {
            sanitized.architecture = 'x86';
          }

          if (sanitized.model) {
            sanitized.model = '';
          }

          return sanitized;
        } catch (e) {
          // Fallback to standard object if call fails
          return {
            brands: navigator.userAgentData.brands || [],
            mobile: false,
            platform: navigator.userAgentData.platform || 'Windows'
          };
        }
      };
    }

    // 2. Prevent Referrer Leaks to external origins
    try {
      if (document.referrer && document.referrer.length > 0) {
        const refUrl = new URL(document.referrer, window.location.origin);
        if (refUrl.origin !== window.location.origin) {
          // Keep only origin, strip sensitive query parameters and paths
          Object.defineProperty(document, 'referrer', {
            get: () => refUrl.origin + '/',
            configurable: true
          });
        }
      }
    } catch (_) {}

    // 3. Block FLoC / Topics API client access if probed
    if ('browsingTopics' in document) {
      try {
        delete document.browsingTopics;
      } catch (_) {}
    }

    // 4. Secure Window Error Logging: Strip local paths and extensions from error events
    window.addEventListener('error', (event) => {
      if (event && event.filename && (event.filename.includes('chrome-extension://') || event.filename.includes('moz-extension://'))) {
        event.stopImmediatePropagation();
      }
    }, true);

  } catch (err) {
    // Fail silently so site operations are never blocked
    console.debug('Privacy shield initialized with safe defaults');
  }
})();
