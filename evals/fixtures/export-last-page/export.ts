export function exportedPages(pages: readonly string[]): string[] {
  return pages.slice(0, -1);
}
