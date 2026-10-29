# Figma MCP — what to call

Four tools do all the reading. Everything else on the server (code generation, Code Connect, shaders, Weave) is out of scope.

| Need | Tool | Notes |
|---|---|---|
| Outline of a page or frame: layer ids, names, types, positions, sizes | `get_metadata` with `nodeId` | Sparse XML, cheap. Without `nodeId` it lists the pages. Start here, always. |
| Structure and values of one section: text, fills, spacing, fonts, opacity | `get_design_context` with `nodeId`, `clientFrameworks: "html"` (or plain CSS) | Returns generated code; read it for values and hierarchy, never copy it into Webflow. One section per call, never a whole page. |
| Render to compare against | `get_screenshot` with `nodeId` | One node per call. Save it as `section-NN.png`. |
| Variables and styles used in a node | `get_variable_defs` with `nodeId` | Maps design tokens to names; match them to `references/variables.json`. |
| Images and icons out of the design | `download_assets`, up to 20 nodes, `defaultFormat` png/svg, `defaultScale` | Returns export URLs. Feed them to Webflow with `asset_tool > upload_image_by_url` straight away; the URLs expire. |

**Check an `export` before uploading it.** For a rotated or container-sized node (a group rotated −90° inside a `container-type: size` frame, e.g. background line art), `download_assets` returned an `export` that was a placeholder — a grey rectangle plus one huge frame path, none of the vectors. The `svgAssets` entry had the real vectors, unrotated. Take that one and apply the node's rotation yourself: wrap the content in `<g transform="translate(0 H) rotate(-90)">` (H = original width) and swap width and height. Upload a local file with `data_assets_tool > create_asset` + the S3 POST (webflow-mcp.md §9).

## Node ids

A Figma URL carries `?node-id=12-345`. The tool wants `12:345`. A page URL without `node-id` means: `get_metadata` first, pick the frames.

## Cost

Every call spends a Figma seat quota (a View seat has a small monthly allowance). That is why the dump is written once per section into `references/figma/<page>/` and every later step reads the files. Refetch only when the design changed.

## Reading the result

`get_design_context` output is a code proposal, not the truth: it flattens auto-layout into flex, invents class names and rounds values. Take from it the hierarchy, the text (full `characters`), fills, opacity, font, size, gap and padding. Then apply [figma-reading.md](figma-reading.md) to turn those into Lumos decisions.

## When the connection drops

If the Figma MCP (or the claude.ai Figma connector) reports "not connected" mid-session, reconnecting does not reach the running session: say so at once and offer a start prompt for a new session; do not build on without Figma. Opening a figma.com link through the browser tools is no way round it (it jumps to the Figma desktop app and `window.figma` does not exist in the web page). For a long unattended build, save every Figma read the build needs in `references/figma/` first.
