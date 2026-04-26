const SLUG_MAX_LENGTH = 50;
const ID_SUFFIX_LENGTH = 6;
const ASCII_MIN_LENGTH = 3;
const ID_FALLBACK_LENGTH = 8;

export class SlugBuilder {
  build(title: string, articleId: string): string {
    const ascii = this.extractAscii(title);

    if (ascii.length < ASCII_MIN_LENGTH) {
      return articleId.slice(0, ID_FALLBACK_LENGTH);
    }

    const idSuffix = articleId.slice(0, ID_SUFFIX_LENGTH);
    const trailerLength = idSuffix.length + 2; // "--" + suffix
    const allowedAsciiLength = SLUG_MAX_LENGTH - trailerLength;

    let slug = ascii.length > allowedAsciiLength ? ascii.slice(0, allowedAsciiLength) : ascii;
    slug = slug.replace(/-+$/u, "");

    if (slug.length === 0) {
      return articleId.slice(0, ID_FALLBACK_LENGTH);
    }

    return `${slug}--${idSuffix}`;
  }

  private extractAscii(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9-\s]/gu, "")
      .replace(/\s+/gu, "-")
      .replace(/-+/gu, "-")
      .replace(/^-+|-+$/gu, "");
  }
}
