import editorIcon from "./assets/editor-icon.png";

// Read configs from meta tags if available, otherwise use the process.env injected from build.
const configs = {};
const get = (configs, key, defaultValue) => {
  configs[key] = defaultValue;
};

get(configs, "HUBS_SERVER", process.env.HUBS_SERVER);
get(configs, "RETICULUM_SERVER", process.env.RETICULUM_SERVER);
get(configs, "THUMBNAIL_SERVER", process.env.THUMBNAIL_SERVER);
get(configs, "CORS_PROXY_SERVER", process.env.CORS_PROXY_SERVER);
get(configs, "NON_CORS_PROXY_DOMAINS", process.env.NON_CORS_PROXY_DOMAINS);
get(configs, "SENTRY_DSN", process.env.SENTRY_DSN);
get(configs, "GA_TRACKING_ID", process.env.GA_TRACKING_ID);
get(configs, "BASE_ASSETS_PATH", process.env.BASE_ASSETS_PATH);
get(configs, "IS_MOZ", process.env.IS_MOZ);

get(configs, "BACKEND_SERVER", process.env.BACKEND_SERVER);
get(configs, "BACKEND_ENDPOINT_PERMISSIONS", process.env.BACKEND_ENDPOINT_PERMISSIONS);
get(configs, "BACKEND_ENDPOINT_REFRESH_ACCESS_TOKEN", process.env.BACKEND_ENDPOINT_REFRESH_ACCESS_TOKEN);

if (configs.BASE_ASSETS_PATH) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = configs.BASE_ASSETS_PATH;
}

function fixBaseAssetsPath(path) {
  // eslint-disable-next-line no-undef
  if (!path.startsWith(__webpack_public_path__)) {
    // eslint-disable-next-line no-useless-escape
    const matches = path.match(/^([^\/]+\/).+$/);

    if (matches.length > 1) {
      // eslint-disable-next-line no-undef
      return __webpack_public_path__ + path.replace(matches[1], "");
    }
  }

  return path;
}

configs.name = () => "Scene Editor";
configs.longName = () => "Scene Editor";
configs.icon = () => fixBaseAssetsPath(editorIcon);

export default configs;
