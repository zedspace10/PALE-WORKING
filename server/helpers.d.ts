export function buildExpsTarget(origin: string, basePath: string): string;
export function escapeHtml(value: unknown): string;
export function getLandingOrigin(options: {
  publicOrigin?: string;
  nodeEnv?: string;
  trustProxy?: boolean;
  headers?: Record<string, string | string[] | undefined>;
}): string;
export function renderLandingPage(
  template: string,
  values: {
    origin: string;
    expsTarget: string;
    appName: string;
    basePath: string;
    nonce: string;
    qrSvg: string;
  },
): string;
export function resolveStaticPath(root: string, urlPath: string): string | null;
export function stripBasePath(
  pathname: string,
  basePath: string,
): string | null;
export function validateBasePath(value?: string): string;
export function validateHost(value: unknown, localhostOnly?: boolean): string;
export function validateProtocol(value: unknown): string;
export function validatePublicOrigin(value: unknown): string;
