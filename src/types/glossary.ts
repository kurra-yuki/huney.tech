export type GlossaryFrontmatter = {
    term: string;
    slug: string;
    summary: string;
    reading?: string;
    officialName?: string;
    category: string;
    draft: boolean;
    relatedTerms?: string[];
    relatedArticles?: string[];
    youtube?: string;
};

export type GlossaryEntry = GlossaryFrontmatter & {
    content: string;
};
