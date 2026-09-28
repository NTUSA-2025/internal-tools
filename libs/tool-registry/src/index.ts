export type ToolAuth = 'public' | 'required';

export interface ToolDefinition {
  id: 'qrcode' | 'short-url' | 'document-generator' | 'pdf-tools';
  title: string;
  description: string;
  path: string;
  auth: ToolAuth;
}

export const tools = [
  {
    id: 'qrcode',
    title: 'QR code',
    description:
      'Public QR code generator with optional authenticated logo overlay.',
    path: '/tools/qrcode',
    auth: 'public',
  },
  {
    id: 'short-url',
    title: 'Short URL',
    description: 'Authenticated management shell backed by Cloudflare D1.',
    path: '/tools/short-url',
    auth: 'required',
  },
  {
    id: 'document-generator',
    title: 'Document generator',
    description: 'Frontend-only workspace for official document generation.',
    path: '/tools/document-generator',
    auth: 'required',
  },
  {
    id: 'pdf-tools',
    title: 'PDF tools',
    description: 'Public frontend-only workspace for PDF utilities.',
    path: '/tools/pdf-tools',
    auth: 'public',
  },
] as const satisfies readonly ToolDefinition[];

export function getToolById(id: ToolDefinition['id']) {
  return tools.find((tool) => tool.id === id);
}
