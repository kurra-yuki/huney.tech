export type ArticleFrontmatter = {
    title: string;
    slug: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    category: string;
    tags?: string[];
    draft: boolean;
    recommended?: boolean;
    thumbnail?: string;
    ogImage?: string;
    youtube?: string;
    relatedArticles?: string[];
    seoTitle?: string;
};

export type ArticleSummary = ArticleFrontmatter & {
    readingTime: number;
};

export type ArticleDetail = ArticleSummary & {
    content: string;
};
