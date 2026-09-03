export type ProfileLink = {
    label: string;
    href: string;
};

export const profile = {
    activityName: "Huney",
    serviceName: "はちみつと学ぶIT",
    introduction: "ITを学び始めた人が、最初の一歩を踏み出しやすい場所をつくっています。",
    nameOrigin: "Huneyという名前は、私が好きな黄色いクマのキャラクターが登場する世界観から着想を得ています。",
    learningPolicy: "完成された専門家が一方的に教えるのではなく、運営者自身も学びながら、理解したことを初心者にも読みやすい形で整理して発信します。",
    qualifications: [
        "ITパスポート試験",
        "AWS Certified Cloud Practitioner（AWSクラウドプラクティショナー）",
        "基本情報技術者試験",
        "情報セキュリティマネジメント試験",
        "応用情報技術者試験（挑戦中）",
    ],
    externalLinks: [] as ProfileLink[],
};
