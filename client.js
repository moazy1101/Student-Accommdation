import { ReactInstance } from "react-360-web";

function init(bundle, parent, options = {}) {
  const r360 = new ReactInstance(bundle, parent, {
    // Add custom options here
    fullScreen: true,
    ...options,
  });

  // Render your app content to the default cylinder surface
  r360.renderToSurface(
    r360.createRoot("hello_vr", {
      /* initial props */
    }),
    r360.getDefaultSurface()
  );

  // Load the initial environment
  r360.compositor.setBackground(
    r360.getAssetURL("/src/components/assets/notfound.jpg")
  );
}

window.React360 = { init };
